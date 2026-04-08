import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Note, RangeSelectionState } from "@/types";
import { TODAY } from "@/lib/constants";
import { normaliseRange } from "@/lib/calendarUtils";

interface CalendarState {
  // ── Navigation ───────────────────────────────────────────────────────────
  year: number;
  month: number;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;

  // ── Theme ────────────────────────────────────────────────────────────────
  dark: boolean;
  toggleDark: () => void;

  // ── Date Range ───────────────────────────────────────────────────────────
  range: RangeSelectionState;
  selectDate: (dateStr: string) => void;
  clearRange: () => void;

  // ── Notes ────────────────────────────────────────────────────────────────
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  updateNote: (id: string, patch: Partial<Omit<Note, "id" | "createdAt">>) => void;
  deleteNote: (id: string) => void;

  // ── Modal ────────────────────────────────────────────────────────────────
  modalOpen: boolean;
  editingNoteId: string | null;
  openAddModal: () => void;
  openEditModal: (id: string) => void;
  closeModal: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      // ── Navigation ─────────────────────────────────────────────────────
      year: TODAY.getFullYear(),
      month: TODAY.getMonth(),

      goToPrevMonth: () =>
        set((s) => ({
          year: s.month === 0 ? s.year - 1 : s.year,
          month: s.month === 0 ? 11 : s.month - 1,
        })),

      goToNextMonth: () =>
        set((s) => ({
          year: s.month === 11 ? s.year + 1 : s.year,
          month: s.month === 11 ? 0 : s.month + 1,
        })),

      goToToday: () =>
        set({ year: TODAY.getFullYear(), month: TODAY.getMonth() }),

      // ── Theme ───────────────────────────────────────────────────────────
      dark: false,
      toggleDark: () => set((s) => ({ dark: !s.dark })),

      // ── Date Range ──────────────────────────────────────────────────────
      range: { status: "idle" },

      selectDate: (dateStr) => {
        const { range } = get();
        if (range.status === "idle" || range.status === "selected") {
          set({ range: { status: "selecting", start: dateStr } });
        } else {
          if (dateStr === range.start) {
            // Same day — treat as single-day range
            set({ range: { status: "selected", start: dateStr, end: dateStr } });
          } else {
            const { start, end } = normaliseRange(range.start, dateStr);
            set({ range: { status: "selected", start, end } });
          }
        }
      },

      clearRange: () => set({ range: { status: "idle" } }),

      // ── Notes ────────────────────────────────────────────────────────────
      notes: [],

      addNote: (note) =>
        set((s) => ({
          notes: [
            ...s.notes,
            { ...note, id: `note_${Date.now()}`, createdAt: Date.now() },
          ],
        })),

      updateNote: (id, patch) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
        })),

      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      // ── Modal ────────────────────────────────────────────────────────────
      modalOpen: false,
      editingNoteId: null,

      openAddModal: () => set({ modalOpen: true, editingNoteId: null }),
      openEditModal: (id) => set({ modalOpen: true, editingNoteId: id }),
      closeModal: () => set({ modalOpen: false, editingNoteId: null }),
    }),
    {
      name: "cal-notes-storage",
      // Only persist dark mode and notes — not ephemeral UI state
      partialize: (s) => ({ dark: s.dark, notes: s.notes }),
    }
  )
);

// ── Derived selectors (stable refs, call inside components) ──────────────────

export function useNotesForMonth(year: number, month: number): Note[] {
  return useCalendarStore((s) =>
    s.notes.filter((n) => {
      const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
      if (n.date) return n.date.startsWith(prefix);
      if (n.dateStart) return n.dateStart.startsWith(prefix) || (n.dateEnd ?? "").startsWith(prefix);
      return false;
    })
  );
}

export function useNotesForRange(start: string, end: string): Note[] {
  return useCalendarStore((s) =>
    s.notes.filter((n) => {
      if (n.date) return n.date >= start && n.date <= end;
      if (n.dateStart && n.dateEnd)
        return n.dateStart <= end && n.dateEnd >= start;
      return false;
    })
  );
}

export function useNotesForDate(dateStr: string): Note[] {
  return useCalendarStore((s) =>
    s.notes.filter(
      (n) =>
        n.date === dateStr ||
        (n.dateStart && n.dateEnd && dateStr >= n.dateStart && dateStr <= n.dateEnd)
    )
  );
}
