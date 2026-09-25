'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function TimeOnPageTracker() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    const sendTimeSpent = () => {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

      if (durationSeconds < 1) return;

      const payload = JSON.stringify({
        event: 'time_on_page',
        path: pathname,
        duration: durationSeconds,
      });

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

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendTimeSpent();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      sendTimeSpent();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}