import type { Metadata } from "next";
import PublicationsExplorer from "@/components/PublicationsExplorer";
import { getPublicationsByYear } from "@/lib/publications";

export const metadata: Metadata = { title: "Publications" };

export default function PublicationsPage() {
  const groups = getPublicationsByYear();

  return (
    <div className="pt-6 sm:pt-10">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Publications</h1>
      <div className="border-border mt-8 max-w-3xl border-b" />
      <div className="max-w-3xl">
        <PublicationsExplorer groups={groups} />
      </div>
    </div>
  );
}
