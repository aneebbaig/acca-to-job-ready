import { ExternalLink, ShieldAlert } from "lucide-react";
import type { CheatsheetBlock } from "@/curriculum/types";

// Renders a topic cheatsheet. Uses native <details> so sections are collapsible
// and print-friendly without client JS (§9). `verify` blocks never assert a
// figure, they link to the official source (§3.2).
export function Cheatsheet({ blocks }: { blocks: CheatsheetBlock[] }) {
  return (
    <div className="space-y-3 print:space-y-2">
      {blocks.map((block, i) => (
        <details
          key={i}
          // Progressive disclosure: open the first block, collapse the rest so
          // the page isn't a wall of text.
          open={i === 0}
          className="group border-border/70 rounded-lg border bg-card"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium">
            <span className="flex items-center gap-2">
              {block.kind === "verify" && (
                <ShieldAlert className="text-amber-600 size-4" aria-hidden />
              )}
              {block.heading}
            </span>
            <span className="text-muted-foreground text-xs transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="px-4 pb-4 text-sm">
            <BlockBody block={block} />
          </div>
        </details>
      ))}
    </div>
  );
}

function BlockBody({ block }: { block: CheatsheetBlock }) {
  switch (block.kind) {
    case "points":
      return (
        <ul className="text-muted-foreground list-disc space-y-1.5 pl-5">
          {block.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      );
    case "terms":
      return (
        <dl className="space-y-2">
          {block.terms.map((t, i) => (
            <div key={i} className="grid grid-cols-1 gap-0.5 sm:grid-cols-[10rem_1fr] sm:gap-3">
              <dt className="font-medium">{t.term}</dt>
              <dd className="text-muted-foreground">{t.def}</dd>
            </div>
          ))}
        </dl>
      );
    case "formula":
      return (
        <div className="space-y-3">
          {block.formulas.map((f, i) => (
            <div key={i}>
              <p className="font-medium">{f.name}</p>
              <p className="bg-muted text-foreground my-1 rounded-md px-2 py-1 font-mono text-[0.8rem]">
                {f.expr}
              </p>
              <p className="text-muted-foreground">{f.means}</p>
            </div>
          ))}
        </div>
      );
    case "verify":
      return (
        <div className="space-y-2">
          <p className="text-muted-foreground">{block.note}</p>
          <a
            href={block.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
          >
            {block.link.label}
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      );
  }
}
