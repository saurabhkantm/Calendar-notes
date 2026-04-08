"use client";

import { memo, useCallback } from "react";
import { CalendarDay } from "@/types";
import { useNotesForDate } from "@/lib/store";
import clsx from "clsx";

interface DayCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  onClick: (dateStr: string) => void;
}

export const DayCell = memo(function DayCell({
  day,
  isStart,
  isEnd,
  inRange,
  onClick,
}: DayCellProps) {
  const notes = useNotesForDate(day.isOtherMonth ? "" : day.dateStr);
  const hasNote = notes.length > 0;

  const handleClick = useCallback(() => {
    if (!day.isOtherMonth) onClick(day.dateStr);
  }, [day.isOtherMonth, day.dateStr, onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  if (day.isOtherMonth) {
    return (
      <div
        aria-hidden="true"
        className="aspect-square flex items-center justify-center text-[13px] text-cal-other dark:text-cal-other-dark select-none"
      >
        {day.day}
      </div>
    );
  }

  const isSelected = isStart || isEnd;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${day.day} ${day.isToday ? "(Today)" : ""}${day.holiday ? ` — ${day.holiday}` : ""}`}
      aria-pressed={isSelected}
      title={day.holiday}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        // Base
        "relative aspect-square flex items-center justify-center text-[13px] select-none cursor-pointer rounded-md transition-all duration-100",
        // Default hover
        !isSelected && !inRange && !day.isToday &&
          "hover:bg-accent-soft dark:hover:bg-accent-soft/20 hover:text-accent dark:hover:text-accent-dark",
        // Today
        day.isToday && !isSelected &&
          "bg-accent dark:bg-accent-dark text-white font-semibold rounded-full",
        // Selected (start or end)
        isSelected &&
          "bg-accent dark:bg-accent-dark text-white font-semibold rounded-full z-10",
        // In range
        inRange && !isSelected &&
          "bg-cal-range dark:bg-cal-range-dark rounded-none",
        // Weekend colour (not overridden by selection)
        day.isWeekend && !isSelected && !day.isToday &&
          "text-cal-weekend dark:text-cal-weekend-dark",
      )}
    >
      {day.day}

      {/* Holiday dot — amber, top-right */}
      {day.holiday && (
        <span
          className={clsx(
            "absolute top-[3px] right-[5px] w-1 h-1 rounded-full bg-amber-400",
            isSelected && "bg-white/80"
          )}
          aria-hidden="true"
        />
      )}

      {/* Note dot — bottom-center */}
      {hasNote && (
        <span
          className={clsx(
            "absolute bottom-[3px] w-1 h-1 rounded-full",
            isSelected || day.isToday
              ? "bg-white"
              : inRange
              ? "bg-accent dark:bg-accent-dark"
              : "bg-accent dark:bg-accent-dark"
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
});
