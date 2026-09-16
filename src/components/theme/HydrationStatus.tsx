'use client';

import { useEffect } from 'react';

export function HydrationStatus() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';

    return () => {
      delete document.documentElement.dataset.hydrated;
    };
  }, []);

  return null;
}
