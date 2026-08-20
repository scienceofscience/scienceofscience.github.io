import type { Metadata } from "next";
import EventsGrid from "@/components/EventsGrid";
import { getEvents } from "@/lib/events";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  const events = getEvents();

  return (
    <div className="pt-6 sm:pt-10">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Events</h1>
      <div className="border-border mt-8 max-w-3xl border-b" />
      <div className="max-w-3xl">
        <EventsGrid events={events} />
      </div>
    </div>
  );
}
