import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const indexFile = path.join(distDir, 'index.html');
const notFoundFile = path.join(distDir, '404.html');

if (!fs.existsSync(indexFile)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

// 1. Generate 404.html as general fallback
fs.copyFileSync(indexFile, notFoundFile);
console.log('✓ Generated dist/404.html from dist/index.html');

const indexHtml = fs.readFileSync(indexFile, 'utf8');

// 2. Discover all routes
const routes = [
  'apartments',
  'apartments/1-bedroom',
  'apartments/2-bedroom',
  'apartments/3-bedroom',
  'apartments/3-bedroom-maisonette',
  'apartments/4-bedroom',
  'apartments/studio',
  'apartments/available-now',
  'apartments/furnished',
  'apartments/serviced',
  'properties',
  'properties/1-bedroom',
  'properties/2-bedroom',
  'properties/3-bedroom',
  'properties/3-bedroom-maisonette',
  'properties/4-bedroom',
  'properties/studio',
  '1004-estate',
  '1004-estate/guide',
  '1004-estate/apartment-types',
  '1004-estate/rental-prices',
  '1004-estate/facilities',
  '1004-estate/location',
  '1004-estate/faqs',
  'login',
  'register',
  'dashboard',
  'contact',
  'admin',
  'admin/dashboard'
];

// Load properties from store files if present
const candidateStores = [
  path.join(__dirname, '../server/data/store.json'),
  path.join(__dirname, '../server/src/data/store.json')
];

candidateStores.forEach(storePath => {
  if (fs.existsSync(storePath)) {
    try {
      const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
      const props = store.properties || [];
      props.forEach(p => {
        if (p.slug) {
          routes.push(`apartments/${p.slug}`);
          routes.push(`properties/${p.slug}`);
        }
        if (p.id) {
          routes.push(`apartments/${p.id}`);
          routes.push(`properties/${p.id}`);
        }
      });
    } catch (e) {
      console.warn(`Warning: Could not parse ${storePath}:`, e.message);
    }
  }
});

// Deduplicate routes
const uniqueRoutes = [...new Set(routes)];

let createdCount = 0;
uniqueRoutes.forEach(routePath => {
  const targetDir = path.join(distDir, routePath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtml);
  createdCount++;
});

console.log(`✓ Pre-generated ${createdCount} static route entrypoints (index.html) to eliminate 404s on refresh.`);
