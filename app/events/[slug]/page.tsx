import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { asset } from "@/lib/assets";
import { getEvent, getEvents } from "@/lib/events";

export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  return { title: event?.title ?? "Event" };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return null;

  return (
    <div className="max-w-3xl pt-6 sm:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
      <p className="text-muted mt-1">{event.description}</p>

      <div className="mt-8">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="text-muted mt-4 leading-relaxed first:mt-0">{children}</p>
            ),
            // A lone image on its own markdown line still arrives wrapped in
            // a <p> — react-markdown always wraps inline content in a
            // paragraph, and <figure>/<figcaption> (block elements) can't
            // nest inside <p>. Spans styled as blocks avoid that HTML
            // nesting error while still reading as a captioned figure. Each
            // image's alt text is its caption, ported from the original
            // <div class="caption"> sibling — see content/events/*.md.
            img: ({ src, alt }) => (
              <span className="mt-8 block first:mt-0">
                <Image
                  src={asset(String(src))}
                  alt=""
                  width={960}
                  height={600}
                  className="w-full rounded-lg object-cover"
                />
                {alt && <span className="text-muted mt-2 block text-sm">{alt}</span>}
              </span>
            ),
          }}
        >
          {event.body}
        </ReactMarkdown>
      </div>

      <Link
        href="/events/"
        className="border-border mt-10 inline-block rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-black/[.04]"
      >
        All events
      </Link>
    </div>
  );
}
