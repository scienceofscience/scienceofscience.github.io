import type { Publication } from "@/lib/publications";

/** The 5 most recently published papers — replaces al-folio's manually
 *  flagged "selected" list with plain recency, same change already made on
 *  the (now retired) Jekyll site. */
export default function RecentPublications({ publications }: { publications: Publication[] }) {
  return (
    <ul className="mt-6 space-y-6">
      {publications.map((pub) => (
        <li key={pub.doi ?? pub.title}>
          <p className="font-medium">
            {pub.url ? (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                {pub.title}
              </a>
            ) : (
              pub.title
            )}
          </p>
          <p className="text-muted mt-1 text-sm">{pub.authors.join(", ")}</p>
          <p className="text-muted mt-0.5 text-sm italic">
            {pub.venue ?? pub.journal}, {pub.year}
          </p>
        </li>
      ))}
    </ul>
  );
}
