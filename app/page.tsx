import Link from "next/link";
import { getPublications } from "@/lib/publications";
import RecentPublications from "@/components/RecentPublications";
import CenterLogo from "@/components/CenterLogo";
import HistoryTimeline from "@/components/HistoryTimeline";

export default function HomePage() {
  const recent = getPublications().slice(0, 5);

  return (
    <div className="pt-6 sm:pt-10">
      <div className="max-w-3xl">
        <CenterLogo />

        <div className="border-border mt-8 border-t pt-8">
          <HistoryTimeline />
        </div>

        <div className="border-border mt-8 border-t pt-8">
          <h2>
            <Link
              href="/publications/"
              className="hover:text-accent text-2xl font-semibold transition-colors"
            >
              Latest publications
            </Link>
          </h2>
          <RecentPublications publications={recent} />
        </div>
      </div>
    </div>
  );
}
