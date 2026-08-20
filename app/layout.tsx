import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { googleSansFlex } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sci.yonsei.ac.kr"),
  title: {
    default: "Center for Science and Technology Studies",
    template: "%s · Center for Science and Technology Studies",
  },
  description:
    "The Center for Science and Technology Studies at Yonsei University is the first university research center in South Korea dedicated to the study of science and technology from an interdisciplinary perspective.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${googleSansFlex.variable}`}>
      <body className="flex min-h-full flex-col">
        <SiteNav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-20">{children}</main>
        <footer className="border-border text-muted mx-auto w-full max-w-5xl border-t px-6 py-6 text-center text-sm">
          © Copyright {new Date().getFullYear()} Center for Science and Technology Studies at
          Yonsei University.
        </footer>
      </body>
    </html>
  );
}
