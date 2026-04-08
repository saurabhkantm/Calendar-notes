"use client";

import { useEffect } from "react";
import { useCalendarStore } from "@/lib/store";

/**
 * Syncs the Zustand dark-mode state with the <html> class.
 * Must be a Client Component because it reads from the store.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dark = useCalendarStore((s) => s.dark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return <>{children}</>;
}
