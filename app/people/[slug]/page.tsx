import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { asset } from "@/lib/assets";
import { readMarkdown } from "@/lib/markdown";
import people from "@/data/people.json";
import type { Person } from "@/components/PeopleExplorer";

export function generateStaticParams() {
  return (people as Person[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = (people as Person[]).find((p) => p.slug === slug);
  return { title: person?.name ?? "Person" };
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = (people as Person[]).find((p) => p.slug === slug);
  if (!person) return null;

  const { body } = readMarkdown(`people/${person.slug}`);

  return (
    <div className="max-w-3xl pt-6 sm:pt-10">
      <div className="sm:float-right sm:ml-8 sm:w-48">
        {person.photo && (
          <Image
            src={asset(person.photo)}
            alt=""
            width={240}
            height={240}
            className="aspect-square w-full rounded-lg object-cover"
          />
        )}
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">{person.name}</h1>
      <p className="text-muted mt-1">{person.title}</p>

      <div className="mt-8">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="text-muted mt-4 leading-relaxed first:mt-0">{children}</p>
            ),
            ol: ({ children }) => (
              <ol className="text-muted mt-4 list-decimal space-y-2 pl-5 leading-relaxed">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="pl-1">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2"
              >
                {children}
              </a>
            ),
          }}
        >
          {body}
        </ReactMarkdown>
      </div>

      <Link
        href="/people/"
        className="border-border mt-10 inline-block rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-black/[.04]"
      >
        All people
      </Link>
    </div>
  );
}
