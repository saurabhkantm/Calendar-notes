"use client";

import { memo } from "react";
import { useDateRange } from "@/hooks/useDateRange";
import { formatDateDisplay } from "@/lib/calendarUtils";

/**
 * Displays the currently selected date range as a banner.
 * Renders nothing when no range is active.
 */
export const DateRangePicker = memo(function DateRangePicker() {
  const { range, clearRange } = useDateRange();

  if (range.status === "idle") return null;

  if (range.status === "selecting") {
    return (
      <Banner variant="muted">
        <span>Click an end date to complete the range</span>
        <ClearButton onClick={clearRange} />
      </Banner>
    );
  }

  const { start, end } = range;
  const isSameDay = start === end;

  return (
    <Banner variant="accent">
      <span>
        📅{" "}
        {isSameDay
          ? formatDateDisplay(start)
          : `${formatDateDisplay(start)} → ${formatDateDisplay(end)}`}
      </span>
      <ClearButton onClick={clearRange} />
    </Banner>
  );
});

function Banner({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "accent" | "muted";
}) {
  return (
    <div
      className={`mx-5 flex items-center justify-between rounded-md px-3 py-2 text-[12px] border ${
        variant === "accent"
          ? "bg-accent-soft dark:bg-accent-soft/20 border-accent/40 dark:border-accent-dark/40 text-accent dark:text-accent-dark"
          : "bg-cal-note dark:bg-cal-note-dark border-cal-border dark:border-cal-border-dark text-cal-muted dark:text-cal-muted-dark"
      }`}
    >
      {children}
    </div>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] opacity-60 hover:opacity-100 transition-opacity ml-2 shrink-0"
      aria-label="Clear selection"
    >
      Clear ✕
    </button>
  );
}
