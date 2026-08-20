import type { Metadata } from "next";
import MarkdownPage from "@/components/MarkdownPage";
import { readMarkdown } from "@/lib/markdown";

export const metadata: Metadata = { title: "Distinguished Fellowship" };

export default function DistinguishedFellowshipPage() {
  const { meta, body } = readMarkdown("scisquare/distinguished-fellowship");
  return <MarkdownPage title={meta.title ?? "Distinguished Fellowship"} body={body} />;
}
