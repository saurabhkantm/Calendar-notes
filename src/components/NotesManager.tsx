"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarStore, useNotesForMonth, useNotesForRange } from "@/lib/store";
import { useDateRange } from "@/hooks/useDateRange";
import { useCalendar } from "@/hooks/useCalendar";
import { DateRangePicker } from "./DateRangePicker";
import { formatDateDisplay } from "@/lib/calendarUtils";
import { Note } from "@/types";

export const NotesManager = memo(function NotesManager() {
  const { year, month } = useCalendar();
  const { range } = useDateRange();
  const openAddModal = useCalendarStore((s) => s.openAddModal);

  const notesForMonth = useNotesForMonth(year, month);
  const notesForRange = useNotesForRange(
    range.status === "selected" ? range.start : "",
    range.status === "selected" ? range.end : ""
  );

  const displayNotes = range.status === "selected" ? notesForRange : notesForMonth;

  return (
    <div className="rounded-xl border border-cal-border dark:border-cal-border-dark bg-surface dark:bg-surface-dark shadow-sm flex flex-col gap-3 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4">
        <h3 className="font-display font-bold text-[1rem] text-gray-900 dark:text-gray-100">
          Notes
        </h3>
        <button
          onClick={openAddModal}
          className="bg-accent dark:bg-accent-dark text-white text-[12px] font-medium px-3 py-1.5 rounded-md hover:opacity-90 active:scale-95 transition-all"
        >
          + Add
        </button>
      </div>

      {/* Range banner */}
      <DateRangePicker />

      {/* Notes list */}
      <div className="px-5 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {displayNotes.length > 0 ? (
            displayNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-cal-muted dark:text-cal-muted-dark text-[13px]"
            >
              <div className="text-3xl mb-2 opacity-40">📝</div>
              <p>
                {range.status === "selected"
                  ? "No notes in selected range."
                  : "No notes this month."}
              </p>
              <p className="text-[11px] mt-1">Click "+ Add" to create one</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

const NoteCard = memo(function NoteCard({ note }: { note: Note }) {
  const openEditModal = useCalendarStore((s) => s.openEditModal);
  const deleteNote = useCalendarStore((s) => s.deleteNote);

  const dateLabel = note.date
    ? formatDateDisplay(note.date)
    : `${formatDateDisplay(note.dateStart!)} — ${formatDateDisplay(note.dateEnd!)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="bg-cal-note dark:bg-cal-note-dark border border-cal-note-border dark:border-cal-note-border-dark rounded-md p-3 group hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors"
    >
      <div className="flex items-start justify-between mb-1.5">
        <span className="text-[11px] bg-accent-soft dark:bg-accent-soft/20 text-accent dark:text-accent-dark rounded px-1.5 py-0.5 font-medium">
          {dateLabel}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openEditModal(note.id)}
            aria-label="Edit note"
            className="text-cal-muted dark:text-cal-muted-dark hover:text-accent dark:hover:text-accent-dark text-[13px] px-1.5 py-0.5 rounded hover:bg-accent-soft dark:hover:bg-accent-soft/20 transition-colors"
          >
            ✎
          </button>
          <button
            onClick={() => deleteNote(note.id)}
            aria-label="Delete note"
            className="text-cal-muted dark:text-cal-muted-dark hover:text-red-500 text-[13px] px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      <p className="text-[12px] text-gray-800 dark:text-gray-200 leading-relaxed break-words">
        {note.text}
      </p>
    </motion.div>
  );
});
