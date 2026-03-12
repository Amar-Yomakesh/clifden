'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const hb1 = useRef<HTMLSpanElement>(null)
  const hb2 = useRef<HTMLSpanElement>(null)
  const hb3 = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  function toggleMenu() {
    const next = !open
    setOpen(next)
    if (hb1.current) hb1.current.style.transform = next ? 'rotate(45deg) translate(4px, 4px)' : ''
    if (hb2.current) hb2.current.style.opacity = next ? '0' : ''
    if (hb3.current) hb3.current.style.transform = next ? 'rotate(-45deg) translate(4px, -4px)' : ''
  }

  function closeMenu() {
    setOpen(false)
    if (hb1.current) hb1.current.style.transform = ''
    if (hb2.current) hb2.current.style.opacity = ''
    if (hb3.current) hb3.current.style.transform = ''
  }

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={closeMenu}>
          Clifden Beauty &amp; Laser Clinic
          <span>Clifden · Galway · Ireland</span>
        </Link>

        <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          <li><a href="/#treatments" onClick={closeMenu}>Treatments</a></li>
          <li><a href="/#pricing" onClick={closeMenu}>Prices</a></li>
          <li><a href="/#about" onClick={closeMenu}>About</a></li>
          <li><a href="/#contact" onClick={closeMenu}>Contact</a></li>
          <li>
            <Link
              href={isLoggedIn ? '/account' : '/login'}
              className="nav-book"
              onClick={closeMenu}
            >
              {isLoggedIn ? 'My Account' : 'Login'}
            </Link>
          </li>
          <li><Link href="/book" className="nav-book" onClick={closeMenu}>Book Now</Link></li>
        </ul>

        <button
          className="nav-hamburger"
          id="navHamburger"
          aria-label="Open navigation"
          onClick={toggleMenu}
        >
          <span ref={hb1} />
          <span ref={hb2} />
          <span ref={hb3} />
        </button>
      </div>
    </header>
  )
}
