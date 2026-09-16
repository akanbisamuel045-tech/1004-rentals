import React, { useEffect } from 'react';

const DEFAULT_TITLE = 'JK - CUBE MULTIVENTURES LIMITED | 1004 Estate Serviced Rentals, Victoria Island, Lagos';
const DEFAULT_DESC = 'Official leasing & serviced apartment rentals at 1004 Estate, Victoria Island, Lagos by JK - CUBE MULTIVENTURES LIMITED. High-rise flats, maisonettes, and executive serviced apartments with 24/7 power and security.';
const DEFAULT_IMAGE = 'https://jkcubemultiventures.com/1004-estate-aerial.jpg';
const DOMAIN = 'https://jkcubemultiventures.com';

export default function SEO({
  title,
  description,
  image,
  type = 'website',
  canonicalPath = '',
  property = null
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

    // 4. Update Twitter Card Tags
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

    // 6. Inject Schema.org JSON-LD structured data (if property prop is provided)
    let jsonLdScript = document.getElementById('jsonld-schema');
    if (property) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'jsonld-schema';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }

      const schemaData = {
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
          'availability': property.availabilityStatus === 'Available'
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
          'streetAddress': property.address || property.location,
          'addressLocality': 'Victoria Island',
          'addressRegion': 'Lagos',
          'addressCountry': 'NG'
        },
        'landlord': {
          '@type': 'RealEstateAgent',
          'name': 'JK - CUBE MULTIVENTURES LIMITED',
          'telephone': '+2347038462284'
        }
      };

      jsonLdScript.textContent = JSON.stringify(schemaData, null, 2);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    return () => {
      // Cleanup custom JSON-LD on unmount
      const s = document.getElementById('jsonld-schema');
      if (s) s.remove();
    };
  }, [metaTitle, metaDesc, metaImg, canonicalUrl, property, type]);

  return null;
}
