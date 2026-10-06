import React from 'react';
import { useParams } from 'react-router-dom';
import PropertiesPage from '../pages/PropertiesPage';
import PropertyDetailPage from '../pages/PropertyDetailPage';

const KNOWN_CATEGORIES = new Set([
  '1-bedroom',
  '2-bedroom',
  '3-bedroom',
  '3-bedroom-maisonette',
  '4-bedroom',
  'available-now',
  'furnished',
  'unfurnished',
  'serviced'
]);

export default function ApartmentRouteDispatcher() {
  const { categoryOrSlug } = useParams();

  if (KNOWN_CATEGORIES.has(categoryOrSlug)) {
    return <PropertiesPage />;
  }

  return <PropertyDetailPage />;
}
