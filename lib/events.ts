// Events are markdown files with frontmatter, not JSON — bodies carry
// multi-image galleries with captions (standard markdown image syntax, alt
// text doubling as the caption), which a flat JSON record would either
// flatten or need a second content field for anyway.
//
// Called only from Server Components, which run at build time under
// output: "export".

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { readMarkdown } from "./markdown";

export type Event = {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD), for sorting — description is the free-text
   *  display string ("Nov 19, 2025 @ Yonsei University") and isn't reliable
   *  to parse back into a date. */
  date: string;
  img: string | null;
  category: "talk" | "workshop" | "tutorial" | string;
  importance: number;
  body: string;
};

const EVENTS_DIR = join(process.cwd(), "content", "events");

function slugs(): string[] {
  return readdirSync(EVENTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.slice(0, -3));
}

function load(slug: string): Event {
  const { meta, body } = readMarkdown(`events/${slug}`);
  return {
    slug,
    title: meta.title ?? slug,
    description: meta.description ?? "",
    date: meta.date ?? "",
    img: meta.img ?? null,
    category: meta.category ?? "",
    importance: Number(meta.importance) || 0,
    body,
  };
}

// Most recent first. Several talks share a date (a single day can host more
// than one speaker), so importance — already used to order same-day talks
// within the old per-category grouping — breaks the tie.
export function getEvents(): Event[] {
  return slugs()
    .map(load)
    .sort((a, b) => b.date.localeCompare(a.date) || a.importance - b.importance);
}

export function getEvent(slug: string): Event | null {
  return slugs().includes(slug) ? load(slug) : null;
}
