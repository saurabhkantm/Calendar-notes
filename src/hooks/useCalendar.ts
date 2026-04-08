"use client";

import { useMemo } from "react";
import { useCalendarStore } from "@/lib/store";
import {
  buildCalendarGrid,
  countWeekends,
  countHolidays,
  getDaysInMonth,
} from "@/lib/calendarUtils";
import { MONTHS } from "@/lib/constants";

/**
 * High-level hook — encapsulates calendar navigation state and derived values.
 * Components consume this instead of reaching into the store directly.
 */
export function useCalendar() {
  const year = useCalendarStore((s) => s.year);
  const month = useCalendarStore((s) => s.month);
  const goToPrevMonth = useCalendarStore((s) => s.goToPrevMonth);
  const goToNextMonth = useCalendarStore((s) => s.goToNextMonth);
  const goToToday = useCalendarStore((s) => s.goToToday);

  const days = useMemo(() => buildCalendarGrid(year, month), [year, month]);

  const stats = useMemo(
    () => ({
      totalDays: getDaysInMonth(year, month),
      weekends: countWeekends(year, month),
      holidays: countHolidays(month),
    }),
    [year, month]
  );

  return {
    year,
    month,
    monthName: MONTHS[month],
    days,
    stats,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  };
}
