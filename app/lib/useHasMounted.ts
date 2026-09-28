'use client';

import { useEffect, useState } from 'react';

/**
 * SSR/CSR hydration boundary gate. localStorage/sessionStorage have no
 * server-side snapshot, so pages that read them must render the same
 * stable shell on the server and on the first client render, then swap
 * in real data only after mounting — the pattern React's own docs
 * recommend for content that legitimately differs between server and
 * client: https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content
 */
export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration-boundary flag, not a data-fetch effect
    setHasMounted(true);
  }, []);
  return hasMounted;
}
