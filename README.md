#  Calendar.notes — Interactive Wall Calendar

A production-grade, fully responsive wall-calendar web app built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Framer Motion**.

----

## Live Demo

👉 https://cal-notes-lemon.vercel.app/
-----
## How to Run Locally
```bash
git clone 
cd cal-notes
npm install
npm run dev
# → http://localhost:3000
```


---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, ThemeProvider
│   ├── page.tsx            # Home page → <CalendarApp />
│   └── globals.css         # Tailwind base + component classes (.form-input, .icon-btn)
│
├── components/
│   ├── CalendarApp.tsx     # Top-level layout shell (TopBar + 3-column grid)
│   ├── CalendarGrid.tsx    # Month grid with navigation + AnimatePresence transitions
│   ├── DayCell.tsx         # Individual day cell — selection, range, holiday, note dots
│   ├── DateRangePicker.tsx # Reusable range-status banner
│   ├── HeroPanel.tsx       # Left panel — hero image, month stats
│   ├── NotesManager.tsx    # Right panel — notes list, add/edit/delete
│   ├── NoteModal.tsx       # Add / edit note modal (single date or range)
│   └── ThemeProvider.tsx   # Syncs Zustand dark state → <html class="dark">
│
├── hooks/
│   ├── useCalendar.ts      # Month navigation + derived stats
│   ├── useDateRange.ts     # Range selection state + getCellState(dateStr)
│   └── useLocalStorage.ts  # Generic typed localStorage hook (SSR-safe)
│
├── lib/
│   ├── calendarUtils.ts    # Pure date functions — grid builder, formatters, range logic
│   ├── constants.ts        # MONTHS, WEEKDAYS_SHORT, HOLIDAYS map
│   └── store.ts            # Zustand store (persisted) + derived selectors
│
└── types/
    └── index.ts            # All TypeScript interfaces (Note, CalendarDay, etc.)
```

---

## Architecture

### State Management — Zustand
All calendar state lives in a single Zustand store (`src/lib/store.ts`) with `persist` middleware. Only `dark` and `notes` are persisted to `localStorage`; ephemeral UI state (current month, modal open, range selection) is in-memory.

Derived selectors (`useNotesForMonth`, `useNotesForRange`, `useNotesForDate`) are stable selector hooks that avoid unnecessary re-renders via Zustand's built-in equality checks.

### Component Architecture
Components are split by responsibility:
- **Container components** (`CalendarApp`, `NotesManager`) orchestrate data and layout
- **Presentational components** (`DayCell`, `HeroPanel`) receive props and render UI
- **Hooks** encapsulate all logic (`useCalendar`, `useDateRange`, `useLocalStorage`)
- No prop drilling — components subscribe to the store directly via hooks

### Date Logic — Pure Functions
All date math is in `src/lib/calendarUtils.ts` as pure functions with no side effects. This makes them trivially testable and reusable.

### Performance
- `DayCell`, `CalendarGrid`, `NotesManager`, `NoteCard` are wrapped in `React.memo`
- `useCallback` on all event handlers in `DayCell` and `NoteModal`
- `useMemo` for calendar grid generation and month stats in `useCalendar`

---

## Features

| Feature | Implementation |
|---|---|
| Month navigation | `goToPrevMonth` / `goToNextMonth` in Zustand; `Alt+←/→` keyboard shortcuts |
| Today highlight | `todayStr` constant compared per cell |
| Date range selection | Two-click flow in `useDateRange` — start → end with reverse-selection normalisation |
| Same-day selection | Handled explicitly in `selectDate` |
| Notes — single date | Stored with `{ date }` field |
| Notes — date range | Stored with `{ dateStart, dateEnd }` fields |
| Notes persistence | Zustand `persist` middleware → `localStorage` |
| Dark mode | Tailwind `darkMode: "class"` + `ThemeProvider` syncs to `<html>` |
| Holiday indicators | Amber dot from `HOLIDAYS` map in `constants.ts` |
| Weekend highlighting | Red text from `isWeekend` on `CalendarDay` |
| Month transition animation | Framer Motion `AnimatePresence` slide on `CalendarGrid` |
| Modal animations | Framer Motion scale + fade |
| Keyboard accessibility | `tabIndex`, `aria-label`, `role="button"`, `Enter`/`Space` handlers |
| Responsive layout | Tailwind `md:grid-cols-[1fr_2fr_1fr]` → single-column on mobile |

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Next.js | 14.2 | App Router, SSR, fonts |
| React | 18 | UI |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.4 | Styling |
| Zustand | 4.5 | State management |
| Framer Motion | 11 | Animations |
| date-fns | 3.6 | Date utilities |
| clsx | 2.1 | Conditional class names |

---

## Design Decisions

- **No backend** — all data persisted client-side via Zustand + `localStorage`
- **Monday-first grid** — remaps JS `getDay()` (Sunday=0) to Monday=0
- **Normalised range** — `normaliseRange()` ensures `start <= end` regardless of click order
- **Wall calendar aesthetic** — Playfair Display display font, wave SVG divider, hero gradient panel


## 🙌 Author

Saurabh Kant Mishra
