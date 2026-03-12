'use client'

import { useState } from 'react'
import Link from 'next/link'

type TabId = 'skin' | 'ipl' | 'injectables' | 'laser' | 'rf' | 'beauty'

export default function PricingTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('skin')

  return (
    <>
      <div className="pricing-tabs">
        {(['skin', 'ipl', 'injectables', 'laser', 'rf', 'beauty'] as TabId[]).map((tab) => (
          <button
            key={tab}
            className={`ptab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'skin' && 'Skin Treatments'}
            {tab === 'ipl' && 'IPL Treatments'}
            {tab === 'injectables' && 'Injectables'}
            {tab === 'laser' && 'Laser Hair Removal'}
            {tab === 'rf' && 'Radio Frequency'}
            {tab === 'beauty' && 'General Beauty'}
          </button>
        ))}
      </div>

      {/* SKIN TREATMENTS */}
      <div className={`ptab-content${activeTab === 'skin' ? ' active' : ''}`}>
        <table className="ptable">
          <thead><tr><th>Treatment</th><th>Price</th></tr></thead>
          <tbody>
            <tr className="cat-row"><td colSpan={2}>Advanced Facial Treatments</td></tr>
            <tr><td>Micro-needling Face + Neck</td><td>€150</td></tr>
            <tr><td>Micro-needling Face + Neck + LED Mask</td><td>€150</td></tr>
            <tr><td>PDRN Micro-needling</td><td>€200</td></tr>
            <tr><td>Lumi Facial</td><td>€200</td></tr>
            <tr><td>Hydra-Facial</td><td>€80</td></tr>
            <tr className="cat-row"><td colSpan={2}>Bespoke Facials</td></tr>
            <tr><td>Bespoke Facial</td><td>€60</td></tr>
            <tr><td>Bespoke Express Facial</td><td>€35</td></tr>
            <tr><td>High-Frequency Facial Treatment</td><td>€65</td></tr>
            <tr><td>High-Frequency Facial + LED Light</td><td>€75</td></tr>
            <tr className="cat-row"><td colSpan={2}>Peels &amp; Light Therapy</td></tr>
            <tr><td>Lactic Peel</td><td>€75</td></tr>
            <tr><td>Glycolic Plus Peel</td><td>€65</td></tr>
            <tr><td>LED Therapy Face or Body</td><td>€30</td></tr>
            <tr><td>LED Therapy Face (Add-On)</td><td>€20</td></tr>
          </tbody>
        </table>
        <p className="price-note">ℹ Package Deal available: Buy 2, Get 3rd Half Price (~€162.50 saving on triple booking).</p>
      </div>

      {/* IPL TREATMENTS */}
      <div className={`ptab-content${activeTab === 'ipl' ? ' active' : ''}`}>
        <table className="ptable">
          <thead><tr><th>Treatment</th><th>Area</th><th>Price</th></tr></thead>
          <tbody>
            <tr className="cat-row"><td colSpan={3}>Pigmentation Removal</td></tr>
            <tr><td>IPL Pigmentation Full Face</td><td className="sub">Full Face</td><td>€150</td></tr>
            <tr><td>IPL Pigmentation Cheeks + Nose + Chin</td><td className="sub">Half Face</td><td>€128</td></tr>
            <tr><td>IPL Cheeks &amp; Nose Pigment Removal</td><td className="sub">Cheeks &amp; Nose</td><td>€115</td></tr>
            <tr><td>IPL Cheeks Pigment Removal</td><td className="sub">Cheeks</td><td>€90</td></tr>
            <tr><td>IPL Hands Pigment Removal</td><td className="sub">Hands</td><td>€75</td></tr>
            <tr><td>IPL Neck &amp; Décolleté Pigment Removal</td><td className="sub">Neck</td><td>€150</td></tr>
            <tr><td>IPL Single Lesion (Pigment or Facial Vein)</td><td className="sub">Single Area</td><td>€50</td></tr>
            <tr className="cat-row"><td colSpan={3}>Rosacea &amp; Thread Veins</td></tr>
            <tr><td>IPL Rosacea/Thread Vein (Cheeks only)</td><td className="sub">Cheeks</td><td>€80</td></tr>
            <tr><td>IPL Rosacea/Thread Vein (Cheeks + Nose)</td><td className="sub">Cheeks &amp; Nose</td><td>€118</td></tr>
            <tr><td>IPL Rosacea Half Face</td><td className="sub">Half Face</td><td>€128</td></tr>
            <tr className="cat-row"><td colSpan={3}>Acne Treatment</td></tr>
            <tr><td>IPL Acne Upperlip + Chin</td><td className="sub">Small Area</td><td>€80</td></tr>
            <tr><td>IPL Acne Half Face</td><td className="sub">Half Face</td><td>€90</td></tr>
            <tr><td>IPL Acne Full Face &amp; Neck</td><td className="sub">Full Face</td><td>€120</td></tr>
            <tr><td>IPL Acne Full Back</td><td className="sub">Full Back</td><td>€200</td></tr>
            <tr><td>IPL Acne Chest</td><td className="sub">Chest</td><td>€120</td></tr>
          </tbody>
        </table>
        <p className="price-note">ℹ IPL Consultation &amp; Patch Test: €25 (required prior to first session, redeemable against treatment).</p>
      </div>

      {/* INJECTABLES */}
      <div className={`ptab-content${activeTab === 'injectables' ? ' active' : ''}`}>
        <table className="ptable">
          <thead><tr><th>Treatment</th><th>Category</th><th>Price</th></tr></thead>
          <tbody>
            <tr className="cat-row"><td colSpan={3}>Anti-Ageing</td></tr>
            <tr><td>Anti-Wrinkle Botox – 3 Areas</td><td className="sub">Anti-Ageing</td><td>€300</td></tr>
            <tr><td>Anti-Wrinkle Botox – 2 Areas</td><td className="sub">Anti-Ageing</td><td>€250</td></tr>
            <tr className="cat-row"><td colSpan={3}>Skin Boosters &amp; Polynucleotides</td></tr>
            <tr><td>Profhilo</td><td className="sub">Skin Booster</td><td>€250</td></tr>
            <tr><td>Jalupro Super Hydration</td><td className="sub">Skin Booster</td><td>€200</td></tr>
            <tr><td>Vampire Facial (PRP)</td><td className="sub">Skin Booster</td><td>€295</td></tr>
            <tr><td>Nucleofill Face (Medium or Strong)</td><td className="sub">Polynucleotides</td><td>€260</td></tr>
            <tr><td>Nucleofill Neck (Medium or Strong)</td><td className="sub">Polynucleotides</td><td>€260</td></tr>
            <tr><td>Nucleofill Eyes (Soft)</td><td className="sub">Polynucleotides</td><td>€250</td></tr>
            <tr><td>Meso-Booster</td><td className="sub">Skin Booster</td><td>€150</td></tr>
            <tr className="cat-row"><td colSpan={3}>Fat Dissolving</td></tr>
            <tr><td>Lemon Bottle Full Abdomen &amp; Love Handles</td><td className="sub">Fat Dissolving</td><td>€550</td></tr>
            <tr><td>Lemon Bottle Lower Abdomen</td><td className="sub">Fat Dissolving</td><td>€250</td></tr>
            <tr><td>Lemon Bottle Upper Abdomen</td><td className="sub">Fat Dissolving</td><td>€200</td></tr>
            <tr><td>Lemon Bottle Love Handles</td><td className="sub">Fat Dissolving</td><td>€200</td></tr>
            <tr><td>Lemon Bottle Bra Bulge</td><td className="sub">Fat Dissolving</td><td>€200</td></tr>
            <tr><td>Lemon Bottle Double Chin</td><td className="sub">Fat Dissolving</td><td>€180</td></tr>
            <tr className="cat-row"><td colSpan={3}>Wellness Vitamin Injections</td></tr>
            <tr><td>Vitamin B12 Injection</td><td className="sub">Wellness</td><td>€45</td></tr>
            <tr><td>Vitamin B Complex Injection</td><td className="sub">Wellness</td><td>€40</td></tr>
            <tr><td>Vitamin D Injection (IM)</td><td className="sub">Wellness</td><td>€35</td></tr>
            <tr><td>Vitamin C Injection (IM)</td><td className="sub">Wellness</td><td>€35</td></tr>
          </tbody>
        </table>
        <p className="price-note">ℹ Injectable treatments consultation with RGN Jonathan: €25. Required for all first-time injectable clients.</p>
      </div>

      {/* LASER HAIR REMOVAL */}
      <div className={`ptab-content${activeTab === 'laser' ? ' active' : ''}`}>
        <table className="ptable">
          <thead><tr><th>Treatment Area</th><th>Size</th><th>Price</th></tr></thead>
          <tbody>
            <tr className="cat-row"><td colSpan={3}>Small Areas</td></tr>
            <tr><td>Upper Lip</td><td className="sub">Small</td><td>€45</td></tr>
            <tr><td>Chin</td><td className="sub">Small</td><td>€45</td></tr>
            <tr><td>Sideburns</td><td className="sub">Small</td><td>€45</td></tr>
            <tr className="cat-row"><td colSpan={3}>Medium Areas</td></tr>
            <tr><td>Bikini</td><td className="sub">Medium</td><td>€60</td></tr>
            <tr><td>Beardline</td><td className="sub">Medium</td><td>€60</td></tr>
            <tr><td>Stomach Line</td><td className="sub">Medium</td><td>€60</td></tr>
            <tr><td>Underarm</td><td className="sub">Medium</td><td>€65</td></tr>
            <tr><td>Buttock</td><td className="sub">Medium</td><td>€60</td></tr>
            <tr className="cat-row"><td colSpan={3}>Large Areas</td></tr>
            <tr><td>Half Arm</td><td className="sub">Large</td><td>€95</td></tr>
            <tr><td>Half Leg</td><td className="sub">Large</td><td>€95</td></tr>
            <tr><td>Brazilian</td><td className="sub">Large</td><td>€95</td></tr>
            <tr><td>Hollywood</td><td className="sub">Large</td><td>€95</td></tr>
            <tr><td>Chest</td><td className="sub">Large</td><td>€95</td></tr>
            <tr><td>Shoulders</td><td className="sub">Large</td><td>€95</td></tr>
            <tr><td>Full Stomach</td><td className="sub">Large</td><td>€95</td></tr>
            <tr><td>Full Arms &amp; Hands</td><td className="sub">Large</td><td>€95</td></tr>
            <tr className="cat-row"><td colSpan={3}>Extra Large Areas</td></tr>
            <tr><td>Full Legs</td><td className="sub">Extra Large</td><td>€190</td></tr>
            <tr><td>Full Back</td><td className="sub">Extra Large</td><td>€190</td></tr>
          </tbody>
        </table>
        <p className="price-note">ℹ Prices are per session. Multiple sessions are typically required for permanent results. Package pricing available on request.</p>
      </div>

      {/* RADIO FREQUENCY */}
      <div className={`ptab-content${activeTab === 'rf' ? ' active' : ''}`}>
        <table className="ptable">
          <thead><tr><th>Treatment</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td>RF Face &amp; Neck</td><td>€80</td></tr>
            <tr><td>RF Body Abdomen</td><td>€90</td></tr>
            <tr><td>RF Bra Bulge</td><td>€65</td></tr>
            <tr><td>Hydro Facial + Mini RF</td><td>€95</td></tr>
          </tbody>
        </table>
        <p className="price-note">ℹ RF treatments promote collagen production and natural skin tightening. A course of 4–6 sessions is recommended for optimal results.</p>
      </div>

      {/* GENERAL BEAUTY */}
      <div className={`ptab-content${activeTab === 'beauty' ? ' active' : ''}`}>
        <table className="ptable">
          <thead><tr><th>Treatment</th><th>Category</th><th>Price</th></tr></thead>
          <tbody>
            <tr className="cat-row"><td colSpan={3}>Eyes &amp; Brows</td></tr>
            <tr><td>Eyebrow Waxing</td><td className="sub">Eyes &amp; Brows</td><td>€12</td></tr>
            <tr><td>Eyebrow Tinting</td><td className="sub">Eyes &amp; Brows</td><td>€12</td></tr>
            <tr><td>Eyebrow Shape &amp; Tint</td><td className="sub">Eyes &amp; Brows</td><td>€20</td></tr>
            <tr><td>Eyelash Tinting</td><td className="sub">Eyes &amp; Brows</td><td>€12</td></tr>
            <tr><td>Eye Trio (Wax, Tint &amp; Lash Tint)</td><td className="sub">Eyes &amp; Brows</td><td>€30</td></tr>
            <tr><td>Lash Lift</td><td className="sub">Eyes &amp; Brows</td><td>€60</td></tr>
            <tr className="cat-row"><td colSpan={3}>Threading</td></tr>
            <tr><td>Eyebrow Threading</td><td className="sub">Threading</td><td>€12</td></tr>
            <tr><td>Threading Eyebrow Shape &amp; Tint</td><td className="sub">Threading</td><td>€20</td></tr>
            <tr><td>Threading Upperlip &amp; Chin</td><td className="sub">Threading</td><td>€15</td></tr>
            <tr><td>Threading Lip or Chin</td><td className="sub">Threading</td><td>€10</td></tr>
            <tr className="cat-row"><td colSpan={3}>Female Waxing</td></tr>
            <tr><td>Full Leg &amp; Hollywood</td><td className="sub">Waxing</td><td>€90</td></tr>
            <tr><td>Half Leg &amp; Hollywood Wax</td><td className="sub">Waxing</td><td>€75</td></tr>
            <tr><td>Full Leg &amp; Bikini (Standard)</td><td className="sub">Waxing</td><td>€60</td></tr>
            <tr><td>Half Leg &amp; Brazilian Wax</td><td className="sub">Waxing</td><td>€55</td></tr>
            <tr><td>Full Leg Wax</td><td className="sub">Waxing</td><td>€45</td></tr>
            <tr><td>Upper or Lower Leg Wax</td><td className="sub">Waxing</td><td>€30</td></tr>
            <tr><td>Hollywood Wax</td><td className="sub">Waxing</td><td>€50</td></tr>
            <tr><td>Brazilian Wax</td><td className="sub">Waxing</td><td>€30</td></tr>
            <tr><td>Californian Wax</td><td className="sub">Waxing</td><td>€26</td></tr>
            <tr><td>Bikini Wax (Standard)</td><td className="sub">Waxing</td><td>€30</td></tr>
            <tr><td>Full Arm Wax</td><td className="sub">Waxing</td><td>€30</td></tr>
            <tr><td>Half Arm Wax</td><td className="sub">Waxing</td><td>€18</td></tr>
            <tr><td>Underarm Waxing</td><td className="sub">Waxing</td><td>€15</td></tr>
            <tr><td>Half Face Wax (Cheeks + Upperlip + Chin)</td><td className="sub">Waxing</td><td>€18</td></tr>
            <tr><td>Upperlip &amp; Chin Wax</td><td className="sub">Waxing</td><td>€15</td></tr>
            <tr><td>Upperlip Wax</td><td className="sub">Waxing</td><td>€10</td></tr>
            <tr><td>Chin Wax</td><td className="sub">Waxing</td><td>€10</td></tr>
            <tr><td>Nose Wax</td><td className="sub">Waxing</td><td>€15</td></tr>
            <tr><td>Side of Face Wax</td><td className="sub">Waxing</td><td>€15</td></tr>
            <tr className="cat-row"><td colSpan={3}>Male Waxing</td></tr>
            <tr><td>Male Back Wax</td><td className="sub">Male Waxing</td><td>€65</td></tr>
            <tr><td>Male Chest &amp; Stomach Wax</td><td className="sub">Male Waxing</td><td>€80</td></tr>
          </tbody>
        </table>
        <p className="price-note">ℹ Threading and waxing available for both face and body. Please arrive with clean, product-free skin.</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <Link href="/book" className="btn-primary">Book This Treatment</Link>
      </div>
    </>
  )
}
