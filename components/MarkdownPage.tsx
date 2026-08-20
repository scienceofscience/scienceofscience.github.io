import ReactMarkdown from "react-markdown";

/** Shared rendering for the static Sci Square pages — plain markdown prose,
 *  no photo, no data model beyond the file itself. */
export default function MarkdownPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-3xl pt-6 sm:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-8">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="text-muted mt-4 leading-relaxed first:mt-0">{children}</p>
            ),
            strong: ({ children }) => <strong className="text-foreground font-medium">{children}</strong>,
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
