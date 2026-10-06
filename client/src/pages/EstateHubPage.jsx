import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Zap,
  Droplet,
  Shield,
  MapPin,
  HelpCircle,
  TrendingUp,
  FileText,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { trackEvent } from '../utils/analytics';

const SECTIONS = [
  { id: 'overview', slug: '', label: 'Estate Overview', icon: Building2 },
  { id: 'guide', slug: 'guide', label: 'Resident Guide', icon: FileText },
  { id: 'apartment-types', slug: 'apartment-types', label: 'Apartment Types', icon: Layers },
  { id: 'rental-prices', slug: 'rental-prices', label: 'Rental Prices', icon: TrendingUp },
  { id: 'facilities', slug: 'facilities', label: 'Facilities & Power', icon: Zap },
  { id: 'location', slug: 'location', label: 'Location & Access', icon: MapPin },
  { id: 'faqs', slug: 'faqs', label: 'Tenancy FAQs', icon: HelpCircle }
];

const FAQS_DATA = [
  {
    q: 'How reliable is the electricity supply in 1004 Estate?',
    a: '1004 Estate operates an independent gas-turbine turbine power plant dedicated strictly to the estate. Power is supplied 24 hours a day, 7 days a week, 365 days a year without relying on the public grid. Electricity is metered via digital prepaid meters in each apartment.'
  },
  {
    q: 'What does the estate service charge cover?',
    a: 'The annual service charge covers communal electricity for water treatment plants, sewage systems, passenger and service elevators, external floodlighting, CCTV coverage, 24/7 uniformed security at all security gates, trash collection, landscape maintenance, and access to recreational amenities (swimming pool, tennis courts).'
  },
  {
    q: 'Can corporate bodies lease apartments for their expatriates or executives?',
    a: 'Yes. JK - CUBE MULTIVENTURES LIMITED frequently manages corporate leases for multinational corporations, oil and gas firms, tech companies, and diplomatic missions. We issue corporate invoices, tenancy agreements, and receipt documentation.'
  },
  {
    q: 'What is the difference between standard 3-bedroom flats and 3-bedroom maisonettes?',
    a: 'Standard 3-bedroom flats are single-level layouts situated primarily in the High-Rise Towers and low-rise blocks. 3-bedroom maisonettes are split-level duplex residences featuring an internal staircase, double-volume living salon, and private family quarters upstairs, situated in designated low-rise clusters.'
  },
  {
    q: 'How are inspections and viewing appointments scheduled?',
    a: 'Inspections can be booked directly through this website or via our WhatsApp leasing desk (+234 703 846 2284). Our on-site leasing agents are present daily in 1004 Estate to facilitate physically guided tours.'
  },
  {
    q: 'Are pets permitted within 1004 Estate?',
    a: 'Small domestic pets are permitted provided they are kept indoors and leashed when walked within communal green lawns and walkways, adhering to estate environmental hygiene bylaws.'
  },
  {
    q: 'What are the security and visitor access policies?',
    a: 'The estate features access-controlled barrier gates on both the commercial and residential gates. Residents utilize RFID cards. Visitors must be called in or announced via the intercom and security desk before entry.'
  }
];

export default function EstateHubPage() {
  const { section } = useParams();
  const navigate = useNavigate();
  const currentSection = section || 'overview';

  const [pricingStats, setPricingStats] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    trackEvent('1004_estate_hub_view', { section: currentSection });

    if (currentSection === 'rental-prices' || currentSection === 'overview') {
      async function loadPricing() {
        setLoadingPrices(true);
        try {
          const res = await api.getPricingStats();
          if (res.data) setPricingStats(res.data);
        } catch (err) {
          console.error('Error loading pricing stats:', err);
        } finally {
          setLoadingPrices(false);
        }
      }
      loadPricing();
    }
  }, [currentSection]);

  const activeNavItem = SECTIONS.find((s) => s.slug === (section || '')) || SECTIONS[0];

  const breadcrumbsItems = [
    { label: '1004 Estate Hub', path: '/1004-estate' },
    ...(section ? [{ label: activeNavItem.label, path: `/1004-estate/${section}` }] : [])
  ];

  // Dynamic SEO metadata per section
  const getSeoData = () => {
    switch (currentSection) {
      case 'guide':
        return {
          title: '1004 Estate Resident & Tenant Guide | Victoria Island, Lagos',
          description: 'Comprehensive guide to renting and living in 1004 Estate, Victoria Island. Independent turbine power, water works, security access, and tenancy procedures.'
        };
      case 'apartment-types':
        return {
          title: '1004 Estate Apartment Types: High-Rise Flats, Maisonettes & Studios',
          description: 'Detailed comparison of 1-bedroom executive studios, 2-bedroom serviced flats, 3-bedroom standard flats, 3-bedroom maisonettes, and 4-bedroom residences in 1004 Estate.'
        };
      case 'rental-prices':
        return {
          title: '1004 Estate Rental Prices & Service Charge Guide | Live Market Rates',
          description: 'Verified rental pricing in 1004 Estate, Victoria Island. Dynamic price ranges calculated from active inventory: 1-bed, 2-bed, 3-bed, and maisonettes with breakdown of fees.'
        };
      case 'facilities':
        return {
          title: '1004 Estate Facilities: Independent Power Plant, Pools & Sports Courts',
          description: 'Explore 1004 Estate amenities: 24/7 dedicated gas turbine power plant, industrial borehole water treatment, Olympic-size swimming pools, lawn tennis, and CCTV security.'
        };
      case 'location':
        return {
          title: '1004 Estate Location & Accessibility | Victoria Island, Lagos',
          description: 'Convenient access via Adetokunbo Ademola Street and Ozumba Mbadiwe Way. Proximity to financial institutions, embassies, high-end shopping, and top restaurants in Victoria Island.'
        };
      case 'faqs':
        return {
          title: '1004 Estate Tenancy FAQs | Frequently Asked Questions',
          description: 'Answers to essential questions about renting in 1004 Estate: power reliability, service charges, corporate leasing, visitor gates, and inspection appointments.'
        };
      default:
        return {
          title: '1004 Estate, Victoria Island | Official Leasing & Resident Hub',
          description: 'The definitive information hub for 1004 Estate, Victoria Island, Lagos. Explore apartment layouts, verified rental pricing, estate facilities, and on-site corporate management.'
        };
    }
  };

  const seo = getSeoData();

  return (
    <div className="section" style={{ paddingTop: '28px' }}>
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalPath={section ? `/1004-estate/${section}` : '/1004-estate'}
        breadcrumbs={breadcrumbsItems}
        faqs={currentSection === 'faqs' ? FAQS_DATA : null}
      />

      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbsItems} />

        {/* Hero Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="explore-badge" style={{ background: 'var(--brand-orange)', color: '#ffffff', fontWeight: '700' }}>
              Specialized Information Hub
            </span>
            <span className="badge" style={{ background: '#f3f4f6', color: '#111827', fontWeight: '600' }}>
              1004 Estate, Victoria Island
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 5.5vw, 2.7rem)', fontWeight: '800', letterSpacing: '-0.03em', color: '#111827', margin: '0 0 10px 0' }}>
            1004 Estate Resident & Rental Information Hub
          </h1>
          <p style={{ color: '#4b5563', fontSize: '1.05rem', maxWidth: '820px', lineHeight: '1.6', margin: 0 }}>
            Managed by <strong>JK - CUBE MULTIVENTURES LIMITED</strong>. Discover verified apartment specifications, transparent rental pricing, independent turbine power details, and resident amenities in Lagos's most iconic residential estate.
          </p>
        </div>

        {/* Sub-Navigation Pill Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '32px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '4px'
        }}>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = (section || '') === sec.slug;
            const targetUrl = sec.slug ? `/1004-estate/${sec.slug}` : '/1004-estate';

            return (
              <Link
                key={sec.id}
                to={targetUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#000000' : '#6b7280',
                  borderBottom: isActive ? '3px solid #000000' : '3px solid transparent',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  marginBottom: '-6px'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--brand-orange)' : '#9ca3af'} />
                <span>{sec.label}</span>
              </Link>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: OVERVIEW */}
        {/* ========================================================================= */}
        {currentSection === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '48px', alignItems: 'center' }}>
              <div>
                <span className="explore-badge" style={{ background: '#f3f4f6', color: '#111827', marginBottom: '12px', display: 'inline-block' }}>
                  Historic & Prime
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px', color: '#111827' }}>
                  A Premier High-Security Community in the Commercial Heart of Lagos
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '0.98rem', marginBottom: '16px' }}>
                  1004 Estate, located on Victoria Island, Lagos, is one of West Africa's largest and most sought-after upscale residential communities. Built on a sprawling 11-hectare waterfront parcel overlooking Five Cowries Creek, the estate accommodates thousands of senior executives, diplomatic corps members, banking directors, and corporate expatriates.
                </p>
                <p style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '0.98rem', marginBottom: '24px' }}>
                  Unlike typical Lagos developments, 1004 Estate is an entirely self-sustaining ecosystem with its own dedicated independent turbine power plant, industrial water filtration works, multi-layered security gates, and dedicated property management desks.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <Link to="/apartments" className="btn-add-listing">
                    Browse 1004 Apartments <ArrowRight size={15} />
                  </Link>
                  <Link to="/1004-estate/rental-prices" className="btn-add-listing" style={{ background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb' }}>
                    View Rental Prices
                  </Link>
                </div>
              </div>

              <div>
                <img
                  src="/1004-estate-aerial.jpg"
                  alt="Aerial View of 1004 Estate High-Rise Towers, Victoria Island"
                  style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', objectFit: 'cover', maxHeight: '420px' }}
                />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <Zap size={24} color="var(--brand-orange)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 6px 0' }}>24/7 Turbine Power</h3>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>Dedicated independent gas turbine power plant. Zero generator noise, continuous uptime.</p>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <Droplet size={24} color="#0284c7" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 6px 0' }}>Industrial Water Works</h3>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>Central borehole and reverse osmosis water treatment plants pumping clean, pressurized water.</p>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <Shield size={24} color="#16a34a" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 6px 0' }}>Biometric Gate Security</h3>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>Card access barrier gates, intercom visitor authorization, and 24-hour uniformed guards.</p>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <Building2 size={24} color="#7c3aed" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 6px 0' }}>On-Site Concierge</h3>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>Managed on-site by JK - CUBE MULTIVENTURES LIMITED for swift maintenance and leasing onboarding.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: RESIDENT & TENANT GUIDE */}
        {/* ========================================================================= */}
        {currentSection === 'guide' && (
          <div style={{ maxWidth: '900px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', color: '#111827' }}>
              The Definitive 1004 Estate Resident Handbook
            </h2>
            <p style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1rem', marginBottom: '28px' }}>
              Moving into 1004 Estate offers unparalleled comfort, connectivity, and uninterrupted amenities in Victoria Island. To ensure a harmonious community experience, here are the essential procedures for incoming tenants.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#16a34a" /> 1. Tenancy Application & Onboarding
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
                  Prospective tenants submit valid identification (Government ID, International Passport) and corporate employment details. Tenancy agreements are drawn up directly by JK - CUBE MULTIVENTURES LIMITED with transparent clauses on rent, service charge schedule, and caution deposit return.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#16a34a" /> 2. Electricity Vending & Meter Setup
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
                  Every flat possesses a digital Smart Prepaid Meter. Residents purchase power tokens conveniently online or via the on-site Facility Management office. Power tariffs reflect the independent turbine generation rate, guaranteeing uninterrupted supply without generator diesel hassles.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#16a34a" /> 3. Move-In Gate Pass & Logistics
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
                  To ensure safety and orderly logistics, moving vans and heavy trucks must enter via the commercial gate during designated hours (8:00 AM - 6:00 PM, Monday to Saturday). JK-Cube issues your Move-In Clearance Pass prior to moving day.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#16a34a" /> 4. Parking Allocation & Vehicle Stickers
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
                  Each apartment is allocated designated covered parking bay(s). Residents register their vehicle registration numbers with the estate security desk to receive an authorized RFID windshield tag for automated gate access.
                </p>
              </div>
            </div>

            <div style={{ background: '#eff6ff', padding: '24px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '6px' }}>
                Need Help with 1004 Estate Tenancy?
              </h4>
              <p style={{ color: '#1e40af', fontSize: '0.9rem', margin: '0 0 14px 0' }}>
                Our on-site leasing office is open Monday to Saturday from 9:00 AM to 6:00 PM.
              </p>
              <Link to="/contact" className="btn-add-listing">
                Contact JK - CUBE Leasing Desk
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: APARTMENT TYPES */}
        {/* ========================================================================= */}
        {currentSection === 'apartment-types' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: '#111827' }}>
              1004 Estate Apartment Typology & Floorplan Layouts
            </h2>
            <p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '1rem', marginBottom: '32px', maxWidth: '820px' }}>
              1004 Estate features distinctly engineered architectural residential styles across its High-Rise Towers and Low-Rise clusters (Cluster A, B, C, and D).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              
              {/* 1 Bedroom */}
              <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', overflow: 'hidden', padding: '24px' }}>
                <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8', marginBottom: '10px', display: 'inline-block' }}>1-BEDROOM</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Executive Studio / 1-Bed Flat</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
                  Approx. 65 – 80 m². Compact and highly functional layout featuring an open-plan kitchen, separate en-suite bedroom, and high-speed fiber internet. Ideal for single professionals, expatriates, and consultants.
                </p>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '16px' }}>
                  <strong>Typical Clusters:</strong> High-Rise Towers & Cluster B
                </div>
                <Link to="/apartments/1-bedroom" className="btn-add-listing" style={{ width: '100%', justifyContent: 'center' }}>
                  View 1-Bedroom Apartments
                </Link>
              </div>

              {/* 2 Bedroom */}
              <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', overflow: 'hidden', padding: '24px' }}>
                <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', marginBottom: '10px', display: 'inline-block' }}>2-BEDROOM</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>2-Bedroom Serviced Flat</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
                  Approx. 120 – 140 m². Generous living/dining salon, modern fitted kitchen, two large bedrooms with en-suite bathrooms, and balcony. High demand among couples and small families.
                </p>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '16px' }}>
                  <strong>Typical Clusters:</strong> Cluster A, Cluster B, High-Rise Towers
                </div>
                <Link to="/apartments/2-bedroom" className="btn-add-listing" style={{ width: '100%', justifyContent: 'center' }}>
                  View 2-Bedroom Apartments
                </Link>
              </div>

              {/* 3 Bedroom Flat */}
              <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', overflow: 'hidden', padding: '24px' }}>
                <span className="badge" style={{ background: '#fef3c7', color: '#b45309', marginBottom: '10px', display: 'inline-block' }}>3-BEDROOM STANDARD</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>3-Bedroom Family Flat</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
                  Approx. 160 – 190 m². Expansive single-floor design with master bedroom overlooking Five Cowries Creek lagoon, two additional bedrooms, guest toilet, and utility room.
                </p>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '16px' }}>
                  <strong>Typical Clusters:</strong> High-Rise Towers & Cluster D
                </div>
                <Link to="/apartments/3-bedroom" className="btn-add-listing" style={{ width: '100%', justifyContent: 'center' }}>
                  View 3-Bedroom Flats
                </Link>
              </div>

              {/* 3 Bedroom Maisonette */}
              <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', overflow: 'hidden', padding: '24px' }}>
                <span className="badge" style={{ background: '#faf5ff', color: '#7e22ce', marginBottom: '10px', display: 'inline-block' }}>3-BEDROOM DUPLEX</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>3-Bedroom Split-Level Maisonette</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
                  Approx. 200 – 220 m². Two-level architectural jewel. Ground level hosts a grand double-volume living salon, dining room, and kitchen; upper level features 3 private bedrooms and family lounge.
                </p>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '16px' }}>
                  <strong>Typical Clusters:</strong> Cluster C & Cluster D Low-Rise Wings
                </div>
                <Link to="/apartments/3-bedroom-maisonette" className="btn-add-listing" style={{ width: '100%', justifyContent: 'center' }}>
                  View 3-Bed Maisonettes
                </Link>
              </div>

              {/* 4 Bedroom */}
              <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', overflow: 'hidden', padding: '24px' }}>
                <span className="badge" style={{ background: '#fdf2f8', color: '#be185d', marginBottom: '10px', display: 'inline-block' }}>4-BEDROOM EXECUTIVE</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>4-Bedroom Executive Corner Flat</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
                  Approx. 240 – 270 m². Expansive corner apartment offering dual salons, 4 en-suite bedrooms, maid's room, 3 covered parking bays, and 360-degree estate views.
                </p>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '16px' }}>
                  <strong>Typical Clusters:</strong> Cluster D & High-Rise Corner Wings
                </div>
                <Link to="/apartments/4-bedroom" className="btn-add-listing" style={{ width: '100%', justifyContent: 'center' }}>
                  View 4-Bedroom Flats
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: DYNAMIC RENTAL PRICES */}
        {/* ========================================================================= */}
        {currentSection === 'rental-prices' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <span className="explore-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', marginBottom: '8px', display: 'inline-block' }}>
                Live Inventory Rates
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>
                1004 Estate Verified Rental Price Guide
              </h2>
              <p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '0.98rem', maxWidth: '820px', margin: 0 }}>
                Rental prices in 1004 Estate are determined strictly by inventory size, cluster location, floor level, interior renovation standard, and furnishing status. All figures below are dynamically calculated from active listings managed by JK - CUBE MULTIVENTURES LIMITED.
              </p>
            </div>

            {loadingPrices ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#9ca3af' }}>
                Calculating current market rates from 1004 Estate inventory...
              </div>
            ) : pricingStats && pricingStats.categories ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {pricingStats.categories.map((cat) => (
                    <div key={cat.slug} style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>{cat.slug.replace('-', ' ')}</span>
                          <span style={{ background: cat.availableCount > 0 ? '#ecfdf5' : '#f3f4f6', color: cat.availableCount > 0 ? '#047857' : '#6b7280', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                            {cat.availableCount} Available Now
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '6px', color: '#111827' }}>{cat.label}</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>{cat.description}</p>
                        
                        <div style={{ background: '#f9fafb', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px' }}>
                          <div style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Annual Rental Range</div>
                          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111827', marginTop: '2px' }}>
                            {cat.minPrice ? formatPriceNGN(cat.minPrice) : 'Contact Agent'}
                            {cat.maxPrice && cat.maxPrice !== cat.minPrice ? ` – ${formatPriceNGN(cat.maxPrice)}` : ''}
                            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}> /yr</span>
                          </div>
                        </div>
                      </div>

                      <Link to={`/apartments/${cat.slug}`} className="btn-view-pill" style={{ textAlign: 'center', padding: '10px', borderRadius: '10px' }}>
                        Browse {cat.label}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Transparent Statutory & Service Charges Breakdown */}
                <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '32px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px', color: '#111827' }}>
                    Standard Rental Fee Components
                  </h3>
                  <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                    In accordance with Lagos State tenancy laws and 1004 Estate bylaws, every lease comprises transparent, standardized fees:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontWeight: '700', color: '#111827', marginBottom: '4px' }}>1. Base Annual Rent</div>
                      <div style={{ fontSize: '0.88rem', color: '#4b5563' }}>Payable upfront annually to the landlord as per tenancy contract.</div>
                    </div>
                    <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontWeight: '700', color: '#111827', marginBottom: '4px' }}>2. Estate Service Charge</div>
                      <div style={{ fontSize: '0.88rem', color: '#4b5563' }}>Typically ₦850,000 – ₦1,600,000/yr depending on flat size; covers 24/7 security, water, elevators, grounds.</div>
                    </div>
                    <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontWeight: '700', color: '#111827', marginBottom: '4px' }}>3. Refundable Caution Deposit</div>
                      <div style={{ fontSize: '0.88rem', color: '#4b5563' }}>Typically 5% – 10% of base rent; fully refunded upon non-damaging exit tenancy inspection.</div>
                    </div>
                    <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontWeight: '700', color: '#111827', marginBottom: '4px' }}>4. Agency & Legal Documentation</div>
                      <div style={{ fontSize: '0.88rem', color: '#4b5563' }}>Standard Lagos real-estate statutory fee (10% agency, 5-10% legal preparation).</div>
                    </div>
                  </div>
                </div>

              </div>
            ) : null}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: FACILITIES & TURBINE POWER */}
        {/* ========================================================================= */}
        {currentSection === 'facilities' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: '#111827' }}>
              Estate Facilities & Independent Utilities
            </h2>
            <p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '1rem', marginBottom: '32px', maxWidth: '820px' }}>
              1004 Estate is renowned across Lagos for offering uninterrupted infrastructural autonomy that isolates residents from public power and water disruptions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
                <Zap size={28} color="var(--brand-orange)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Independent Gas Turbine Power Plant</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
                  A multi-megawatt gas turbine plant operates on-site, supplying consistent, surge-free 240V electricity directly to every flat. Eliminates the noise, fumes, and diesel purchasing logistics required in detached Victoria Island houses.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
                <Droplet size={28} color="#0284c7" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Industrial Water Treatment Works</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
                  Multiple deep industrial boreholes feed central aerators, sand filters, and reverse osmosis units, delivering continuous, clear, potable-grade pressurized water directly to bathroom and kitchen fixtures.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
                <Shield size={28} color="#16a34a" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Sports & Recreation Centers</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
                  Features two Olympic-standard swimming pools, floodlit lawn tennis courts, basketball courts, and manicured green lawns for children's play and outdoor jogging.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
                <Building2 size={28} color="#7c3aed" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Passenger & Cargo Elevators</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
                  High-Rise Towers are serviced by multiple redundant Otis passenger and heavy cargo elevators maintained on scheduled weekly service contracts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: LOCATION & ACCESSIBILITY */}
        {/* ========================================================================= */}
        {currentSection === 'location' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '40px', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '14px', color: '#111827' }}>
                  Unrivaled Location in Victoria Island
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '0.98rem', marginBottom: '16px' }}>
                  Strategically situated on Victoria Island, 1004 Estate borders both <strong>Adetokunbo Ademola Street</strong> and <strong>Ozumba Mbadiwe Way</strong>, offering rapid, dual-gate connectivity to Ikoyi, Lekki Phase 1, and the Lagos Island commercial district.
                </p>
                <p style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '0.98rem', marginBottom: '24px' }}>
                  Residents enjoy immediate walking proximity to leading corporate headquarters, consular embassies, top-tier international schools, fine dining restaurants, and high-end shopping centers.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#374151' }}>
                    <MapPin size={16} color="var(--brand-orange)" /> <strong>Ikoyi Link Bridge:</strong> 4 Minutes Drive
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#374151' }}>
                    <MapPin size={16} color="var(--brand-orange)" /> <strong>Lekki Toll Gate:</strong> 5 Minutes Drive
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#374151' }}>
                    <MapPin size={16} color="var(--brand-orange)" /> <strong>Eko Hotel & Suites / Civic Centre:</strong> 3 Minutes Drive
                  </div>
                </div>
              </div>

              <div style={{ background: '#f9fafb', padding: '28px', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px' }}>Dual-Gate Access System</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.92rem' }}>1. Commercial & Main Gate (Adetokunbo Ademola)</div>
                  <div style={{ color: '#6b7280', fontSize: '0.86rem' }}>Primary access for visitors, heavy moving vans, deliveries, and taxi pickups.</div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.92rem' }}>2. Residential Express Gate (Ozumba Mbadiwe)</div>
                  <div style={{ color: '#6b7280', fontSize: '0.86rem' }}>Dedicated fast-lane access for verified residents holding active RFID windscreen tags.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 7: FAQS */}
        {/* ========================================================================= */}
        {currentSection === 'faqs' && (
          <div style={{ maxWidth: '860px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: '#111827' }}>
              Frequently Asked Tenancy & Estate Questions
            </h2>
            <p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '32px' }}>
              Clear, transparent answers to questions commonly asked by prospective tenants, corporate lease administrators, and expatriates.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
              {FAQS_DATA.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      border: isOpen ? '1px solid var(--brand-orange)' : '1px solid #e5e7eb',
                      overflow: 'hidden',
                      transition: 'border 0.2s'
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      style={{
                        width: '100%',
                        padding: '18px 20px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#111827',
                        gap: '12px'
                      }}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={18}
                        color={isOpen ? 'var(--brand-orange)' : '#9ca3af'}
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                      />
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 20px 20px 20px', color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.7' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Global CTA Banner across all 1004 estate hub pages */}
        <div style={{ marginTop: '50px', background: '#111827', color: '#ffffff', borderRadius: '24px', padding: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <span className="explore-badge" style={{ background: 'var(--brand-orange)', color: '#ffffff', marginBottom: '10px', display: 'inline-block' }}>
              On-Site Concierge & Viewings
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0 8px 0' }}>
              Ready to Secure an Apartment in 1004 Estate?
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.92rem', maxWidth: '600px', margin: 0 }}>
              Speak directly with our dedicated leasing agent or schedule an in-person apartment inspection tour today.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/apartments/available-now" className="btn-add-listing" style={{ padding: '12px 22px' }}>
              View Available Units
            </Link>
            <a
              href="https://wa.me/2347038462284?text=Hello%20JK-Cube%20Leasing%20Desk,%20I%20would%20like%20to%20inquire%20about%20renting%20an%20apartment%20in%201004%20Estate,%20Victoria%20Island."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-add-listing"
              style={{ background: '#16a34a', padding: '12px 20px' }}
            >
              WhatsApp Concierge Desk
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
