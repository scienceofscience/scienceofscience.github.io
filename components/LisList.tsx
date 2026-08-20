import type { LisCriterion, LisPerson } from "@/lib/lisPeople";

const CRITERION_LABEL: Record<LisCriterion, string> = {
  studied: "LIS Education",
  worked: "LIS Practice",
  recognized: "LIS Recognition",
};

export default function LisList({ people }: { people: LisPerson[] }) {
  return (
    <ol className="divide-border divide-y">
      {people.map((p) => (
        <li key={p.year} className="py-8 first:pt-0">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-accent text-lg font-semibold">{p.year}</span>
            <h2 className="text-xl font-medium">{p.title}</h2>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.criteria.map((c) => (
              <span
                key={c}
                className="border-border text-muted rounded-full border px-2.5 py-0.5 text-xs"
              >
                {CRITERION_LABEL[c]}
              </span>
            ))}
          </div>
          <p className="text-muted mt-3 leading-relaxed">{p.description}</p>
          {p.detail && <p className="text-muted mt-2 leading-relaxed">{p.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
