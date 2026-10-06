import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  const breadcrumbsList = [
    { label: 'Home', path: '/' },
    ...items
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.84rem',
        color: '#6b7280',
        marginBottom: '16px',
        flexWrap: 'wrap',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {breadcrumbsList.map((item, index) => {
        const isLast = index === breadcrumbsList.length - 1;
        return (
          <React.Fragment key={index}>
            {index === 0 ? (
              <Link
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#4b5563',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
                title="Return to Home"
              >
                <Home size={13} />
                <span>Home</span>
              </Link>
            ) : isLast ? (
              <span
                style={{
                  color: '#111827',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                style={{
                  color: '#4b5563',
                  fontWeight: '500',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </Link>
            )}

            {!isLast && <ChevronRight size={13} color="#9ca3af" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
