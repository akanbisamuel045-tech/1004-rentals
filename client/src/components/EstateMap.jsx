import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Building2, ExternalLink, Layers, CheckCircle2 } from 'lucide-react';

// 1004 Estate Cluster Coordinates & Search Query Names for Google Maps
const CLUSTER_DATA = {
  'All': {
    label: 'All 1004 Estate',
    query: '1004 Estate, Adetokunbo Ademola Street, Victoria Island, Lagos, Nigeria',
    coords: '6.4367° N, 3.4150° E',
    zoom: 17,
    desc: 'Central view of 1004 Estate, Victoria Island, Lagos'
  },
  '1004 High-Rise Towers': {
    label: 'High-Rise Towers',
    query: '1004 Estate High Rise, Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
    coords: '6.4375° N, 3.4145° E',
    zoom: 18,
    desc: '14-floor towers overlooking Five Cowries Creek & VI skyline'
  },
  '1004 Cluster A': {
    label: 'Cluster A',
    query: '1004 Estate Cluster A, Victoria Island, Lagos',
    coords: '6.4362° N, 3.4155° E',
    zoom: 18,
    desc: 'Recreation wing close to Olympic swimming pools & tennis courts'
  },
  '1004 Cluster B': {
    label: 'Cluster B',
    query: '1004 Estate Cluster B, Victoria Island, Lagos',
    coords: '6.4358° N, 3.4140° E',
    zoom: 18,
    desc: 'Executive wing with fast gate access and dedicated elevators'
  },
  '1004 Cluster C': {
    label: 'Cluster C',
    query: '1004 Estate Cluster C, Victoria Island, Lagos',
    coords: '6.4370° N, 3.4160° E',
    zoom: 18,
    desc: 'Family wing featuring spacious multi-level maisonettes'
  },
  '1004 Cluster D': {
    label: 'Cluster D',
    query: '1004 Estate Cluster D, Victoria Island, Lagos',
    coords: '6.4375° N, 3.4165° E',
    zoom: 18,
    desc: 'Serene residential cluster with immediate proximity to swimming pools'
  }
};

const ESTATE_LANDMARKS = [
  { name: '24/7 Power Turbine', query: '1004 Estate Power Plant Victoria Island Lagos', icon: '⚡' },
  { name: 'Olympic Swimming Pools', query: '1004 Estate Swimming Pool Victoria Island Lagos', icon: '🏊' },
  { name: 'Lawn Tennis Courts', query: '1004 Estate Tennis Court Victoria Island Lagos', icon: '🎾' },
  { name: 'Main Security Gate', query: '1004 Estate Main Gate Victoria Island Lagos', icon: '🛡️' },
  { name: 'Five Cowries Waterfront', query: 'Ozumba Mbadiwe Five Cowries Creek Victoria Island Lagos', icon: '🌊' }
];

export default function EstateMap({
  properties = [],
  activeCluster = 'All',
  selectedPropertyId = null,
  height = '480px',
  showClusterControls = true
}) {
  const [selectedClusterKey, setSelectedClusterKey] = useState(activeCluster in CLUSTER_DATA ? activeCluster : 'All');
  const [mapType, setMapType] = useState('m'); // 'm' = roadmap, 'k' = satellite
  const [customSearchQuery, setCustomSearchQuery] = useState(null);

  useEffect(() => {
    if (activeCluster && (activeCluster in CLUSTER_DATA || `1004 ${activeCluster}` in CLUSTER_DATA)) {
      const key = activeCluster in CLUSTER_DATA ? activeCluster : `1004 ${activeCluster}`;
      setSelectedClusterKey(key);
      setCustomSearchQuery(null);
    }
  }, [activeCluster]);

  const currentCluster = CLUSTER_DATA[selectedClusterKey] || CLUSTER_DATA['All'];
  const activeQuery = customSearchQuery || currentCluster.query;

  // Google Maps Embed URL
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(activeQuery)}&t=${mapType}&z=${currentCluster.zoom || 17}&ie=UTF8&iwloc=&output=embed`;
  const googleMapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeQuery)}`;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      background: '#f3f4f6'
    }}>
      {/* Cluster Navigation Overlay Controls */}
      {showClusterControls && (
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          right: '14px',
          maxWidth: 'calc(100% - 28px)',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          pointerEvents: 'none'
        }}>
          {/* Cluster Pills */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            maxWidth: '100%',
            padding: '6px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(229, 231, 235, 0.9)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            pointerEvents: 'auto'
          }}>
            {Object.keys(CLUSTER_DATA).map((key) => {
              const item = CLUSTER_DATA[key];
              const isSelected = selectedClusterKey === key && !customSearchQuery;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedClusterKey(key);
                    setCustomSearchQuery(null);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: isSelected ? '#000000' : 'transparent',
                    color: isSelected ? '#ffffff' : '#374151',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {key === 'All' ? <Compass size={13} /> : <Building2 size={13} />}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Map Type Switcher & External Link */}
          <div style={{
            display: 'flex',
            gap: '6px',
            padding: '6px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(229, 231, 235, 0.9)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            pointerEvents: 'auto'
          }}>
            <button
              type="button"
              onClick={() => setMapType(mapType === 'm' ? 'k' : 'm')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                background: mapType === 'k' ? '#000000' : '#ffffff',
                color: mapType === 'k' ? '#ffffff' : '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Toggle Satellite Imagery"
            >
              <Layers size={13} />
              {mapType === 'k' ? 'Satellite View' : 'Map View'}
            </button>

            <a
              href={googleMapsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                border: 'none',
                background: '#16a34a',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Open Google Maps in full screen"
            >
              Google Maps <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* Google Maps Iframe Embed */}
      <div style={{ width: '100%', height, position: 'relative' }}>
        <iframe
          title="1004 Estate Victoria Island Google Map"
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Quick Landmark Jump Pills */}
      <div style={{
        background: '#ffffff',
        padding: '10px 16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        fontSize: '0.8rem'
      }}>
        <span style={{ fontWeight: '700', color: '#111827', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={13} color="#000000" /> Key Landmarks:
        </span>
        {ESTATE_LANDMARKS.map((lm) => (
          <button
            key={lm.name}
            type="button"
            onClick={() => setCustomSearchQuery(lm.query)}
            style={{
              background: customSearchQuery === lm.query ? '#f3f4f6' : '#ffffff',
              border: customSearchQuery === lm.query ? '1.5px solid #000000' : '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              color: '#374151',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{lm.icon}</span> {lm.name}
          </button>
        ))}
      </div>

      {/* Bottom Coordinates & Info Bar */}
      <div style={{
        background: '#fafafa',
        padding: '10px 18px',
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
          <span>Coordinates: <strong>{currentCluster.coords}</strong> (1004 Estate, Victoria Island, Lagos)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem', fontWeight: '600' }}>
          <span style={{ color: '#0284c7' }}>● High-Rise Towers</span>
          <span style={{ color: '#16a34a' }}>● Cluster A</span>
          <span style={{ color: '#9333ea' }}>● Cluster B</span>
          <span style={{ color: '#d97706' }}>● Cluster C</span>
          <span style={{ color: '#ea580c' }}>● Cluster D</span>
        </div>
      </div>
    </div>
  );
}
