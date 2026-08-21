import Link from "next/link";
import { getHomepageLisPerson } from "@/lib/lisPeople";

// Homepage keeps only the one name recognizable outside LIS/bibliometrics
// circles — the fuller roster (with the reasoning for including each
// person) lives on /lis, linked below rather than repeated here.
export default function LisSpotlight() {
  const person = getHomepageLisPerson();
  if (!person) return null;

  return (
    <div>
      <p className="text-muted leading-relaxed">
        Science of science and science and technology studies draw on many fields —{" "}
        <strong className="text-foreground font-medium">Library and Information Science</strong>{" "}
        among them. For example:
      </p>

      <div className="border-border mt-6 border-l-2 pl-4">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-accent text-lg font-semibold">{person.year}</span>
          <span className="font-medium">{person.title}</span>
        </div>
        <p className="text-muted mt-1 leading-relaxed">{person.description}</p>
      </div>

      <Link href="/lis/" className="text-accent mt-4 inline-block text-sm hover:underline">
        More on the field&apos;s connection to Library and Information Science →
      </Link>
    </div>
  );
}
