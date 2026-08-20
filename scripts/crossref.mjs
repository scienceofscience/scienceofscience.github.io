// Crossref lookup + normalization, shared by migrate-bib.mjs and (should an
// ongoing add-paper tool ever be written) any future single-paper add script.
//
// Everything the publication list renders comes from here, so this file is the
// single place where Crossref's shape is translated into ours. Crossref is
// authoritative for bibliographic facts (title, authors, venue, date); the
// fields the site owns — pdf, code, note — are never written here and are
// preserved across refetches by mergeRecord() below.

// Crossref asks that automated callers identify themselves; doing so also puts
// us in their faster "polite" pool. https://api.crossref.org/swagger-ui
const MAILTO = "yonseidatalab@gmail.com";
const UA = `csts-next (https://sci.yonsei.ac.kr; mailto:${MAILTO})`;

// Crossref returns publisher-supplied JATS/HTML inside titles and journal names
// — strip tags, then decode the handful of entities that actually show up.
// Left as text, these render as literal "&amp;" on the page.
const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&nbsp;": " ",
  "&#38;": "&",
  "&#39;": "'",
};

export function clean(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;|&#\d+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

async function crossref(path, params) {
  const url = new URL(`https://api.crossref.org${path}`);
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);
  url.searchParams.set("mailto", MAILTO);

  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Crossref ${res.status} for ${url.pathname}`);
  return (await res.json()).message;
}

// Crossref splits authors into given/family and *preserves submission order*,
// which is the whole point — author order is meaning in this field. Some records
// carry consortium entries with only `name`, so fall back to that.
function authorsOf(work) {
  return (work.author ?? []).map((a) =>
    clean(a.name ?? [a.given, a.family].filter(Boolean).join(" ")),
  );
}

// `published` covers print and online; `issued` is the older field some records
// still use. Take whichever exists — date-parts is [[year, month, day]].
function dateOf(work) {
  const parts =
    work.published?.["date-parts"]?.[0] ?? work.issued?.["date-parts"]?.[0] ?? [];
  return { year: parts[0] ?? null, month: parts[1] ?? null };
}

export function normalize(work) {
  const { year, month } = dateOf(work);
  return {
    doi: work.DOI ?? null,
    title: clean(work.title?.[0] ?? ""),
    authors: authorsOf(work),
    journal: clean(work["container-title"]?.[0] ?? ""),
    volume: clean(work.volume ?? "") || null,
    issue: clean(work.issue ?? "") || null,
    pages: clean(work.page ?? "") || null,
    year,
    month,
    type: work.type ?? null,
    url: work.URL ?? (work.DOI ? `https://doi.org/${work.DOI}` : null),
  };
}

// DOIs copied out of publisher links arrive with cruft glued on. Produce the
// plausible candidates longest-first — a DOI suffix may legitimately contain
// slashes, so trimming path segments is a guess that has to be verified by
// actually resolving, not assumed.
export function doiCandidates(input) {
  const bare = String(input)
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/[.,;]+$/, "");
  const trimmed = bare.split(/[?#]/)[0];

  const out = [];
  const push = (d) => {
    if (d && /^10\.\d{4,}\/.+/.test(d) && !out.includes(d)) out.push(d);
  };
  push(trimmed);
  const parts = trimmed.split("/");
  for (let end = parts.length - 1; end >= 2; end--) push(parts.slice(0, end).join("/"));
  return out;
}

export async function workByDoi(doi) {
  const candidates = doiCandidates(doi);
  if (!candidates.length) throw new Error(`"${doi}" is not a DOI`);

  let last;
  for (const candidate of candidates) {
    try {
      return await crossref(`/works/${encodeURIComponent(candidate)}`);
    } catch (err) {
      last = err;
    }
  }
  throw last;
}

export async function byDoi(doi) {
  return normalize(await workByDoi(doi));
}

// Fallback for the papers with no DOI in the .bib. Crossref's relevance score
// is unbounded, so it is only meaningful next to the returned title — callers
// must confirm the match rather than trust the number alone.
export async function byTitle(title, journal) {
  const msg = await crossref("/works", {
    "query.bibliographic": [title, journal].filter(Boolean).join(" "),
    filter: "type:journal-article",
    rows: "3",
  });
  const items = msg.items ?? [];
  if (!items.length) return null;

  const key = (s) => (s ?? "").toLowerCase().replace(/\W+/g, "");
  const hit = items.find((i) => key(i.title?.[0]) === key(title)) ?? items[0];
  return { ...normalize(hit), matchScore: Math.round(hit.score ?? 0) };
}

// Fields the site owns and Crossref must never clobber.
export const OWNED_FIELDS = ["pdf", "code", "note", "venue", "displayYear"];

export function mergeRecord(existing, fetched) {
  const merged = { ...fetched };
  for (const field of OWNED_FIELDS) {
    merged[field] = existing?.[field] ?? null;
  }
  return merged;
}

// Dice coefficient over character bigrams — enough to tell a plural/singular
// typo apart from two genuinely different papers, without pulling in a
// dependency. Crossref's own relevance score cannot do this.
export function titleSimilarity(a, b) {
  const norm = (s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const bigrams = (s) => {
    const out = new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      out.set(g, (out.get(g) ?? 0) + 1);
    }
    return out;
  };

  const [x, y] = [norm(a), norm(b)];
  if (!x || !y) return 0;
  if (x === y) return 1;

  const [gx, gy] = [bigrams(x), bigrams(y)];
  let shared = 0;
  for (const [g, n] of gx) shared += Math.min(n, gy.get(g) ?? 0);
  const total = [...gx.values()].reduce((s, n) => s + n, 0) +
    [...gy.values()].reduce((s, n) => s + n, 0);
  return (2 * shared) / total;
}

// Newest first, stable for papers sharing a month so the file does not churn
// between runs.
export function sortRecords(records) {
  return [...records].sort(
    (a, b) =>
      ((b.displayYear ?? b.year) ?? 0) - ((a.displayYear ?? a.year) ?? 0) ||
      (b.month ?? 0) - (a.month ?? 0) ||
      (a.title ?? "").localeCompare(b.title ?? ""),
  );
}
