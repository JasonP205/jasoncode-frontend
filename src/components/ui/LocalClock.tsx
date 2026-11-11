"use client";

import { useSyncExternalStore } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Ho_Chi_Minh",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

/** The time in Ho Chi Minh City, ticking every second. "--:--:--" on the server. */
export default function LocalClock({ className }: { className?: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => fmt.format(Date.now()),
    () => "--:--:--",
  );
  return (
    <time suppressHydrationWarning className={className}>
      {time}
    </time>
  );
}
