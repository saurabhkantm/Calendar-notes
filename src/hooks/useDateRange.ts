"use client";

import { useCalendarStore } from "@/lib/store";
import { normaliseRange, isInRange } from "@/lib/calendarUtils";

/**
 * Encapsulates date-range selection logic.
 * Returns helpers to determine visual state for each calendar cell.
 */
export function useDateRange() {
  const range = useCalendarStore((s) => s.range);
  const selectDate = useCalendarStore((s) => s.selectDate);
  const clearRange = useCalendarStore((s) => s.clearRange);

  const normalisedRange =
    range.status === "selected"
      ? normaliseRange(range.start, range.end)
      : null;

  function getCellState(dateStr: string): {
    isStart: boolean;
    isEnd: boolean;
    inRange: boolean;
    isSelecting: boolean;
  } {
    if (range.status === "idle") {
      return { isStart: false, isEnd: false, inRange: false, isSelecting: false };
    }
    if (range.status === "selecting") {
      return {
        isStart: dateStr === range.start,
        isEnd: false,
        inRange: false,
        isSelecting: true,
      };
    }
    const { start, end } = normaliseRange(range.start, range.end);
    return {
      isStart: dateStr === start,
      isEnd: dateStr === end,
      inRange: isInRange(dateStr, start, end),
      isSelecting: false,
    };
  }

  return {
    range,
    normalisedRange,
    selectDate,
    clearRange,
    getCellState,
  };
}
