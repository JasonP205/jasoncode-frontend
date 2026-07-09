import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the first client render, then `true` once
 * mounted — without the classic `setState`-in-`useEffect` (which triggers a
 * cascading render and trips `react-hooks/set-state-in-effect`). Use to gate
 * client-only UI that would otherwise cause a hydration mismatch.
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
