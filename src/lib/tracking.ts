export const trackEvent = (event: string, path?: string) => {
  if (typeof window === 'undefined') return;

  const currentPath = path || window.location.pathname;
  const payload = JSON.stringify({ event, path: currentPath });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/track', blob);
  } else {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
};