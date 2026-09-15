export const DEFAULT_PROPERTY_IMAGE = '/1004-estate-aerial.jpg';

export const FALLBACK_IMAGES = [
  '/1004-estate-aerial.jpg',
  '/1004-interior-living.jpg',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
];

export function getImageUrl(src) {
  if (!src) return DEFAULT_PROPERTY_IMAGE;
  return src;
}

export function handleImageError(e, fallback = DEFAULT_PROPERTY_IMAGE) {
  const currentSrc = e.target.src;
  // If a relative /uploads request failed via proxy, try direct backend server on port 5000
  if (currentSrc && currentSrc.includes('/uploads/') && !currentSrc.includes(':5000')) {
    const filename = currentSrc.split('/uploads/')[1];
    if (filename) {
      e.target.src = `http://localhost:5000/uploads/${filename}`;
      return;
    }
  }
  e.target.onerror = null;
  e.target.src = fallback;
}
