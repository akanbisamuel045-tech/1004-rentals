import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, Layers, Building2, CheckCircle2 } from 'lucide-react';
import { formatPriceNGN } from './PropertyCard';
import { Link } from 'react-router-dom';

// Fix Leaflet default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 1004 Estate Geographical Center & Clusters
const ESTATE_CENTER = [6.4367, 3.4150];

const CLUSTER_COORDINATES = {
  '1004 High-Rise Towers': { lat: 6.4375, lng: 3.4145, color: '#0284c7', desc: '14-floor high-rise towers with lagoon & VI skyline views' },
  '1004 Cluster A': { lat: 6.4362, lng: 3.4155, color: '#16a34a', desc: 'Recreation wing close to tennis courts and sports park' },
  '1004 Cluster B': { lat: 6.4358, lng: 3.4140, color: '#9333ea', desc: 'Executive wing with dedicated elevators & fast access' },
  '1004 Cluster C & D': { lat: 6.4370, lng: 3.4160, color: '#d97706', desc: 'Family wing featuring multi-floor maisonettes & green lawns' }
};

const ESTATE_LANDMARKS = [
  { name: '24/7 Independent Power Plant', lat: 6.4365, lng: 3.4135, icon: '⚡' },
  { name: 'Olympic Swimming Pools (2 Pools)', lat: 6.4360, lng: 3.4148, icon: '🏊' },
  { name: 'Lawn Tennis & Basketball Courts', lat: 6.4363, lng: 3.4158, icon: '🎾' },
  { name: 'Access Card Main Gate & CCTV', lat: 6.4355, lng: 3.4145, icon: '🛡️' },
  { name: 'Five Cowries Creek Waterfront', lat: 6.4380, lng: 3.4148, icon: '🌊' }
];

export default function EstateMap({
  properties = [],
  activeCluster = 'All',
  selectedPropertyId = null,
  height = '480px',
  showClusterControls = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const [selectedCluster, setSelectedCluster] = useState(activeCluster);

  useEffect(() => {
    setSelectedCluster(activeCluster);
  }, [activeCluster]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    const map = L.map(mapContainerRef.current, {
      center: ESTATE_CENTER,
      zoom: 17,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // OpenStreetMap HD Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | 1004 Estate VI'
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Pan Map on Property/Cluster changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Add Landmark Pins
    ESTATE_LANDMARKS.forEach((lm) => {
      const landmarkIcon = L.divIcon({
        className: 'custom-map-landmark',
        html: `<div style="
          background: #ffffff;
          border: 1.5px solid #000000;
          border-radius: 20px;
          padding: 2px 7px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #111827;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 4px;
        "><span>${lm.icon}</span><span>${lm.name}</span></div>`,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      L.marker([lm.lat, lm.lng], { icon: landmarkIcon })
        .bindPopup(`<strong>${lm.icon} ${lm.name}</strong><br/><small style="color:#6b7280">1004 Estate Landmark Feature</small>`)
        .addTo(markersGroup);
    });

    // Add Property Markers
    const propsToDisplay = selectedCluster === 'All'
      ? properties
      : properties.filter((p) => p.location === selectedCluster);

    propsToDisplay.forEach((prop, idx) => {
      const clusterData = CLUSTER_COORDINATES[prop.location] || { lat: 6.4367, lng: 3.4150, color: '#000000' };

      // Micro offset for multiple pins in the same cluster
      const jitterLat = (idx % 3 - 1) * 0.00025;
      const jitterLng = (Math.floor(idx / 3) % 3 - 1) * 0.0003;
      const markerLat = clusterData.lat + jitterLat;
      const markerLng = clusterData.lng + jitterLng;

      const isSelected = selectedPropertyId === prop.id;

      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: `<div style="
          background: ${isSelected ? '#000000' : clusterData.color};
          color: #ffffff;
          border: 2px solid #ffffff;
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 0.78rem;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.15s ease;
          transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
        ">
          ₦${(prop.price / 1000000).toFixed(1)}M • ${prop.bedrooms}B
        </div>`,
        iconSize: [85, 28],
        iconAnchor: [42, 14]
      });

      const popupContent = `
        <div style="width: 220px; font-family: system-ui, sans-serif;">
          <img src="${prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}"
               style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />
          <div style="font-size: 0.72rem; font-weight: 700; color: ${clusterData.color}; text-transform: uppercase; margin-bottom: 2px;">
            ${prop.location}
          </div>
          <div style="font-weight: 700; font-size: 0.9rem; color: #111827; margin-bottom: 4px; line-height: 1.2;">
            ${prop.title}
          </div>
          <div style="font-size: 0.8rem; color: #4b5563; margin-bottom: 6px;">
            ${prop.bedrooms} Bed • ${prop.bathrooms} Bath • ${prop.furnishedStatus}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
            <span style="font-weight: 800; color: #000000; font-size: 0.95rem;">
              ${formatPriceNGN(prop.price)}
            </span>
            <a href="/properties/${prop.id}" style="
              background: #000000;
              color: #ffffff;
              padding: 4px 10px;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 700;
              text-decoration: none;
              display: inline-block;
            ">
              View
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([markerLat, markerLng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(markersGroup);

      if (isSelected) {
        marker.openPopup();
        map.flyTo([markerLat, markerLng], 18, { animate: true, duration: 1 });
      }
    });
  }, [properties, selectedCluster, selectedPropertyId]);

  // Pan to Cluster
  const handleClusterClick = (clusterName) => {
    setSelectedCluster(clusterName);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (clusterName === 'All') {
      map.flyTo(ESTATE_CENTER, 17, { animate: true, duration: 1 });
    } else if (CLUSTER_COORDINATES[clusterName]) {
      const { lat, lng } = CLUSTER_COORDINATES[clusterName];
      map.flyTo([lat, lng], 18, { animate: true, duration: 1 });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      {/* Cluster Navigation Overlay Controls */}
      {showClusterControls && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 400,
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '6px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: '10px',
          border: '1px solid rgba(229, 231, 235, 0.8)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
        }}>
          <button
            onClick={() => handleClusterClick('All')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              background: selectedCluster === 'All' ? '#000000' : '#f3f4f6',
              color: selectedCluster === 'All' ? '#ffffff' : '#374151',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Compass size={13} /> All 1004 Units
          </button>

          {Object.keys(CLUSTER_COORDINATES).map((cName) => {
            const isSel = selectedCluster === cName;
            return (
              <button
                key={cName}
                onClick={() => handleClusterClick(cName)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: isSel ? CLUSTER_COORDINATES[cName].color : '#f3f4f6',
                  color: isSel ? '#ffffff' : '#374151',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Building2 size={13} /> {cName.replace('1004 ', '')}
              </button>
            );
          })}
        </div>
      )}

      {/* Leaflet Map Div Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height }} />

      {/* Bottom Info Bar */}
      <div style={{
        background: '#ffffff',
        padding: '10px 16px',
        borderTop: '1px solid #e5e7eb',
        fontSize: '0.8rem',
        color: '#4b5563',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Navigation size={13} color="#000000" />
          <span>Coordinates: <strong>6.4367° N, 3.4150° E</strong> (Adetokunbo Ademola / Ozumba Mbadiwe, VI)</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
          <span style={{ color: '#0284c7' }}>● High-Rise Towers</span>
          <span style={{ color: '#16a34a' }}>● Cluster A</span>
          <span style={{ color: '#9333ea' }}>● Cluster B</span>
          <span style={{ color: '#d97706' }}>● Cluster C & D</span>
        </div>
      </div>
    </div>
  );
}
