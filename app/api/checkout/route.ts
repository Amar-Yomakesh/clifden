import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const DEPOSIT_AMOUNT = Number(process.env.NEXT_PUBLIC_DEPOSIT_AMOUNT_CENTS ?? 3000)

type SelectedService = { name: string; price: number; category: string }

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      selectedServices,
      professional,
      appointmentDate,
      treatmentAmountCents,
      patchTestAcknowledged,
      patchTestAnswer,
    } = body

    // Validation
    if (!firstName || !email) {
      return NextResponse.json({ error: 'First name and email are required' }, { status: 400 })
    }
    if (!selectedServices || (selectedServices as SelectedService[]).length === 0) {
      return NextResponse.json({ error: 'At least one service must be selected' }, { status: 400 })
    }
    if (!professional) {
      return NextResponse.json({ error: 'A professional must be selected' }, { status: 400 })
    }
    if (!appointmentDate) {
      return NextResponse.json({ error: 'A preferred date is required' }, { status: 400 })
    }
    if (!patchTestAcknowledged) {
      return NextResponse.json({ error: 'Patch test acknowledgment is required' }, { status: 400 })
    }

    const serviceNames: string[] = (selectedServices as SelectedService[]).map((s) => s.name)
    const totalEur = (treatmentAmountCents as number) / 100
    const balanceEur = Math.max(0, totalEur - DEPOSIT_AMOUNT / 100)

    const formattedDate = new Date(appointmentDate + 'T00:00:00').toLocaleDateString('en-IE', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    // Insert booking
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        user_id:                 user.id,
        first_name:              firstName,
        last_name:               lastName || null,
        email,
        phone:                   phone || null,
        treatment:               JSON.stringify(serviceNames),
        professional,
        appointment_date:        appointmentDate,
        treatment_amount_cents:  treatmentAmountCents,
        patch_test_acknowledged: patchTestAcknowledged,
        status:                  'awaiting_payment',
        deposit_amount_cents:    DEPOSIT_AMOUNT,
        message:                 patchTestAnswer ? `Patch test: ${patchTestAnswer}` : null,
      })
      .select('id')
      .single()

    if (insertError || !booking) {
      console.error('Booking insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: DEPOSIT_AMOUNT,
            product_data: {
              name: `Appointment Deposit — ${professional}`,
              description: `Booking with ${professional} on ${formattedDate}. Services: ${serviceNames.join(', ')}. Treatment total: €${totalEur}. Balance due at clinic: €${balanceEur}.`,
            },
          },
        },
      ],
      metadata: {
        booking_id: booking.id,
        user_id:    user.id,
      },
      success_url: `${baseUrl}/account?booking=confirmed`,
      cancel_url:  `${baseUrl}/book`,
    })

    // Store Stripe session ID
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
