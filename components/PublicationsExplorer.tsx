// A simple list grouped by year, descending — the al-folio site's badges
// (Altmetric/Dimensions/Google Scholar/INSPIRE-HEP) and its Subjects/Timeline/
// network views are dropped: those depend on Web of Science facet data this
// center doesn't have of its own, and the badges aren't worth rebuilding for
// a lab site that has no equivalent either.

import type { YearGroup } from "@/lib/publications";

const MONTHS = [
  "",
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function PublicationsExplorer({ groups }: { groups: YearGroup[] }) {
  return (
    <div className="mt-10 space-y-12">
      {groups.map(({ year, publications }) => (
        <section key={year ?? "undated"}>
          <h2 className="text-muted text-sm font-medium tracking-widest uppercase">
            {year ?? "Undated"}
          </h2>
          <ol className="border-border mt-4 divide-y divide-solid border-t">
            {publications.map((pub) => (
              <li key={pub.doi ?? pub.title} className="py-5">
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
                  {[pub.venue ?? pub.journal, pub.volume && `${pub.volume}${pub.issue ? `(${pub.issue})` : ""}`, pub.pages]
                    .filter(Boolean)
                    .join(", ")}
                  {pub.month ? `, ${MONTHS[pub.month]} ${year}` : year ? `, ${year}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
