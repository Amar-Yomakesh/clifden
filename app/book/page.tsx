'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import servicesData from '@/brand_assets/clifden_services_pricing.json'

// ── Types ──────────────────────────────────────────────────────────────────────
type ServiceEntry = {
  name: string
  price: string
  patchTestRequired: boolean
  description: string | null
  duration: string
}

type SelectedService = {
  name: string
  price: number
  category: string
  patchTestRequired: boolean
}

type Step = 1 | 2 | 3 | 4 | 5 | 6

// ── Parse services from JSON ───────────────────────────────────────────────────
const CATEGORIES: { label: string; services: (ServiceEntry & { _category: string })[] }[] =
  Object.entries(servicesData.Services).map(([key, items]) => ({
    label: key === 'featured' ? 'Featured Services' : key,
    services: (items as ServiceEntry[]).map((s) => ({ ...s, _category: key })),
  }))

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[€,]/g, '')) || 0
}

const DEPOSIT_AMOUNT = Number(process.env.NEXT_PUBLIC_DEPOSIT_AMOUNT_CENTS ?? 3000)
const DEPOSIT_EUR = DEPOSIT_AMOUNT / 100

// ── Progress bar labels ────────────────────────────────────────────────────────
const STEPS = ['Contact', 'Services', 'Professional', 'Date', 'Patch Test', 'Confirm']

// ── Helpers ────────────────────────────────────────────────────────────────────
function minBookingDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 2)
  return d.toISOString().split('T')[0]
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function BookPage() {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1 — Contact
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' })

  // Step 2 — Services
  const [selected, setSelected] = useState<SelectedService[]>([])

  // Step 3 — Professional
  const [professional, setProfessional] = useState<'Isabel' | 'Shahmeem' | ''>('')

  // Step 4 — Date
  const [appointmentDate, setAppointmentDate] = useState('')

  // Step 5 — Patch test
  const [patchTestAnswer, setPatchTestAnswer] = useState<'yes' | 'no' | ''>('')

  // Pre-fill contact from profile
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('id', user.id)
        .single()
      setContact((prev) => ({
        firstName: prev.firstName || profile?.first_name || '',
        lastName: prev.lastName || profile?.last_name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || profile?.phone || '',
      }))
    })
  }, [])

  const totalAmount = selected.reduce((sum, s) => sum + s.price, 0)
  const balanceDue = Math.max(0, totalAmount - DEPOSIT_EUR)
  const anyPatchTestRequired = selected.some((s) => s.patchTestRequired)

  // ── Service toggle ────────────────────────────────────────────────────────────
  function toggleService(entry: ServiceEntry & { _category: string }) {
    const price = parsePrice(entry.price)
    setSelected((prev) => {
      const exists = prev.find((s) => s.name === entry.name)
      if (exists) return prev.filter((s) => s.name !== entry.name)
      return [...prev, { name: entry.name, price, category: entry._category, patchTestRequired: entry.patchTestRequired }]
    })
  }

  // ── Navigation ────────────────────────────────────────────────────────────────
  function next() {
    setError(null)
    if (step === 1) {
      if (!contact.firstName.trim() || !contact.email.trim()) {
        setError('First name and email are required.')
        return
      }
    }
    if (step === 2) {
      if (selected.length === 0) {
        setError('Please select at least one service.')
        return
      }
    }
    if (step === 3) {
      if (!professional) {
        setError('Please choose a professional.')
        return
      }
    }
    if (step === 4) {
      if (!appointmentDate) {
        setError('Please select a preferred date.')
        return
      }
      if (appointmentDate < minBookingDate()) {
        setError('Please select a date at least 2 days from today (patch test requirement).')
        return
      }
    }
    if (step === 5) {
      if (!patchTestAnswer) {
        setError('Please confirm your patch test status.')
        return
      }
    }
    setStep((s) => (s < 6 ? ((s + 1) as Step) : s))
  }

  function back() {
    setError(null)
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s))
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        selectedServices: selected,
        professional,
        appointmentDate,
        treatmentAmountCents: Math.round(totalAmount * 100),
        patchTestAcknowledged: true,
        patchTestAnswer,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    window.location.href = data.url
  }

  // ── Shared styles ─────────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: 'var(--warm-white)',
    border: '1px solid var(--light-grey)',
    padding: '4rem',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'Jost, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'var(--warm-white)', borderBottom: '1px solid var(--light-grey)', padding: '0 4rem', height: '7.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '0.5px', lineHeight: 1.2 }}>
          Clifden Beauty &amp; Laser Clinic
          <span style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginTop: '0.2rem' }}>Clifden · Galway · Ireland</span>
        </Link>
        <Link href="/" style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--medium-grey)', borderBottom: '1px solid var(--light-grey)', paddingBottom: '0.2rem' }}>
          ← Back to Site
        </Link>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 4rem 8rem' }}>

        {/* Page heading */}
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '1rem' }}>Book Online</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 300, color: 'var(--dark-brown)', lineHeight: 1.05 }}>
            Secure Your <em>Appointment</em>
          </h1>
        </div>

        {/* Progress bar */}
        <ProgressBar step={step} />

        {/* Error banner */}
        {error && (
          <div style={{ margin: '2rem 0', padding: '1.4rem 1.6rem', fontSize: '1.3rem', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' }}>
            {error}
          </div>
        )}

        {/* ── Step 1: Contact ──────────────────────────────────────────────────── */}
        {step === 1 && (
          <div style={card}>
            <StepHeading title="Your Details" sub="Tell us how to reach you." />
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fname">First Name *</label>
                <input id="fname" type="text" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} placeholder="Jane" />
              </div>
              <div className="form-group">
                <label htmlFor="lname">Last Name</label>
                <input id="lname" type="text" value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} placeholder="Smith" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@email.com" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+353 ..." />
              </div>
            </div>
            <NavButtons step={step} onBack={back} onNext={next} />
          </div>
        )}

        {/* ── Step 2: Services ────────────────────────────────────────────────── */}
        {step === 2 && (
          <div style={card}>
            <StepHeading title="Select Your Services" sub="Choose one or more treatments. Prices are per session." />

            {CATEGORIES.map(({ label, services }) => (
              <div key={label} style={{ marginBottom: '3.2rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '1.2rem', borderBottom: '1px solid var(--light-grey)', paddingBottom: '0.8rem' }}>
                  {label}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {services.map((svc) => {
                    const isChecked = selected.some((s) => s.name === svc.name)
                    return (
                      <label
                        key={svc.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.6rem',
                          padding: '1.4rem 1.6rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--light-grey)',
                          background: isChecked ? 'rgba(201,169,110,0.06)' : 'transparent',
                          transition: 'background 0.15s',
                        }}
                      >
                        <span style={{
                          width: '2rem',
                          height: '2rem',
                          border: `1.5px solid ${isChecked ? 'var(--gold)' : 'var(--medium-grey)'}`,
                          background: isChecked ? 'var(--gold)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: 'var(--dark-brown)',
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          transition: 'all 0.15s',
                        }}>
                          {isChecked ? '✓' : ''}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleService(svc)}
                          style={{ display: 'none' }}
                        />
                        <span style={{ flex: 1, fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)' }}>
                          {svc.name}
                          {svc.duration && (
                            <span style={{ fontSize: '1.1rem', color: 'var(--medium-grey)', marginLeft: '0.8rem' }}>{svc.duration}</span>
                          )}
                        </span>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--dark-brown)', whiteSpace: 'nowrap' }}>
                          {svc.price}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Running total */}
            <div style={{ borderTop: '2px solid var(--light-grey)', paddingTop: '2.4rem', marginTop: '1.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--medium-grey)' }}>
                Treatment Total {selected.length > 0 ? `(${selected.length} service${selected.length > 1 ? 's' : ''})` : ''}
              </span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.2rem', fontWeight: 300, color: totalAmount > 0 ? 'var(--dark-brown)' : 'var(--light-grey)' }}>
                €{totalAmount.toFixed(2).replace('.00', '')}
              </span>
            </div>

            {anyPatchTestRequired && selected.length > 0 && (
              <div style={{ marginTop: '1.6rem', padding: '1.2rem 1.6rem', background: 'var(--blush)', borderLeft: '3px solid var(--gold)', fontSize: '1.2rem', color: 'var(--medium-grey)' }}>
                ⚠ One or more selected treatments require a patch test — see Step 5
              </div>
            )}

            <NavButtons step={step} onBack={back} onNext={next} />
          </div>
        )}

        {/* ── Step 3: Professional ─────────────────────────────────────────────── */}
        {step === 3 && (
          <div style={card}>
            <StepHeading title="Choose Your Professional" sub="Both therapists offer all treatments." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.4rem', margin: '3.2rem 0' }}>
              {(['Isabel', 'Shahmeem'] as const).map((name) => {
                const isSelected = professional === name
                return (
                  <button
                    key={name}
                    onClick={() => setProfessional(name)}
                    style={{
                      padding: '3.6rem 2.4rem',
                      border: `2px solid ${isSelected ? 'var(--gold)' : 'var(--light-grey)'}`,
                      background: isSelected ? 'rgba(201,169,110,0.06)' : 'var(--cream)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      position: 'relative',
                      transition: 'border-color 0.2s, background 0.2s',
                      fontFamily: 'Jost, sans-serif',
                    }}
                  >
                    {isSelected && (
                      <span style={{ position: 'absolute', top: '1.4rem', right: '1.6rem', background: 'var(--gold)', color: 'var(--dark-brown)', fontSize: '1.2rem', fontWeight: 700, width: '2.4rem', height: '2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                    )}
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 300, color: 'var(--dark-brown)', marginBottom: '0.8rem', lineHeight: 1 }}>{name}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.2rem' }}>
                      {name === 'Isabel' ? 'Senior Aesthetic Therapist' : 'Aesthetic Therapist'}
                    </p>
                    <p style={{ fontSize: '1.3rem', fontWeight: 300, color: 'var(--medium-grey)', lineHeight: 1.7 }}>
                      {name === 'Isabel'
                        ? 'Over 20 years of expertise across all skin and laser treatments.'
                        : 'Specialised in advanced skin treatments and laser therapies.'}
                    </p>
                  </button>
                )
              })}
            </div>
            <NavButtons step={step} onBack={back} onNext={next} />
          </div>
        )}

        {/* ── Step 4: Date ─────────────────────────────────────────────────────── */}
        {step === 4 && (
          <div style={card}>
            <StepHeading title="Preferred Appointment Date" sub="We will call you to confirm final availability." />
            <div className="form-group" style={{ maxWidth: '32rem', margin: '3.2rem 0' }}>
              <label htmlFor="appt-date">Preferred Date *</label>
              <input
                id="appt-date"
                type="date"
                value={appointmentDate}
                min={minBookingDate()}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <div style={{ padding: '1.6rem 2rem', background: 'var(--blush)', borderLeft: '3px solid var(--gold)', fontSize: '1.3rem', color: 'var(--medium-grey)', lineHeight: 1.75, marginBottom: '1.6rem' }}>
              📅 Your slot is not confirmed until we call you. Earliest available date is 48 hours from today (patch test requirement).
            </div>
            <NavButtons step={step} onBack={back} onNext={next} />
          </div>
        )}

        {/* ── Step 5: Patch Test ───────────────────────────────────────────────── */}
        {step === 5 && (
          <div style={card}>
            <StepHeading title="Patch Test Requirement" sub="Please read and confirm before proceeding." />

            <div style={{ padding: '2.4rem', background: 'var(--blush)', borderLeft: '3px solid var(--gold)', margin: '2.4rem 0', lineHeight: 1.85 }}>
              <p style={{ fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)' }}>
                Clifden Beauty &amp; Laser Clinic requires you to complete a patch test in-store. If you haven&apos;t had it in the last 6 months, you will need to attend at least 48 hours before your appointment.
              </p>
            </div>

            {anyPatchTestRequired && (
              <div style={{ padding: '1.2rem 1.6rem', background: '#fff7ed', borderLeft: '3px solid #fb923c', fontSize: '1.2rem', color: '#92400e', marginBottom: '2.4rem' }}>
                ⚠ Your selected treatments require a patch test. Please ensure you have completed one before your appointment date.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              {[
                { value: 'yes', label: 'Yes — I have had a patch test within the last 6 months' },
                { value: 'no', label: 'No — I will arrange a patch test at least 48 hours before my appointment' },
              ].map(({ value, label }) => {
                const isSelected = patchTestAnswer === value
                return (
                  <label
                    key={value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.6rem',
                      padding: '1.8rem 2rem',
                      border: `2px solid ${isSelected ? 'var(--gold)' : 'var(--light-grey)'}`,
                      background: isSelected ? 'rgba(201,169,110,0.06)' : 'var(--cream)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{
                      width: '2rem',
                      height: '2rem',
                      border: `1.5px solid ${isSelected ? 'var(--gold)' : 'var(--medium-grey)'}`,
                      borderRadius: '50%',
                      background: isSelected ? 'var(--gold)' : 'transparent',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }} />
                    <input
                      type="radio"
                      name="patchTest"
                      value={value}
                      checked={isSelected}
                      onChange={() => setPatchTestAnswer(value as 'yes' | 'no')}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)' }}>{label}</span>
                  </label>
                )
              })}
            </div>

            <NavButtons step={step} onBack={back} onNext={next} />
          </div>
        )}

        {/* ── Step 6: Summary ──────────────────────────────────────────────────── */}
        {step === 6 && (
          <div style={card}>
            <StepHeading title="Review &amp; Confirm" sub="Please check your booking details before paying." />

            {/* Services */}
            <div style={{ marginBottom: '3.2rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--medium-grey)', marginBottom: '1.2rem' }}>Selected Services</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {selected.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 0', borderBottom: '1px solid var(--light-grey)' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)' }}>{s.name}</span>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--dark-brown)' }}>€{s.price}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ marginTop: '1.6rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 300, color: 'var(--medium-grey)' }}>Treatment Total</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--dark-brown)' }}>€{totalAmount.toFixed(2).replace('.00', '')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 500, color: 'var(--dark-brown)' }}>Deposit to pay now</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--gold-dark)' }}>€{DEPOSIT_EUR}</span>
                </div>
                {balanceDue > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 300, color: 'var(--medium-grey)' }}>Balance due at clinic</span>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)' }}>€{balanceDue.toFixed(2).replace('.00', '')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking details grid */}
            <div style={{ borderTop: '1px solid var(--light-grey)', paddingTop: '2.4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3.2rem' }}>
              <SummaryDetail label="Contact" value={`${contact.firstName} ${contact.lastName}`.trim()} />
              <SummaryDetail label="Email" value={contact.email} />
              {contact.phone && <SummaryDetail label="Phone" value={contact.phone} />}
              <SummaryDetail label="Professional" value={professional} />
              <SummaryDetail label="Preferred Date" value={formatDate(appointmentDate)} />
              <SummaryDetail label="Patch Test" value={patchTestAnswer === 'yes' ? '✓ Completed within 6 months' : '✓ Will arrange 48h before'} />
            </div>

            {error && (
              <div style={{ marginBottom: '2rem', padding: '1.4rem 1.6rem', fontSize: '1.3rem', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="form-submit"
            >
              {loading ? 'Redirecting to Payment…' : `Pay €${DEPOSIT_EUR} Deposit & Confirm Booking`}
            </button>
            <p style={{ fontSize: '1.1rem', color: 'var(--medium-grey)', fontWeight: 300, textAlign: 'center', marginTop: '1.6rem', lineHeight: 1.7 }}>
              Secure payment via Stripe. Your card details are never stored on our servers.
            </p>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button onClick={back} style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--medium-grey)', cursor: 'pointer', fontFamily: 'Jost, sans-serif' }}>
                ← Edit Booking
              </button>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @media (max-width: 768px) {
          main { padding: 4rem 2rem 6rem !important; }
          .form-row { grid-template-columns: 1fr !important; gap: 0 !important; }
        }
        @media (max-width: 540px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: Step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3.2rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
      {STEPS.map((label, i) => {
        const num = i + 1
        const done = step > num
        const active = step === num
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? '1' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
              <div style={{
                width: '3.2rem',
                height: '3.2rem',
                borderRadius: '50%',
                background: done ? 'var(--gold)' : active ? 'var(--dark-brown)' : 'var(--light-grey)',
                color: done || active ? (done ? 'var(--dark-brown)' : 'var(--cream)') : 'var(--medium-grey)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 700,
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : num}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: active ? 'var(--dark-brown)' : done ? 'var(--gold-dark)' : 'var(--medium-grey)', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: '1px', background: done ? 'var(--gold)' : 'var(--light-grey)', margin: '0 0.8rem', marginBottom: '2.2rem', transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: '3.2rem' }}>
      <h2
        style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem, 3.5vw, 3.4rem)', fontWeight: 300, color: 'var(--dark-brown)', marginBottom: '0.8rem' }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p style={{ fontSize: '1.3rem', color: 'var(--medium-grey)', fontWeight: 300 }}>{sub}</p>
    </div>
  )
}

function NavButtons({ step, onBack, onNext }: { step: Step; onBack: () => void; onNext: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3.2rem', paddingTop: '2.4rem', borderTop: '1px solid var(--light-grey)' }}>
      {step > 1 ? (
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--medium-grey)', cursor: 'pointer', fontFamily: 'Jost, sans-serif' }}>
          ← Back
        </button>
      ) : <div />}
      <button onClick={onNext} className="btn-primary">
        {step === 5 ? 'Review Booking →' : 'Next →'}
      </button>
    </div>
  )
}

function SummaryDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--medium-grey)', marginBottom: '0.4rem' }}>{label}</p>
      <p style={{ fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)' }}>{value}</p>
    </div>
  )
}
