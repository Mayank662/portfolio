"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Subscribe to a media query. Server snapshot is `false`, so SSR markup is
 * the "no-feature" variant and the client upgrades after hydration.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True when the OS asks for reduced motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on devices with a precise pointer (mouse/trackpad). */
export function useFinePointer() {
  return useMediaQuery("(pointer: fine)");
}

/** True once the component has mounted on the client. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setM(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return m;
}

let webglSupport: boolean | null = null;
function detectWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const c = document.createElement("canvas");
    webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}
const noop = () => () => {};

/** `null` on the server, then a stable boolean on the client. */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(noop, detectWebGL, () => null);
}
