import history from "@/data/history.json";

type Milestone = {
  year: number;
  title: string;
  description: string;
};

const ITEMS_PER_ROW = 2;
const ROW_HEIGHT = 280;
const MARGIN_X = 220;
const WIDTH = 1000;
// Rows are spaced ROW_HEIGHT apart, but a row's content only needs room
// below its pill, not above it — so the whole canvas is shifted up by
// everything past TOP_GAP that the original centered-in-band math would
// otherwise leave as dead space above the first pill.
const TOP_GAP = 40;
const Y_SHIFT = ROW_HEIGHT / 2 - TOP_GAP;
// The last row's longest description (Henry Small's, 6 lines) actually
// overflows its allotted half-row of space by ~37px — measured, not
// guessed — so pad enough to clear that plus a real gap before whatever
// comes after the timeline.
const BOTTOM_PAD = 90;

/** x-coordinates for a row of n items, evenly spaced with margin, always in
 *  left-to-right screen order. */
function columnXs(n: number): number[] {
  if (n === 1) return [WIDTH / 2];
  return Array.from({ length: n }, (_, i) => MARGIN_X + (i * (WIDTH - 2 * MARGIN_X)) / (n - 1));
}

export default function HistoryTimeline() {
  const milestones = history as Milestone[];
  const rows: Milestone[][] = [];
  for (let i = 0; i < milestones.length; i += ITEMS_PER_ROW) {
    rows.push(milestones.slice(i, i + ITEMS_PER_ROW));
  }

  // Each entry gets its screen x/y — row direction alternates (a
  // boustrophedon path, the way yonsei.ac.kr's own UI chronology reads), so
  // the line never has to jump back across the page.
  type Placed = Milestone & { x: number; y: number };
  const placed: Placed[] = [];
  rows.forEach((row, r) => {
    const xs = columnXs(row.length);
    const ltr = r % 2 === 0;
    const ordered = ltr ? row : [...row].reverse();
    ordered.forEach((m, i) => {
      placed.push({ ...m, x: xs[i], y: r * ROW_HEIGHT + ROW_HEIGHT / 2 - Y_SHIFT });
    });
  });

  const totalHeight = rows.length * ROW_HEIGHT - Y_SHIFT + BOTTOM_PAD;

  // The connecting path: a straight line across each row, joined by a
  // gentle S-curve at whichever edge the row ends on.
  let path = "";
  rows.forEach((row, r) => {
    const xs = columnXs(row.length);
    const y = r * ROW_HEIGHT + ROW_HEIGHT / 2 - Y_SHIFT;
    const ltr = r % 2 === 0;
    const start = ltr ? xs[0] : xs[xs.length - 1];
    const end = ltr ? xs[xs.length - 1] : xs[0];
    path += r === 0 ? `M ${start} ${y} ` : `L ${start} ${y} `;
    path += `L ${end} ${y} `;
    if (r < rows.length - 1) {
      const nextY = (r + 1) * ROW_HEIGHT + ROW_HEIGHT / 2 - Y_SHIFT;
      const mid = (y + nextY) / 2;
      path += `C ${end} ${mid}, ${end} ${mid}, ${end} ${nextY} `;
    }
  });

  return (
    <div>
      <p className="text-muted leading-relaxed">
        Science of science and science and technology studies both draw on{" "}
        <strong className="text-foreground font-medium">
          Library and Information Science
        </strong>
        &apos;s contributions to citation and indexing, through the people below.
      </p>

      {/* Desktop: the boustrophedon path. Needs real width to read as a path
          rather than a cramped zigzag, so mobile falls back to a plain
          stacked list instead of shrinking this. */}
      <div className="relative mt-10 hidden sm:block" style={{ height: totalHeight }}>
        <svg
          viewBox={`0 0 ${WIDTH} ${totalHeight}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path d={path} fill="none" stroke="#003477" strokeWidth={3} />
        </svg>
        {placed.map((m) => (
          <div
            key={m.year}
            className="absolute w-64 -translate-x-1/2"
            style={{ left: `${(m.x / WIDTH) * 100}%`, top: m.y }}
          >
            <div className="flex justify-center">
              <span className="rounded-full border-2 border-[#003477] bg-white px-3 py-1 text-sm font-semibold text-[#003477] shadow-sm">
                {m.year}
              </span>
            </div>
            <div className="mt-3 text-center">
              <div className="font-medium">{m.title}</div>
              <p className="text-muted mt-1 text-sm leading-relaxed">{m.description}</p>
            </div>
          </div>
        ))}
      </div>

      <ol className="mt-8 sm:hidden">
        {milestones.map((m) => (
          <li key={m.year} className="border-border relative border-l-2 py-1 pb-8 pl-6 last:pb-0">
            <span className="absolute top-2 -left-[9px] h-4 w-4 rounded-full border-2 border-[#003477] bg-white" />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-lg font-semibold text-[#003477]">{m.year}</span>
              <span className="font-medium">{m.title}</span>
            </div>
            <p className="text-muted mt-1 leading-relaxed">{m.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
