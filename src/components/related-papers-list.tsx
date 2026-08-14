"use client";

import { useCallback, useState } from "react";
import { BookOpenText, ChevronDown, ExternalLink } from "lucide-react";
import { CitationDialog } from "@/components/citation-dialog";
import { PublicationLinksDialog } from "@/components/publication-links-dialog";
import { peerReviewedPapers, type PeerReviewedPaper } from "@/data/peer-reviewed-papers";
import { getAbstractPreview, getAuthorPreview } from "@/lib/publication-preview";

const publicationStatus = {
  published: {
    label: "Journal Article",
    className: "border-[#147d79]/25 bg-[#147d79]/10 text-[#116d69]",
  },
  forthcoming: {
    label: "Forthcoming",
    className: "border-[#b94f35]/25 bg-[#b94f35]/10 text-[#9c3e28]",
  },
} as const;

export function RelatedPapersList() {
  const [citationPaper, setCitationPaper] = useState<PeerReviewedPaper | null>(null);
  const [publicationLinksPaper, setPublicationLinksPaper] = useState<PeerReviewedPaper | null>(null);
  const [expandedAuthorIds, setExpandedAuthorIds] = useState<Set<string>>(() => new Set());
  const [expandedAbstractIds, setExpandedAbstractIds] = useState<Set<string>>(() => new Set());
  const closeCitation = useCallback(() => setCitationPaper(null), []);
  const closePublicationLinks = useCallback(() => setPublicationLinksPaper(null), []);
  const toggleAuthorList = useCallback((paperId: string) => {
    setExpandedAuthorIds((current) => {
      const next = new Set(current);

      if (next.has(paperId)) {
        next.delete(paperId);
      } else {
        next.add(paperId);
      }

      return next;
    });
  }, []);
  const toggleAbstract = useCallback((paperId: string) => {
    setExpandedAbstractIds((current) => {
      const next = new Set(current);

      if (next.has(paperId)) {
        next.delete(paperId);
      } else {
        next.add(paperId);
      }

      return next;
    });
  }, []);

  return (
    <>
      <ol className="grid gap-5" aria-label="Study publications">
        {peerReviewedPapers.map((paper, index) => {
          const status = publicationStatus[paper.status];
          const authorPreview = getAuthorPreview(paper.authors);
          const abstractPreview = getAbstractPreview(paper.abstract);
          const authorListOpen = expandedAuthorIds.has(paper.id);
          const abstractOpen = expandedAbstractIds.has(paper.id);
          const hasAuthors = paper.authors.length > 0;
          const hasAbstract = paper.abstract.trim().length > 0;
          const abstractIsTruncated = abstractPreview.length < paper.abstract.length;
          const displayedAuthors = authorListOpen ? paper.authors : authorPreview;
          const abstractRemainder = paper.abstract.slice(abstractPreview.length);

          return (
            <li key={paper.id}>
              <article className="overflow-hidden rounded-[1.75rem] border border-[#14213d]/14 bg-[#fffdf8] shadow-[0_12px_36px_rgba(20,33,61,0.05)]">
                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[max-content_minmax(0,1fr)] lg:p-8">
                  <div data-paper-marker={paper.id} className="flex flex-col items-start gap-2 self-start lg:pr-4">
                    <span className="font-editorial text-4xl leading-none text-[#147d79]" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      data-publication-status={paper.status}
                      className={`inline-flex min-h-6 items-center rounded-full border px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.1em] whitespace-nowrap uppercase ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-[#b94f35] uppercase">
                      {paper.studyLabel}
                    </p>
                    <h2 className="mt-2.5 max-w-5xl text-[clamp(1.65rem,3vw,2.65rem)] leading-[1.06] tracking-[-0.03em] text-balance">
                      {paper.title}
                    </h2>

                    <dl className="mt-5 grid gap-4 border-y border-[#14213d]/12 py-5">
                      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:gap-5">
                        <dt className="text-[0.6875rem] font-bold tracking-[0.12em] text-[#52606d] uppercase">Authors</dt>
                        <dd className="text-[0.9375rem] leading-6 text-[#35435b]">
                          {hasAuthors ? (
                            <p>
                              <span id={`authors-${paper.id}`} data-author-display={paper.id}>
                                {displayedAuthors.join(", ")}
                              </span>
                              <button
                                type="button"
                                aria-expanded={authorListOpen}
                                aria-controls={`authors-${paper.id}`}
                                aria-label={`${authorListOpen ? "Hide" : "Show"} full author list for ${paper.title}`}
                                onClick={() => toggleAuthorList(paper.id)}
                                className="ml-2 inline-grid size-7 shrink-0 place-items-center rounded-full border border-[#14213d]/20 bg-white align-middle text-lg leading-none font-semibold text-[#14213d] transition-colors hover:border-[#147d79]/55 hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                              >
                                {authorListOpen ? "−" : "+"}
                              </button>
                            </p>
                          ) : (
                            <p data-author-placeholder={paper.id}>Author information forthcoming.</p>
                          )}
                        </dd>
                      </div>
                      <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)] md:gap-5">
                        <dt className="text-[0.6875rem] font-bold tracking-[0.12em] text-[#52606d] uppercase">
                          Publication
                        </dt>
                        <dd className="text-[0.9375rem] leading-6 font-semibold text-[#263550]">
                          {paper.status === "published"
                            ? `${paper.journal} · ${paper.year}`
                            : paper.journal
                              ? `${paper.journal} · Forthcoming`
                              : "Forthcoming"}
                        </dd>
                      </div>
                    </dl>

                    <div className="border-b border-[#14213d]/12 py-4">
                      <h3 className="text-base font-bold text-[#14213d]">Abstract</h3>
                      {hasAbstract ? (
                        <p data-abstract-display={paper.id} className="mt-2.5 max-w-5xl text-[0.9375rem] leading-7 text-[#35435b]">
                          <span id={`abstract-${paper.id}`}>
                            <span data-abstract-preview={paper.id}>{abstractPreview}</span>
                            {abstractOpen ? (
                              <span data-abstract-remainder={paper.id}>{abstractRemainder}</span>
                            ) : abstractIsTruncated ? (
                              <span data-abstract-ellipsis={paper.id} aria-hidden="true">
                                …
                              </span>
                            ) : null}
                          </span>
                          {abstractOpen ? (
                            <button
                              type="button"
                              aria-expanded="true"
                              aria-controls={`abstract-${paper.id}`}
                              aria-label={`Collapse full abstract for ${paper.title}`}
                              onClick={() => toggleAbstract(paper.id)}
                              className="ml-2 inline-grid size-7 shrink-0 place-items-center rounded-full border border-[#14213d]/20 bg-white align-middle text-lg leading-none font-semibold text-[#14213d] transition-colors hover:border-[#147d79]/55 hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                            >
                              −
                            </button>
                          ) : null}
                        </p>
                      ) : (
                        <p data-abstract-placeholder={paper.id} className="mt-2.5 text-[0.9375rem] leading-7 text-[#35435b]">
                          Abstract information forthcoming.
                        </p>
                      )}
                      {hasAbstract && !abstractOpen && abstractIsTruncated ? (
                        <button
                          type="button"
                          aria-expanded="false"
                          aria-controls={`abstract-${paper.id}`}
                          aria-label={`Read full abstract for ${paper.title}`}
                          onClick={() => toggleAbstract(paper.id)}
                          className="mt-2.5 inline-flex min-h-9 items-center gap-2 rounded-md text-sm font-bold text-[#14213d] transition-colors hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                        >
                          Read full abstract
                          <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {paper.publicationLinks.length === 1 ? (
                        <a
                          href={paper.publicationLinks[0].url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#14213d] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#147d79]"
                        >
                          View publication
                          <ExternalLink aria-hidden="true" className="size-4" />
                        </a>
                      ) : paper.publicationLinks.length > 1 ? (
                        <button
                          type="button"
                          aria-haspopup="dialog"
                          aria-label={`View publication options for ${paper.title}`}
                          onClick={() => setPublicationLinksPaper(paper)}
                          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#14213d] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                        >
                          View publication
                          <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
                        </button>
                      ) : (
                        <p data-publication-placeholder={paper.id} className="text-sm font-semibold text-[#52606d]">
                          Publication link forthcoming.
                        </p>
                      )}
                      {paper.citation ? (
                        <button
                          type="button"
                          onClick={() => setCitationPaper(paper)}
                          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#14213d]/22 bg-white px-5 py-2.5 text-sm font-bold text-[#14213d] transition-colors hover:border-[#147d79]/55 hover:text-[#147d79]"
                        >
                          Cite this paper
                          <span className="sr-only">: {paper.title}</span>
                          <BookOpenText aria-hidden="true" className="size-4" />
                        </button>
                      ) : (
                        <p data-citation-placeholder={paper.id} className="text-sm font-semibold text-[#52606d]">
                          Citation information forthcoming.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      <PublicationLinksDialog paper={publicationLinksPaper} onClose={closePublicationLinks} />
      <CitationDialog paper={citationPaper} onClose={closeCitation} />
    </>
  );
}
