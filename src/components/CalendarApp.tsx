"use client";

import { useCalendarStore } from "@/lib/store";
import { HeroPanel } from "./HeroPanel";
import { CalendarGrid } from "./CalendarGrid";
import { NotesManager } from "./NotesManager";
import { NoteModal } from "./NoteModal";

/**
 * Root client component — composes the three-panel layout.
 * No business logic lives here; it just arranges panels.
 */
export function CalendarApp() {
  const modalOpen = useCalendarStore((s) => s.modalOpen);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-8">
      {/* Top bar */}
      <TopBar />

      {/* Three-column grid → single column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-6 items-start">
        <HeroPanel />
        <CalendarGrid />
        <NotesManager />
      </div>

      {modalOpen && <NoteModal />}
    </div>
  );
}

function TopBar() {
  const dark = useCalendarStore((s) => s.dark);
  const toggleDark = useCalendarStore((s) => s.toggleDark);
  const goToToday = useCalendarStore((s) => s.goToToday);

  return (
    <div className="flex items-center justify-between mb-5 md:mb-7">
      <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Cal<span className="text-accent dark:text-accent-dark">.</span>NOTES
      </h1>
      <div className="flex gap-2">
        <button
          onClick={toggleDark}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Light mode" : "Dark mode"}
          className="icon-btn"
        >
          {dark ? "☀" : "☾"}
        </button>
        <button
          onClick={goToToday}
          aria-label="Jump to today"
          title="Jump to today"
          className="icon-btn"
        >
          ⌂
        </button>
      </div>
    </div>
  );
}
