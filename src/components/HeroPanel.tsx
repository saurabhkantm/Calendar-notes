"use client";

import { motion } from "framer-motion";
import { useCalendar } from "@/hooks/useCalendar";
import { useNotesForMonth } from "@/lib/store";

export function HeroPanel() {
  const { year, month, monthName, stats } = useCalendar();
  const monthNotes = useNotesForMonth(year, month);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl overflow-hidden border border-cal-border dark:border-cal-border-dark bg-surface dark:bg-surface-dark shadow-sm"
    >
      {/* Hero image area */}
      <div className="relative h-[200px] bg-gradient-to-br from-[#2176ae] via-[#125a90] to-[#0a3d6b] overflow-hidden flex items-end">
        {/* Decorative SVG shapes */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.12]"
          viewBox="0 0 300 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="220" cy="55" r="85" fill="white" />
          <circle cx="70" cy="155" r="55" fill="white" />
          <circle cx="275" cy="165" r="45" fill="white" />
          <path d="M0 115 Q75 75 150 115 Q225 155 300 115 L300 200 L0 200Z" fill="white" />
        </svg>

        {/* Month/Year label */}
        <div className="relative z-10 p-5">
          <p className="text-[11px] font-light tracking-[0.12em] uppercase text-white/70 mb-1">
            {year}
          </p>
          <h2 className="font-display text-[2rem] font-bold leading-none text-white tracking-tight">
            {monthName}
          </h2>
        </div>
      </div>

      {/* Wave divider */}
      <div className="h-8 bg-surface dark:bg-surface-dark overflow-hidden">
        <svg
          viewBox="0 0 400 32"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M0 0 L0 16 Q50 32 100 16 Q150 0 200 16 Q250 32 300 16 Q350 0 400 16 L400 0 Z"
            fill="#1a6eb5"
          />
        </svg>
      </div>

      {/* Stats grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <StatCard value={stats.totalDays} label="Days" />
          <StatCard value={stats.weekends} label="Weekends" />
          <StatCard value={monthNotes.length} label="Notes" />
          <StatCard value={stats.holidays} label="Holidays" />
        </div>

        <p className="mt-3 text-[11px] text-cal-muted dark:text-cal-muted-dark leading-relaxed p-2 bg-cal-note dark:bg-cal-note-dark border border-cal-note-border dark:border-cal-note-border-dark rounded-md">
          <strong>Date Range:</strong> Click a day to start selection, click another to set the range.
        </p>
      </div>
    </motion.div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-cal-note dark:bg-cal-note-dark border border-cal-note-border dark:border-cal-note-border-dark rounded-md px-3 py-2">
      <div className="text-[1.35rem] font-semibold text-accent dark:text-accent-dark leading-none">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-cal-muted dark:text-cal-muted-dark mt-0.5">
        {label}
      </div>
    </div>
  );
}
