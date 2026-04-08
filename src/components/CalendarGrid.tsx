"use client";

import { memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendar } from "@/hooks/useCalendar";
import { DayCell } from "./DayCell";
import { WEEKDAYS_SHORT } from "@/lib/constants";
import { useDateRange } from "@/hooks/useDateRange";

export const CalendarGrid = memo(function CalendarGrid() {
  const { year, month, monthName, days, goToPrevMonth, goToNextMonth } = useCalendar();
  const { selectDate, getCellState } = useDateRange();

  // Keyboard navigation: Alt+← / Alt+→
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.altKey && e.key === "ArrowLeft") goToPrevMonth();
      if (e.altKey && e.key === "ArrowRight") goToNextMonth();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToPrevMonth, goToNextMonth]);

  const handleDayClick = useCallback(
    (dateStr: string) => selectDate(dateStr),
    [selectDate]
  );

  return (
    <div className="rounded-xl border border-cal-border dark:border-cal-border-dark bg-surface dark:bg-surface-dark shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="cal-nav-btn"
        >
          ‹
        </button>
        <h2 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {monthName} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          className="cal-nav-btn"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 px-3 pb-1">
        {WEEKDAYS_SHORT.map((wd, i) => (
          <div
            key={wd}
            className={`text-center text-[10px] font-semibold uppercase tracking-widest py-1 ${
              i >= 5
                ? "text-cal-weekend dark:text-cal-weekend-dark"
                : "text-cal-muted dark:text-cal-muted-dark"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid — AnimatePresence for month transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-0.5 px-3 pb-4"
        >
          {days.map((day, idx) => {
            const cellState = day.isOtherMonth ? null : getCellState(day.dateStr);
            return (
              <DayCell
                key={`${day.dateStr}-${idx}`}
                day={day}
                isStart={cellState?.isStart ?? false}
                isEnd={cellState?.isEnd ?? false}
                inRange={cellState?.inRange ?? false}
                onClick={handleDayClick}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-5 pb-4 border-t border-cal-border dark:border-cal-border-dark pt-3">
        <LegendItem color="bg-accent dark:bg-accent-dark" label="Today / Selected" />
        <LegendItem color="bg-cal-range dark:bg-cal-range-dark border border-accent/40" label="Range" />
        <LegendItem color="bg-cal-weekend dark:bg-cal-weekend-dark" label="Weekend" />
        <LegendItem color="bg-amber-400" label="Holiday" />
        <LegendItem color="bg-accent/40 dark:bg-accent-dark/40" label="Has note" />
      </div>
    </div>
  );
});

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[10px] text-cal-muted dark:text-cal-muted-dark">{label}</span>
    </div>
  );
}
