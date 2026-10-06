/**
 * Analytics & Event Tracking Engine for 1004 Estate Rental Platform
 * JK - CUBE MULTIVENTURES LIMITED
 */

const LOCAL_STORAGE_KEY = 'lagos_rentals_events';
const MAX_LOCAL_EVENTS = 200;

export function trackEvent(eventName, payload = {}) {
  try {
    const event = {
      name: eventName,
      category: payload.category || 'user_action',
      propertyId: payload.propertyId || null,
      propertyTitle: payload.propertyTitle || null,
      page: payload.page || window.location.pathname,
      source: payload.source || 'web_client',
      metadata: payload.metadata || {},
      timestamp: new Date().toISOString()
    };

    // 1. Mirror locally for rapid audit / resilience
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      stored.unshift(event);
      if (stored.length > MAX_LOCAL_EVENTS) {
        stored.splice(MAX_LOCAL_EVENTS);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored));
    } catch (_) {}

    // 2. Dispatch non-blocking POST to server
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true
    }).catch(() => {
      // Fail silently on client network interruption
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event] ${eventName}:`, payload);
    }
  } catch (err) {
    // Non-blocking
  }
}

export function getLocalEventHistory() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
