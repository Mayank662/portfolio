import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/**
 * Lock/unlock page scrolling for overlays. Uses Lenis when it is running
 * (it cancels wheel/touch and sets `.lenis-stopped`), and falls back to a
 * body overflow lock when it is not (reduced motion).
 */
export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.body.style.overflow = locked ? "hidden" : "";
}
