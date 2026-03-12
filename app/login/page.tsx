'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const form = e.currentTarget
    const firstName = (form.elements.namedItem('first_name') as HTMLInputElement).value.trim()
    const lastName = (form.elements.namedItem('last_name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, phone: phone || null }
      }
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    setMessage({ type: 'success', text: 'Account created! Check your email to confirm your address, then sign in.' })
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      fontFamily: 'Jost, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '46rem',
        background: 'var(--warm-white)',
        border: '1px solid var(--light-grey)',
        padding: '4.8rem'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '3.6rem' }}>
          <Link href="/" style={{
            display: 'block',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.4rem',
            fontWeight: 300,
            color: 'var(--dark-brown)',
            marginBottom: '0.6rem'
          }}>
            Clifden Beauty &amp; Laser Clinic
          </Link>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'var(--gold)'
          }}>
            Client Portal
          </span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--light-grey)',
          marginBottom: '3.2rem'
        }}>
          {(['signin', 'signup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setMessage(null) }}
              style={{
                flex: 1,
                padding: '1.2rem',
                background: 'none',
                border: 'none',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: activeTab === tab ? 'var(--dark-brown)' : 'var(--medium-grey)',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.2s, border-color 0.2s'
              }}
            >
              {tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label htmlFor="si-email">Email Address</label>
              <input type="email" id="si-email" name="email" autoComplete="email" required placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label htmlFor="si-password">Password</label>
              <input type="password" id="si-password" name="password" autoComplete="current-password" required placeholder="Your password" />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="su-fname">First Name</label>
                <input type="text" id="su-fname" name="first_name" autoComplete="given-name" required placeholder="Jane" />
              </div>
              <div className="form-group">
                <label htmlFor="su-lname">Last Name</label>
                <input type="text" id="su-lname" name="last_name" autoComplete="family-name" placeholder="Smith" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="su-email">Email Address</label>
              <input type="email" id="su-email" name="email" autoComplete="email" required placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label htmlFor="su-phone">Phone (Optional)</label>
              <input type="tel" id="su-phone" name="phone" autoComplete="tel" placeholder="+353 ..." />
            </div>
            <div className="form-group">
              <label htmlFor="su-password">Password</label>
              <input type="password" id="su-password" name="password" autoComplete="new-password" required placeholder="Min. 8 characters" minLength={8} />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Messages */}
        {message && (
          <div style={{
            marginTop: '2rem',
            padding: '1.4rem 1.6rem',
            fontSize: '1.3rem',
            fontWeight: 400,
            background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${message.type === 'error' ? '#fca5a5' : '#86efac'}`,
            color: message.type === 'error' ? '#991b1b' : '#166534'
          }}>
            {message.text}
          </div>
        )}

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '3.2rem' }}>
          <Link href="/" style={{
            fontSize: '1.1rem',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--medium-grey)',
            borderBottom: '1px solid var(--light-grey)',
            paddingBottom: '0.2rem',
            transition: 'color 0.2s'
          }}>
            ← Back to Site
          </Link>
        </div>
      </div>
    </div>
  )
}
