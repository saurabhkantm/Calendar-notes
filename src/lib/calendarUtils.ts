import { CalendarDay } from "@/types";
import { HOLIDAYS, TODAY } from "./constants";

/** Format a date to YYYY-MM-DD */
export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Today as YYYY-MM-DD */
export const todayStr = toDateStr(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());

/** Parse YYYY-MM-DD → { year, month (0-indexed), day } */
export function parseDateStr(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

/** Human-readable: "Apr 8, 2026" */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const { year, month, day } = parseDateStr(dateStr);
  return new Date(year, month, day).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

/** Days in a given month */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * First weekday of month, Monday-indexed (0 = Mon, 6 = Sun)
 * JS getDay(): 0=Sun,1=Mon…6=Sat → remap to Mon-first
 */
export function getFirstWeekdayOfMonth(year: number, month: number): number {
  const jsDay = new Date(year, month, 1).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

/** Holiday name for a given month (0-indexed) + day, or undefined */
export function getHoliday(month: number, day: number): string | undefined {
  return HOLIDAYS[`${month + 1}-${day}`];
}

/**
 * Build the full 6-or-5-week grid for a given year+month.
 * Includes overflow days from prev/next month.
 */
export function buildCalendarGrid(year: number, month: number): CalendarDay[] {
  const totalDays = getDaysInMonth(year, month);
  const firstDow = getFirstWeekdayOfMonth(year, month);
  const prevMonthTotal = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  const days: CalendarDay[] = [];

  // Leading days from previous month
  for (let i = firstDow - 1; i >= 0; i--) {
    const py = month === 0 ? year - 1 : year;
    const pm = month === 0 ? 11 : month - 1;
    const pd = prevMonthTotal - i;
    days.push(makeDay(py, pm, pd, true));
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    days.push(makeDay(year, month, d, false));
  }

  // Trailing days from next month
  let trailing = 1;
  while (days.length % 7 !== 0) {
    const ny = month === 11 ? year + 1 : year;
    const nm = month === 11 ? 0 : month + 1;
    days.push(makeDay(ny, nm, trailing++, true));
  }

  return days;
}

function makeDay(year: number, month: number, day: number, isOtherMonth: boolean): CalendarDay {
  const dateStr = toDateStr(year, month, day);
  const jsDay = new Date(year, month, day).getDay();
  return {
    year, month, day, isOtherMonth,
    isToday: dateStr === todayStr,
    isWeekend: jsDay === 0 || jsDay === 6,
    dateStr,
    holiday: getHoliday(month, day),
  };
}

/** Normalise a range so start <= end */
export function normaliseRange(a: string, b: string): { start: string; end: string } {
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}

/** Is `date` strictly between start and end (exclusive)? */
export function isInRange(date: string, start: string, end: string): boolean {
  const { start: s, end: e } = normaliseRange(start, end);
  return date > s && date < e;
}

/** Count weekends in a month */
export function countWeekends(year: number, month: number): number {
  const total = getDaysInMonth(year, month);
  let count = 0;
  for (let d = 1; d <= total; d++) {
    const wd = new Date(year, month, d).getDay();
    if (wd === 0 || wd === 6) count++;
  }
  return count;
}

/** Count holidays in a month (0-indexed) */
export function countHolidays(month: number): number {
  return Object.keys(HOLIDAYS).filter((k) => k.startsWith(`${month + 1}-`)).length;
}
