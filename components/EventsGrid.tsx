import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/assets";
import type { Event } from "@/lib/events";

const CATEGORY_LABEL: Record<string, string> = {
  talk: "Talk",
  workshop: "Workshop",
  tutorial: "Tutorial",
};

// One flat grid, most recent first — category no longer splits the page into
// sections (talks, workshops, and tutorials interleave by date), but stays
// visible as a small badge on each card so it isn't lost.
export default function EventsGrid({ events }: { events: Event[] }) {
  return (
    <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
      {events.map((event) => (
        <li key={event.slug}>
          <Link href={`/events/${event.slug}/`} className="group block transition-opacity hover:opacity-80">
            {event.img && (
              <Image
                src={asset(event.img)}
                alt=""
                width={480}
                height={300}
                className="aspect-video w-full rounded-lg object-cover"
              />
            )}
            <span className="border-border text-muted mt-2.5 inline-block rounded-full border px-2 py-0.5 text-xs">
              {CATEGORY_LABEL[event.category] ?? event.category}
            </span>
            <p className="mt-1.5 font-medium">{event.title}</p>
            <p className="text-muted mt-0.5 text-sm">{event.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
