/**
 * Phones and low-end machines get a lighter version of every three.js scene:
 * no MSAA, a lower pixel ratio, fewer particles and cheaper materials.
 */
export function isLowPower() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth < 768 ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4
  );
}

/** Pixel-ratio cap: `full` on capable devices, 1.25 on low-power ones. */
export function pixelRatio(full: number, lite = isLowPower()) {
  return Math.min(window.devicePixelRatio, lite ? 1.25 : full);
}
