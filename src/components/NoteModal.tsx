"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarStore } from "@/lib/store";
import { useDateRange } from "@/hooks/useDateRange";
import { todayStr } from "@/lib/calendarUtils";
import { NoteFormValues, NoteType } from "@/types";

export function NoteModal() {
  const modalOpen = useCalendarStore((s) => s.modalOpen);
  const editingNoteId = useCalendarStore((s) => s.editingNoteId);
  const notes = useCalendarStore((s) => s.notes);
  const closeModal = useCalendarStore((s) => s.closeModal);
  const addNote = useCalendarStore((s) => s.addNote);
  const updateNote = useCalendarStore((s) => s.updateNote);
  const { range } = useDateRange();

  const editingNote = editingNoteId ? notes.find((n) => n.id === editingNoteId) : null;

  // Derive initial form values
  const rangeStart = range.status === "selected" ? range.start : todayStr;
  const rangeEnd = range.status === "selected" ? range.end : todayStr;

  const [form, setForm] = useState<NoteFormValues>({
    type: editingNote?.dateStart ? "range" : "single",
    date: editingNote?.date ?? rangeStart,
    dateStart: editingNote?.dateStart ?? rangeStart,
    dateEnd: editingNote?.dateEnd ?? rangeEnd,
    text: editingNote?.text ?? "",
  });

  // Re-init form when editing note changes
  useEffect(() => {
    if (editingNote) {
      setForm({
        type: editingNote.dateStart ? "range" : "single",
        date: editingNote.date ?? todayStr,
        dateStart: editingNote.dateStart ?? todayStr,
        dateEnd: editingNote.dateEnd ?? todayStr,
        text: editingNote.text,
      });
    }
  }, [editingNote]);

  const patch = useCallback(
    (key: keyof NoteFormValues, value: string) =>
      setForm((f) => ({ ...f, [key]: value })),
    []
  );

  const handleSave = useCallback(() => {
    const text = form.text.trim();
    if (!text) return;

    if (form.type === "single") {
      if (!form.date) return;
      if (editingNoteId) {
        updateNote(editingNoteId, { text, date: form.date, dateStart: undefined, dateEnd: undefined });
      } else {
        addNote({ text, date: form.date });
      }
    } else {
      if (!form.dateStart || !form.dateEnd) return;
      const start = form.dateStart <= form.dateEnd ? form.dateStart : form.dateEnd;
      const end = form.dateStart <= form.dateEnd ? form.dateEnd : form.dateStart;
      if (editingNoteId) {
        updateNote(editingNoteId, { text, dateStart: start, dateEnd: end, date: undefined });
      } else {
        addNote({ text, dateStart: start, dateEnd: end });
      }
    }
    closeModal();
  }, [form, editingNoteId, addNote, updateNote, closeModal]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          aria-modal="true"
          role="dialog"
          aria-label={editingNoteId ? "Edit note" : "Add note"}
        >
          <motion.div
            className="bg-surface dark:bg-surface-dark rounded-xl p-6 w-full max-w-md shadow-2xl border border-cal-border dark:border-cal-border-dark"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            <h3 className="font-display font-bold text-[1.1rem] text-gray-900 dark:text-gray-100 mb-4">
              {editingNoteId ? "Edit Note" : "Add Note"}
            </h3>

            {/* Note type selector */}
            <FormGroup label="Note type">
              <select
                value={form.type}
                onChange={(e) => patch("type", e.target.value as NoteType)}
                className="form-input"
              >
                <option value="single">Single date</option>
                <option value="range">Date range</option>
              </select>
            </FormGroup>

            {/* Single date */}
            {form.type === "single" && (
              <FormGroup label="Date">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => patch("date", e.target.value)}
                  className="form-input"
                />
              </FormGroup>
            )}

            {/* Date range */}
            {form.type === "range" && (
              <>
                <FormGroup label="Start date">
                  <input
                    type="date"
                    value={form.dateStart}
                    onChange={(e) => patch("dateStart", e.target.value)}
                    className="form-input"
                  />
                </FormGroup>
                <FormGroup label="End date">
                  <input
                    type="date"
                    value={form.dateEnd}
                    onChange={(e) => patch("dateEnd", e.target.value)}
                    className="form-input"
                  />
                </FormGroup>
              </>
            )}

            {/* Note text */}
            <FormGroup label="Note text">
              <textarea
                value={form.text}
                onChange={(e) => patch("text", e.target.value)}
                placeholder="Write your note here..."
                rows={3}
                className="form-input resize-y min-h-[80px]"
                autoFocus
              />
            </FormGroup>

            {/* Actions */}
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={closeModal}
                className="px-4 py-1.5 text-[13px] rounded-md border border-cal-border dark:border-cal-border-dark text-gray-700 dark:text-gray-300 hover:bg-cal-note dark:hover:bg-cal-note-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.text.trim()}
                className="px-4 py-1.5 text-[13px] rounded-md bg-accent dark:bg-accent-dark text-white font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {editingNoteId ? "Save Changes" : "Add Note"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-cal-muted dark:text-cal-muted-dark mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
