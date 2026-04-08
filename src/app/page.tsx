import { CalendarApp } from "@/components/CalendarApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-cal-bg dark:bg-cal-bg-dark transition-colors duration-300">
      <CalendarApp />
    </main>
  );
}
