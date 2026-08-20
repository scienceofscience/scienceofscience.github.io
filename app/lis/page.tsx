import type { Metadata } from "next";
import LisList from "@/components/LisList";
import { getLisPeople } from "@/lib/lisPeople";

export const metadata: Metadata = {
  title: "LIS",
  description:
    "The people who connect Library and Information Science to the science of science and science and technology studies.",
};

export default function LisPage() {
  const people = getLisPeople();

  return (
    <div className="pt-6 sm:pt-10">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Library and Information Science
      </h1>
      <div className="max-w-3xl">
        <p className="text-muted mt-6 leading-relaxed">
          Science of science and science and technology studies both draw on Library and
          Information Science. Someone counts as an LIS person below if they studied the field,
          worked in it professionally, or were recognized by the field itself — through an award,
          an editorship, or a venue that belongs to LIS.
        </p>
        <div className="border-border mt-8 border-t" />
        <LisList people={people} />
      </div>
    </div>
  );
}
