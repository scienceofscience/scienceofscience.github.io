"use client";

// Everyone in one grid, filtered by role — the React port of the chip-filter
// UX prototyped in Jekyll earlier (assets/js/people-grid.js). No mono/color
// toggle and no current/former status here: CSTS's roster has neither concept,
// just four fixed roles.

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/assets";

export type Person = {
  slug: string;
  name: string;
  /** The filter group — coarser than the person's actual title. The director
   *  sits in "advisory_board" alongside the external advisors; affiliated and
   *  external researchers both sit in "researcher". */
  role: "advisory_board" | "researcher";
  /** What the card shows under the name — specific ("Director", "External
   *  researcher"), unlike the chip group it's filtered by. */
  title: string;
  photo: string | null;
  order: number;
};

const ALL = "__all__";

const CHIP_LABEL: Record<string, string> = {
  advisory_board: "Leadership & Advisory Board",
  researcher: "Researchers",
};

// Fixed order, unlike the grid — a filter row that reshuffles itself is
// unusable.
const ROLE_ORDER = ["advisory_board", "researcher"];

function shuffleSlugs(people: Person[]) {
  const slugs = people.map((p) => p.slug);
  for (let i = slugs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slugs[i], slugs[j]] = [slugs[j], slugs[i]];
  }
  return slugs;
}

export default function PeopleExplorer({ people }: { people: Person[] }) {
  const [role, setRole] = useState<string>(ALL);
  // null until mount — a random draw during the initial render would not
  // match the prerendered HTML and React would swap the whole grid on load.
  const [order, setOrder] = useState<string[] | null>(null);

  const bySlug = useMemo(() => new Map(people.map((p) => [p.slug, p])), [people]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(shuffleSlugs(people));
  }, [people]);

  const pick = (next: string) => {
    setRole(next);
    setOrder(shuffleSlugs(people));
  };

  const ordered = order ? order.map((slug) => bySlug.get(slug)!) : people;

  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const p of people) c.set(p.role, (c.get(p.role) ?? 0) + 1);
    return ROLE_ORDER.filter((r) => c.has(r)).map((r) => ({ role: r, count: c.get(r)! }));
  }, [people]);

  const shown = role === ALL ? ordered : ordered.filter((p) => p.role === role);

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-1.5">
        <Chip label="All" count={people.length} on={role === ALL} onClick={() => pick(ALL)} />
        {counts.map(({ role: r, count }) => (
          <Chip
            key={r}
            label={CHIP_LABEL[r] ?? r}
            count={count}
            on={role === r}
            onClick={() => pick(role === r ? ALL : r)}
          />
        ))}
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
        {shown.map((person) => (
          <li key={person.slug}>
            <PersonCard person={person} />
          </li>
        ))}
      </ul>
    </>
  );
}

function Chip({
  label,
  count,
  on,
  onClick,
}: {
  label: string;
  count: number;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
        on
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted hover:border-accent hover:text-accent"
      }`}
    >
      {label}
      <span className={on ? "ml-1.5 opacity-70" : "ml-1.5 text-muted"}>{count}</span>
    </button>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <Link href={`/people/${person.slug}/`} className="group block transition-opacity hover:opacity-80">
      {person.photo ? (
        <Image
          src={asset(person.photo)}
          alt=""
          width={240}
          height={240}
          className="aspect-square w-full rounded-lg object-cover"
        />
      ) : (
        <div className="bg-border aspect-square w-full rounded-lg" />
      )}
      <span className="mt-2.5 block text-center leading-snug font-medium">{person.name}</span>
      <span className="text-muted mt-0.5 block text-center text-sm leading-snug">
        {person.title}
      </span>
    </Link>
  );
}
