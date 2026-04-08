// ─── Note ────────────────────────────────────────────────────────────────────
export interface Note {
  id: string;
  text: string;
  /** ISO date string YYYY-MM-DD — set for single-date notes */
  date?: string;
  /** ISO date string — set for range notes */
  dateStart?: string;
  /** ISO date string — set for range notes */
  dateEnd?: string;
  createdAt: number;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
export interface CalendarDay {
  year: number;
  month: number; // 0-indexed
  day: number;
  isOtherMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  dateStr: string; // YYYY-MM-DD
  holiday?: string;
}

export interface CalendarStats {
  totalDays: number;
  weekends: number;
  holidays: number;
}

export type RangeSelectionState =
  | { status: "idle" }
  | { status: "selecting"; start: string }
  | { status: "selected"; start: string; end: string };

// ─── Theme ────────────────────────────────────────────────────────────────────
export type Theme = "light" | "dark";

// ─── Modal ────────────────────────────────────────────────────────────────────
export type NoteFormMode = "add" | "edit";
export type NoteType = "single" | "range";

export interface NoteFormValues {
  type: NoteType;
  date: string;
  dateStart: string;
  dateEnd: string;
  text: string;
}

// ─── Component Props ──────────────────────────────────────────────────────────
export interface DayCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  onClick: (dateStr: string) => void;
}

export interface StatCardProps {
  value: number;
  label: string;
}

export interface NoteCardProps {
  note: Note;
}
