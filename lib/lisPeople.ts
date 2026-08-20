import lisPeopleData from "@/data/lis-people.json";

// Which of the three criteria (see /lis) qualifies someone as an "LIS
// person" — studied the field, worked in it, or was recognized by it (an
// award, editorship, or publication venue that belongs to the field
// itself). Entries can satisfy more than one.
export type LisCriterion = "studied" | "worked" | "recognized";

export type LisPerson = {
  year: number;
  title: string;
  criteria: LisCriterion[];
  /** Shown on the homepage spotlight — reserved for names recognizable
   *  outside LIS/bibliometrics circles, not everyone on the full roster. */
  homepage: boolean;
  description: string;
  detail: string | null;
};

export function getLisPeople(): LisPerson[] {
  return [...(lisPeopleData as LisPerson[])].sort((a, b) => a.year - b.year);
}

export function getHomepageLisPerson(): LisPerson | null {
  return getLisPeople().find((p) => p.homepage) ?? null;
}
