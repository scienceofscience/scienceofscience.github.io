import type { Metadata } from "next";
import PeopleExplorer, { type Person } from "@/components/PeopleExplorer";
import people from "@/data/people.json";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  const sorted = [...(people as Person[])].sort((a, b) => a.order - b.order);

  return (
    <div className="pt-6 sm:pt-10">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">People</h1>
      <div className="border-border mt-8 max-w-3xl border-b" />
      <div className="max-w-3xl">
        <PeopleExplorer people={sorted} />
      </div>
    </div>
  );
}
