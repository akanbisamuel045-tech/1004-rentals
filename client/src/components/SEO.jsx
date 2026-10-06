import React, { useEffect } from 'react';

const DEFAULT_TITLE = 'JK - CUBE MULTIVENTURES LIMITED | 1004 Estate Serviced Rentals, Victoria Island, Lagos';
const DEFAULT_DESC = 'Official leasing & serviced apartment rentals at 1004 Estate, Victoria Island, Lagos by JK - CUBE MULTIVENTURES LIMITED. High-rise flats, maisonettes, and executive serviced apartments with 24/7 power, treated water, and verified security.';
const DEFAULT_IMAGE = 'https://1004rentals.ng/1004-estate-aerial.jpg';
const DOMAIN = 'https://1004rentals.ng';

export default function SEO({
  title,
  description,
  image,
  type = 'website',
  canonicalPath = '',
  property = null,
  breadcrumbs = null,
  faqs = null,
  isOrganization = false
}) {
  const metaTitle = title ? `${title} | JK - CUBE MULTIVENTURES LIMITED` : DEFAULT_TITLE;
  const metaDesc = description || DEFAULT_DESC;
  const metaImg = image || DEFAULT_IMAGE;
  const canonicalUrl = `${DOMAIN}${canonicalPath}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = metaTitle;

    // Helper to update meta element
    const setMetaTag = (selector, attribute, name, value) => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // 2. Update Primary Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', metaDesc);
    setMetaTag('meta[name="title"]', 'name', 'title', metaTitle);

    // 3. Update Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', metaTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDesc);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', metaImg);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', '1004 Estate Rentals — JK - CUBE MULTIVENTURES LIMITED');

    // 4. Update Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', metaTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', metaImg);

    // 5. Update Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 6. Inject Schema.org JSON-LD structured data
    let jsonLdScript = document.getElementById('jsonld-schema');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'jsonld-schema';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    const schemas = [];

    // RealEstateListing Schema (for Property Detail Page)
    if (property) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        'name': property.title,
        'description': property.description,
        'url': canonicalUrl,
        'image': property.images || [metaImg],
        'offers': {
          '@type': 'Offer',
          'price': property.price,
          'priceCurrency': 'NGN',
          'priceSpecification': {
            '@type': 'UnitPriceSpecification',
            'price': property.price,
            'priceCurrency': 'NGN',
            'unitText': 'ANNUALLY'
          },
          'availability': (property.availabilityStatus || 'Available').toLowerCase() === 'available'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock'
        },
        'accommodationCategory': property.propertyType || 'Apartment',
        'numberOfRooms': property.bedrooms,
        'numberOfBathroomsTotal': property.bathrooms,
        'floorSize': {
          '@type': 'QuantitativeValue',
          'value': property.sizesqm || 120,
          'unitCode': 'MTK'
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': property.address || property.location || '1004 Estate',
          'addressLocality': 'Victoria Island',
          'addressRegion': 'Lagos',
          'addressCountry': 'NG'
        },
        'landlord': {
          '@type': 'RealEstateAgent',
          'name': 'JK - CUBE MULTIVENTURES LIMITED',
          'telephone': '+2347038462284'
        }
      });
    }

    // BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const itemListElement = [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': DOMAIN
        },
        ...breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          'position': i + 2,
          'name': b.label || b.name,
          'item': `${DOMAIN}${b.path || b.url || ''}`
        }))
      ];

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': itemListElement
      });
    }

    // FAQPage Schema
    if (faqs && faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map((f) => ({
          '@type': 'Question',
          'name': f.question || f.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer || f.a
          }
        }))
      });
    }

    // Organization / RealEstateAgent Schema
    if (isOrganization || !property) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        'name': 'JK - CUBE MULTIVENTURES LIMITED',
        'alternateName': '1004 Estate Leasing Desk',
        'description': 'Specialized apartment leasing, servicing, and property management agency dedicated exclusively to 1004 Estate, Victoria Island, Lagos.',
        'url': DOMAIN,
        'logo': `${DOMAIN}/jk-cube-logo.png`,
        'telephone': '+2347038462284',
        'email': 'jkcube85@gmail.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '1004 Estate, Victoria Island',
          'addressLocality': 'Victoria Island',
          'addressRegion': 'Lagos',
          'addressCountry': 'NG'
        },
        'areaServed': {
          '@type': 'AdministrativeArea',
          'name': '1004 Estate, Victoria Island, Lagos'
        }
      });
    }

    if (schemas.length > 0) {
      jsonLdScript.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
    } else {
      jsonLdScript.remove();
    }

    return () => {
      const s = document.getElementById('jsonld-schema');
      if (s) s.remove();
    };
  }, [metaTitle, metaDesc, metaImg, canonicalUrl, property, breadcrumbs, faqs, isOrganization, type]);

  return null;
}
