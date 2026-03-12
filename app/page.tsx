import Nav from '@/components/Nav'
import PricingTabs from '@/components/PricingTabs'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">
        <div>
          <a href="tel:+35395215XX">+353 95 215 XX</a>
          <span className="top-bar-sep">|</span>
          <a href="mailto:info@clifdenbeautylaserclinic.com">info@clifdenbeautylaserclinic.com</a>
        </div>
        <div className="top-bar-right">
          <span style={{ color: 'rgba(201,169,110,0.72)', fontSize: '1.1rem' }}>Clifden, Co. Galway</span>
          <span className="top-bar-sep">|</span>
          <span style={{ color: 'rgba(201,169,110,0.72)', fontSize: '1.1rem' }}>Mon–Sat: 9am–6pm</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Advanced Skin Solutions · Clifden, Galway</span>
          <h1 className="hero-title">
            Beauty That<br />
            <em>Never Ages</em>
          </h1>
          <p className="hero-desc">
            Transformative, bespoke skincare treatments tailored to your unique skin. Over 20 years of trusted expertise in the heart of Connemara.
          </p>
          <div className="hero-actions">
            <Link href="/book" className="btn-primary">Book Your Consultation</Link>
            <a href="#treatments" className="btn-text">Our Treatments</a>
          </div>
        </div>

        <div className="hero-media">
          <Image
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80"
            alt="Luxury skincare treatment at Clifden Beauty & Laser Clinic"
            fill
            style={{ objectFit: 'cover', opacity: 0.75 }}
            priority
          />
          <div className="hero-media-overlay" />
          <div className="hero-badge">
            <div className="hero-badge-num">20+</div>
            <div className="hero-badge-text">Years Experience</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          <span className="marquee-item">Laser Hair Removal</span><span className="marquee-dot">·</span>
          <span className="marquee-item">IPL Skin Treatments</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Cosmetic Injectables</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Advanced Facials</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Radio Frequency</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Waxing &amp; Threading</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Clifden · Galway</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Laser Hair Removal</span><span className="marquee-dot">·</span>
          <span className="marquee-item">IPL Skin Treatments</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Cosmetic Injectables</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Advanced Facials</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Radio Frequency</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Waxing &amp; Threading</span><span className="marquee-dot">·</span>
          <span className="marquee-item">Clifden · Galway</span><span className="marquee-dot">·</span>
        </div>
      </div>

      {/* INTRO / ABOUT */}
      <section className="intro" id="about">
        <div>
          <span className="section-label">Our Philosophy</span>
          <h2 className="intro-title">Bespoke Treatments<br />Tailored To You</h2>
          <p className="intro-body">
            At Clifden Beauty &amp; Laser Clinic, we believe that no two skins are alike. Our philosophy is rooted in providing customised skincare treatments targeting different skin types and conditions. With bespoke beauty treatments, we ensure you leave our clinic with your best face forward — glowing, confident skin.
          </p>
          <div className="intro-stats">
            <div>
              <div className="stat-num">20+</div>
              <div className="stat-label">Years Expertise</div>
            </div>
            <div>
              <div className="stat-num">500+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div>
              <div className="stat-num">FDA</div>
              <div className="stat-label">CE Approved</div>
            </div>
          </div>
          <Link href="/book" className="btn-primary">Find Your Treatment</Link>
        </div>

        <div className="intro-photo">
          <div className="intro-photo-bg" />
          <Image
            src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80"
            alt="Personalised beauty consultation"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="intro-photo-accent" />
        </div>
      </section>

      {/* TREATMENT CATEGORIES */}
      <section className="categories-section" id="treatments">
        <div className="categories-inner">
          <div className="section-header">
            <span className="section-label">What We Offer</span>
            <h2 className="section-title">Our Treatment Categories</h2>
          </div>

          <div className="categories-grid">
            <div className="cat-card">
              <div className="cat-card-bg" style={{ background: 'linear-gradient(160deg, #1A0A05 0%, #3D2B1F 60%, #5A3525 100%)' }} />
              <div className="cat-card-overlay" />
              <div className="cat-card-body">
                <p className="cat-card-tag">Advanced Technology</p>
                <h3 className="cat-card-title">Laser Hair<br />Removal</h3>
                <p className="cat-card-from">From €45 per session</p>
                <a href="#pricing" className="cat-card-link">View Prices →</a>
              </div>
            </div>

            <div className="cat-card">
              <div className="cat-card-bg" style={{ background: 'linear-gradient(160deg, #3D2010 0%, #8A5535 60%, #C9A96E 100%)' }} />
              <div className="cat-card-overlay" />
              <div className="cat-card-body">
                <p className="cat-card-tag">Skin Clarity</p>
                <h3 className="cat-card-title">IPL Skin<br />Treatments</h3>
                <p className="cat-card-from">From €50 per session</p>
                <a href="#pricing" className="cat-card-link">View Prices →</a>
              </div>
            </div>

            <div className="cat-card">
              <div className="cat-card-bg" style={{ background: 'linear-gradient(160deg, #2C1A10 0%, #7A5030 60%, #A07840 100%)' }} />
              <div className="cat-card-overlay" />
              <div className="cat-card-body">
                <p className="cat-card-tag">Skin Rejuvenation</p>
                <h3 className="cat-card-title">Facials &amp;<br />Skin Treatments</h3>
                <p className="cat-card-from">From €35 per session</p>
                <a href="#pricing" className="cat-card-link">View Prices →</a>
              </div>
            </div>

            <div className="cat-card">
              <div className="cat-card-bg" style={{ background: 'linear-gradient(160deg, #0E0608 0%, #2C1820 60%, #4A2830 100%)' }} />
              <div className="cat-card-overlay" />
              <div className="cat-card-body">
                <p className="cat-card-tag">Anti-Ageing</p>
                <h3 className="cat-card-title">Cosmetic<br />Injectables</h3>
                <p className="cat-card-from">From €35 per treatment</p>
                <a href="#pricing" className="cat-card-link">View Prices →</a>
              </div>
            </div>

            <div className="cat-card">
              <div className="cat-card-bg" style={{ background: 'linear-gradient(160deg, #1A1005 0%, #4A3015 60%, #8A6020 100%)' }} />
              <div className="cat-card-overlay" />
              <div className="cat-card-body">
                <p className="cat-card-tag">Skin Tightening</p>
                <h3 className="cat-card-title">Radio<br />Frequency</h3>
                <p className="cat-card-from">From €65 per session</p>
                <a href="#pricing" className="cat-card-link">View Prices →</a>
              </div>
            </div>

            <div className="cat-card">
              <div className="cat-card-bg" style={{ background: 'linear-gradient(160deg, #200C08 0%, #5A2820 60%, #9A5A48 100%)' }} />
              <div className="cat-card-overlay" />
              <div className="cat-card-body">
                <p className="cat-card-tag">Classic Treatments</p>
                <h3 className="cat-card-title">General Beauty<br />&amp; Waxing</h3>
                <p className="cat-card-from">From €10 per treatment</p>
                <a href="#pricing" className="cat-card-link">View Prices →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="cta-strip">
        <div className="cta-strip-inner">
          <span className="cta-strip-label">Begin Your Journey</span>
          <h2 className="cta-strip-title">
            Ready to Achieve<br />
            <em>Your Best Skin?</em>
          </h2>
          <p className="cta-strip-desc">
            Over 20 years of professional experience — ensuring you feel right at home while achieving glowing, confident skin.
          </p>
          <div className="cta-strip-actions">
            <Link href="/book" className="btn-gold">Book Your Consultation</Link>
            <a href="#pricing" className="btn-outline">View All Prices</a>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <span className="section-label">Transparent Pricing</span>
          <h2 className="section-title">Our Treatment Prices</h2>
        </div>
        <PricingTabs />
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <div className="why-inner">
          <div>
            <span className="section-label">Why Clifden</span>
            <h2 className="section-title" style={{ marginBottom: '2rem' }}>Your Skin Deserves<br />the Best</h2>
            <p style={{ fontSize: '1.4rem', color: 'var(--medium-grey)', fontWeight: 300, lineHeight: 1.85 }}>
              We combine clinical expertise with a warm, personal approach — treating every client as an individual with unique skin and unique goals.
            </p>
          </div>
          <div className="why-features">
            <div className="why-item">
              <div className="why-bar" />
              <h3 className="why-item-title">20+ Years Experience</h3>
              <p className="why-item-desc">Over two decades of professional expertise in advanced skin solutions and beauty treatments in Clifden.</p>
            </div>
            <div className="why-item">
              <div className="why-bar" />
              <h3 className="why-item-title">FDA &amp; CE Approved</h3>
              <p className="why-item-desc">All laser and IPL equipment is fully FDA and CE certified, ensuring your safety and the highest clinical standards.</p>
            </div>
            <div className="why-item">
              <div className="why-bar" />
              <h3 className="why-item-title">Bespoke Treatments</h3>
              <p className="why-item-desc">Every treatment plan is personalised to your unique skin type, tone, and individual beauty goals. No two plans alike.</p>
            </div>
            <div className="why-item">
              <div className="why-bar" />
              <h3 className="why-item-title">Heart of Connemara</h3>
              <p className="why-item-desc">A beloved local clinic in Clifden, Co. Galway — where community warmth and clinical expertise go hand in hand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div id="book">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title" style={{ marginBottom: '2.4rem' }}>Book Your<br />Consultation</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--medium-grey)', fontWeight: 300, lineHeight: 1.85, marginBottom: '4rem' }}>
            Ready to begin your skin journey? Book a consultation and let us create a personalised treatment plan just for you.
          </p>

          <div className="contact-info-item">
            <div className="contact-icon">📍</div>
            <div>
              <p className="contact-label">Location</p>
              <p className="contact-value">Clifden, Co. Galway, Ireland</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon">📞</div>
            <div>
              <p className="contact-label">Phone</p>
              <p className="contact-value"><a href="tel:+35395215XX">+353 95 215 XX</a></p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon">✉</div>
            <div>
              <p className="contact-label">Email</p>
              <p className="contact-value"><a href="mailto:info@clifdenbeautylaserclinic.com">info@clifdenbeautylaserclinic.com</a></p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon">🕐</div>
            <div>
              <p className="contact-label">Opening Hours</p>
              <p className="contact-value">Mon–Fri: 9:00am – 6:00pm<br />Saturday: 9:00am – 4:00pm</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon">💬</div>
            <div>
              <p className="contact-label">Consultations</p>
              <p className="contact-value">Injectable &amp; IPL consultations: €25<br />(Redeemable against treatment cost)</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ padding: '4rem', background: 'var(--cream)', border: '1px solid var(--light-grey)' }}>
            <span className="section-label" style={{ marginBottom: '1.6rem' }}>Ready to Book?</span>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem, 3vw, 3.2rem)', fontWeight: 300, color: 'var(--dark-brown)', lineHeight: 1.2, marginBottom: '1.6rem' }}>
              Create an account to book your treatment online
            </h3>
            <p style={{ fontSize: '1.4rem', color: 'var(--medium-grey)', fontWeight: 300, lineHeight: 1.8, marginBottom: '3.2rem' }}>
              Book online, pay a small deposit to secure your appointment, and manage your bookings from your account.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <Link href="/book" className="btn-primary" style={{ textAlign: 'center' }}>Book Now &amp; Pay Deposit</Link>
              <Link href="/login" className="btn-text" style={{ textAlign: 'center' }}>Sign In to Existing Account →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand-logo">Clifden Beauty<br />&amp; Laser Clinic</p>
            <p className="footer-tagline">Beauty That Never Ages</p>
            <p className="footer-desc">Advanced skin solutions and bespoke beauty treatments in the heart of Clifden, Co. Galway — where expertise meets warmth.</p>
          </div>

          <div>
            <p className="footer-col-title">Treatments</p>
            <ul className="footer-links">
              <li><a href="#pricing">Laser Hair Removal</a></li>
              <li><a href="#pricing">IPL Skin Treatments</a></li>
              <li><a href="#pricing">Facials &amp; Skin</a></li>
              <li><a href="#pricing">Cosmetic Injectables</a></li>
              <li><a href="#pricing">Radio Frequency</a></li>
              <li><a href="#pricing">General Beauty</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Information</p>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#pricing">All Prices</a></li>
              <li><Link href="/book">Book Consultation</Link></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">clifdenbeautylaserclinic.com</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Contact</p>
            <p className="footer-contact-row">Clifden, Co. Galway,<br />Ireland</p>
            <p className="footer-contact-row"><a href="tel:+35395215XX">+353 95 215 XX</a></p>
            <p className="footer-contact-row"><a href="mailto:info@clifdenbeautylaserclinic.com">info@clifdenbeautylaserclinic.com</a></p>
            <p className="footer-contact-row" style={{ marginTop: '1.6rem' }}>Mon–Fri: 9am – 6pm<br />Sat: 9am – 4pm</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2025 Clifden Beauty &amp; Laser Clinic. All rights reserved.</p>
          <div className="footer-social">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
          </div>
        </div>
      </footer>
    </>
  )
}
