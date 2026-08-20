"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "about" },
  { href: "/people/", label: "people" },
  { href: "/publications/", label: "publications" },
  { href: "/events/", label: "events" },
];

export function SiteNav() {
  // trailingSlash: true means every route ends in "/" — normalize so "/people"
  // and "/people/" both mark the same link active.
  const pathname = (usePathname() ?? "/").replace(/\/?$/, "/");

  return (
    <header className="mx-auto flex w-full max-w-5xl items-center gap-5 px-6 py-6 sm:py-8">
      <nav className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "text-accent font-medium"
                  : "text-muted transition-colors hover:text-foreground"
              }
            >
              {label}
            </Link>
          );
        })}

        {/* sci square removed from the nav for now — the pages themselves
            (app/scisquare/*) are untouched and still reachable directly. */}
      </nav>
    </header>
  );
}
