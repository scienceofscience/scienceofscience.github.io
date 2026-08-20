import type { Metadata } from "next";
import MarkdownPage from "@/components/MarkdownPage";
import { readMarkdown } from "@/lib/markdown";

export const metadata: Metadata = { title: "Doctoral Dissertation Fellowship" };

export default function DoctoralFellowshipPage() {
  const { meta, body } = readMarkdown("scisquare/doctoral-dissertation-fellowship");
  return <MarkdownPage title={meta.title ?? "Doctoral Dissertation Fellowship"} body={body} />;
}
