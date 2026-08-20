import type { Metadata } from "next";
import MarkdownPage from "@/components/MarkdownPage";
import { readMarkdown } from "@/lib/markdown";

export const metadata: Metadata = { title: "Sci Square" };

export default function SciSquarePage() {
  const { meta, body } = readMarkdown("scisquare/intro");
  return <MarkdownPage title={meta.title ?? "Sci Square"} body={body} />;
}
