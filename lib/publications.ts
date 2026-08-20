// The publication list — data/publications.json, written once by
// scripts/migrate-bib.mjs and extended from then on by the lab's
// sync-center.mjs (which mirrors matching Science of Science / STS papers
// from infosci.github.io).

import publicationsData from "@/data/publications.json";

export type Publication = {
  doi: string | null;
  title: string;
  authors: string[];
  journal: string;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  year: number | null;
  month: number | null;
  type: string | null;
  url: string | null;
  abstract: string | null;
  venue?: string | null;
  displayYear?: number | null;
  pdf: string | null;
  code: string | null;
  note: string | null;
};

export function yearOf(pub: Publication): number | null {
  return pub.displayYear ?? pub.year;
}

function sortByDate(a: Publication, b: Publication) {
  return (
    (yearOf(b) ?? 0) - (yearOf(a) ?? 0) ||
    (b.month ?? 0) - (a.month ?? 0) ||
    a.title.localeCompare(b.title)
  );
}

export function getPublications(): Publication[] {
  return [...(publicationsData as Publication[])].sort(sortByDate);
}

export type YearGroup = { year: number | null; publications: Publication[] };

export function getPublicationsByYear(): YearGroup[] {
  const all = getPublications();
  const groups = new Map<number | null, Publication[]>();
  for (const pub of all) {
    const y = yearOf(pub);
    if (!groups.has(y)) groups.set(y, []);
    groups.get(y)!.push(pub);
  }
  return [...groups.entries()]
    .sort((a, b) => (b[0] ?? 0) - (a[0] ?? 0))
    .map(([year, publications]) => ({ year, publications }));
}
