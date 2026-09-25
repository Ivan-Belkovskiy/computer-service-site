'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

interface PageTrackerProps {
  path?: string;
  event?: string;
}

export default function PageTracker({ path = '/', event = 'page_open' }: PageTrackerProps) {
  useEffect(() => {
    trackEvent(event, path);
  }, [path, event]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      
    }
  }, []);

  return null;
}