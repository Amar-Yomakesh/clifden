'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type Booking = {
  id: string
  treatment: string
  first_name: string
  last_name: string | null
  status: string
  booked_at: string
  deposit_amount_cents: number | null
  treatment_amount_cents: number | null
  professional: string | null
  appointment_date: string | null
  message: string | null
}

type Profile = {
  first_name: string
  last_name: string
  phone: string | null
}

const STATUS_STYLES: Record<string, { background: string; color: string }> = {
  awaiting_payment: { background: '#fff7ed', color: '#c2410c' },
  confirmed:        { background: '#f0fdf4', color: '#15803d' },
  completed:        { background: '#f1f5f9', color: '#475569' },
  cancelled:        { background: '#fef2f2', color: '#991b1b' },
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [profile, setProfile] = useState<Profile>({ first_name: '', last_name: '', phone: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setUser(user)

      // Load bookings and profile in parallel
      const [bookingsResult, profileResult] = await Promise.all([
        supabase.from('bookings').select('id, treatment, first_name, last_name, status, booked_at, deposit_amount_cents, treatment_amount_cents, professional, appointment_date, message')
          .eq('user_id', user.id).order('booked_at', { ascending: false }),
        supabase.from('profiles').select('first_name, last_name, phone').eq('id', user.id).single()
      ])

      if (bookingsResult.data) setBookings(bookingsResult.data)
      if (profileResult.data) setProfile(profileResult.data)
      setPageLoading(false)
    })
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  async function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg(null)

    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone || null
    }).eq('id', user!.id)

    setProfileMsg(error
      ? { type: 'error', text: 'Failed to save. Please try again.' }
      : { type: 'success', text: 'Profile updated successfully.' }
    )
    setProfileLoading(false)
  }

  if (pageLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', fontFamily: 'Jost, sans-serif', color: 'var(--medium-grey)', fontSize: '1.4rem' }}>
        Loading…
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'Jost, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'var(--dark-brown)', padding: '0 4rem', height: '7.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 400, color: 'var(--cream)', letterSpacing: '0.5px' }}>
          Clifden Beauty &amp; Laser Clinic
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.4rem' }}>
          <span style={{ fontSize: '1.2rem', color: 'rgba(249,245,240,0.55)', fontWeight: 300 }}>{user?.email}</span>
          <button
            onClick={handleSignOut}
            style={{ padding: '0.8rem 2rem', background: 'transparent', border: '1px solid rgba(201,169,110,0.4)', color: 'var(--gold-light)', fontFamily: 'Jost, sans-serif', fontSize: '1rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '6rem 4rem' }}>
        <div style={{ marginBottom: '4rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '0.8rem' }}>My Account</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 4vw, 4.8rem)', fontWeight: 300, color: 'var(--dark-brown)', lineHeight: 1.1 }}>
            Welcome back, {profile.first_name || user?.email?.split('@')[0]}
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--light-grey)', marginBottom: '4rem' }}>
          {(['bookings', 'profile'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1.2rem 2.4rem',
                background: 'none',
                border: 'none',
                fontFamily: 'Jost, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: activeTab === tab ? 'var(--dark-brown)' : 'var(--medium-grey)',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.2s'
              }}
            >
              {tab === 'bookings' ? 'My Bookings' : 'My Profile'}
            </button>
          ))}
        </div>

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '1px solid var(--light-grey)', background: 'var(--warm-white)' }}>
                <p style={{ fontSize: '1.5rem', color: 'var(--medium-grey)', fontWeight: 300, marginBottom: '2.4rem' }}>You have no bookings yet.</p>
                <Link href="/book" className="btn-primary">Book Your First Treatment</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                {bookings.map((b) => {
                  const statusStyle = STATUS_STYLES[b.status] ?? { background: '#f8f8f8', color: '#666' }
                  const bookedDate = new Date(b.booked_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
                  const apptDate = b.appointment_date
                    ? new Date(b.appointment_date).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
                    : null
                  let serviceNames: string
                  try {
                    const parsed = JSON.parse(b.treatment)
                    serviceNames = Array.isArray(parsed) ? parsed.join(', ') : b.treatment
                  } catch {
                    serviceNames = b.treatment
                  }
                  const balanceCents = b.treatment_amount_cents && b.deposit_amount_cents
                    ? Math.max(0, b.treatment_amount_cents - b.deposit_amount_cents)
                    : null
                  return (
                    <div key={b.id} style={{ background: 'var(--warm-white)', border: '1px solid var(--light-grey)', padding: '2.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.6rem' }}>
                      <div>
                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '0.4rem' }}>{serviceNames}</p>
                        <p style={{ fontSize: '1.2rem', color: 'var(--medium-grey)', fontWeight: 300 }}>{b.first_name} {b.last_name} · Booked {bookedDate}</p>
                        {(b.professional || apptDate) && (
                          <p style={{ fontSize: '1.2rem', color: 'var(--medium-grey)', fontWeight: 300, marginTop: '0.4rem' }}>
                            {b.professional && <>With: {b.professional}</>}
                            {b.professional && apptDate && ' · '}
                            {apptDate && <>Preferred: {apptDate}</>}
                          </p>
                        )}
                        {(b.deposit_amount_cents || b.treatment_amount_cents) && (
                          <p style={{ fontSize: '1.2rem', color: 'var(--medium-grey)', fontWeight: 300, marginTop: '0.4rem' }}>
                            {b.deposit_amount_cents && <>Deposit paid: €{(b.deposit_amount_cents / 100).toFixed(2)}</>}
                            {b.treatment_amount_cents && <> · Treatment total: €{(b.treatment_amount_cents / 100).toFixed(2)}</>}
                            {balanceCents !== null && <> · Balance at clinic: €{(balanceCents / 100).toFixed(2)}</>}
                          </p>
                        )}
                        {b.message && <p style={{ fontSize: '1.2rem', color: 'var(--medium-grey)', fontWeight: 300, marginTop: '0.8rem', fontStyle: 'italic' }}>&ldquo;{b.message}&rdquo;</p>}
                      </div>
                      <span style={{ padding: '0.6rem 1.4rem', fontSize: '1rem', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '2px', whiteSpace: 'nowrap', ...statusStyle }}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>
                  )
                })}
                <div style={{ marginTop: '2rem' }}>
                  <Link href="/book" className="btn-primary">Book Another Treatment</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} style={{ maxWidth: '48rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="p-fname">First Name</label>
                <input type="text" id="p-fname" value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="p-lname">Last Name</label>
                <input type="text" id="p-lname" value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={user?.email ?? ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label htmlFor="p-phone">Phone</label>
              <input type="tel" id="p-phone" value={profile.phone ?? ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+353 ..." />
            </div>
            <button type="submit" className="form-submit" disabled={profileLoading} style={{ maxWidth: '22rem' }}>
              {profileLoading ? 'Saving…' : 'Save Changes'}
            </button>
            {profileMsg && (
              <div style={{ marginTop: '1.6rem', padding: '1.2rem 1.6rem', fontSize: '1.3rem', background: profileMsg.type === 'error' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${profileMsg.type === 'error' ? '#fca5a5' : '#86efac'}`, color: profileMsg.type === 'error' ? '#991b1b' : '#166534' }}>
                {profileMsg.text}
              </div>
            )}
          </form>
        )}
      </main>
    </div>
  )
}
