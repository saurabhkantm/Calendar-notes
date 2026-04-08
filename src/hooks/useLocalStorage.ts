"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Generic localStorage hook with SSR safety.
 * The Zustand store handles note/theme persistence via its own persist middleware,
 * but this hook is exported for any component-level storage needs.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            console.warn(`useLocalStorage: failed to write key "${key}"`);
          }
        }
        return next;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  }, [key, initialValue]);

  // Sync across tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {}
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
