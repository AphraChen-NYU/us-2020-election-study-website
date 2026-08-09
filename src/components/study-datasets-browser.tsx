"use client";

import { useCallback, useMemo, useState } from "react";
import { BookOpenText, ChevronDown, ExternalLink, RotateCcw, X } from "lucide-react";
import { DatasetCitationDialog } from "@/components/dataset-citation-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  studyDatasetGroups,
  type StudyDataset,
} from "@/data/study-datasets";
import { getDatasetSummaryPreview } from "@/lib/publication-preview";

const statusStyles = {
  published: {
    label: "Journal Article",
    className: "border-[#147d79]/25 bg-[#147d79]/10 text-[#116d69]",
  },
  forthcoming: {
    label: "Forthcoming",
    className: "border-[#b94f35]/25 bg-[#b94f35]/10 text-[#9c3e28]",
  },
} as const;

export function StudyDatasetsBrowser() {
  const [citationDataset, setCitationDataset] = useState<StudyDataset | null>(null);
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [paperMenuOpen, setPaperMenuOpen] = useState(false);
  const [expandedSummaryIds, setExpandedSummaryIds] = useState<Set<string>>(() => new Set());
  const closeCitation = useCallback(() => setCitationDataset(null), []);
  const filteredGroups = useMemo(
    () =>
      selectedPaperIds.length
        ? studyDatasetGroups.filter((group) => selectedPaperIds.includes(group.id))
        : studyDatasetGroups,
    [selectedPaperIds],
  );
  const toggleSummary = useCallback((associationId: string) => {
    setExpandedSummaryIds((current) => {
      const next = new Set(current);

      if (next.has(associationId)) {
        next.delete(associationId);
      } else {
        next.add(associationId);
      }

      return next;
    });
  }, []);

  function togglePaper(paperId: string) {
    setSelectedPaperIds((current) =>
      current.includes(paperId)
        ? current.filter((id) => id !== paperId)
        : [...current, paperId],
    );
  }

  return (
    <>
      <div className="mb-8 border-y border-[#14213d]/12 py-5" data-dataset-filter>
        <div className="flex flex-wrap items-center gap-2.5" role="group" aria-labelledby="dataset-filter-label">
          <span id="dataset-filter-label" className="mr-1 text-sm font-bold tracking-[0.08em] text-[#52606d] uppercase">
            Search by
          </span>
          <details open={paperMenuOpen} className="group/paper-filter relative" data-dataset-paper-filter>
            <summary
              onClick={(event) => {
                event.preventDefault();
                setPaperMenuOpen((open) => !open);
              }}
              className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-[#14213d]/16 bg-white px-4 py-2 text-sm font-bold text-[#35435b] transition-colors hover:border-[#147d79]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
            >
              Paper
              {selectedPaperIds.length ? (
                <span className="rounded-full bg-[#147d79] px-2 py-0.5 text-[0.68rem] text-white">
                  {selectedPaperIds.length}
                </span>
              ) : null}
              <ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-open/paper-filter:rotate-180" />
            </summary>
            <div className="relative z-40 mt-2 w-[min(420px,calc(100vw-2.5rem))] rounded-2xl border border-[#14213d]/14 bg-white p-3 shadow-[0_18px_55px_rgba(20,33,61,0.16)] sm:absolute sm:left-0">
              <fieldset>
                <legend className="sr-only">Filter datasets by paper</legend>
                <div className="max-h-[min(30rem,70vh)] overflow-y-auto pr-1" data-dataset-paper-options>
                  {studyDatasetGroups.map((group) => (
                    <label
                      key={group.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 text-sm leading-5 text-[#35435b] hover:bg-[#f7f4ed]"
                    >
                      <input
                        type="checkbox"
                        value={group.id}
                        checked={selectedPaperIds.includes(group.id)}
                        onChange={() => togglePaper(group.id)}
                        className="mt-0.5 size-4 accent-[#147d79]"
                      />
                      <span>{group.filterLabel}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </details>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!selectedPaperIds.length}
            onClick={() => {
              setPaperMenuOpen(false);
              setSelectedPaperIds([]);
            }}
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Clear all filters
          </Button>
        </div>

        <p className="mt-4 text-sm text-[#52606d]" aria-live="polite">
          Showing <strong className="text-[#14213d]">{filteredGroups.length}</strong> of{" "}
          <strong className="text-[#14213d]">{studyDatasetGroups.length}</strong> papers
        </p>

        {selectedPaperIds.length ? (
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Active paper filters">
            {selectedPaperIds.map((paperId) => {
              const group = studyDatasetGroups.find(({ id }) => id === paperId);

              return (
                <button
                  key={paperId}
                  type="button"
                  onClick={() => togglePaper(paperId)}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#147d79]/25 bg-[#eaf5f3] px-3 py-1.5 text-xs font-semibold text-[#125f5c] hover:border-[#147d79]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                >
                  <span className="truncate">{group?.filterLabel}</span>
                  <X aria-hidden="true" className="size-3" />
                  <span className="sr-only">Remove filter</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <Accordion type="multiple" role="region" className="grid gap-4" aria-label="Study datasets by paper">
        {filteredGroups.map((group) => {
          const status = statusStyles[group.status];
          const datasetCount = group.datasets.length;
          const groupNumber = studyDatasetGroups.findIndex(({ id }) => id === group.id) + 1;

          return (
            <AccordionItem
              key={group.id}
              value={group.id}
              data-dataset-group={group.id}
              className="overflow-hidden rounded-[1.5rem] border border-[#14213d]/14 bg-[#fffdf8] shadow-[0_10px_30px_rgba(20,33,61,0.045)]"
            >
              <AccordionTrigger className="px-5 py-5 hover:no-underline sm:px-6 lg:px-8 lg:py-6">
                <span className="flex min-w-0 flex-1 flex-col items-start gap-4 pr-2 sm:flex-row sm:gap-5">
                  <span className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                    <span className="font-editorial text-3xl leading-none text-[#147d79]" aria-hidden="true">
                      {String(groupNumber).padStart(2, "0")}
                    </span>
                    <span
                      className={`inline-flex min-h-6 items-center rounded-full border px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.09em] whitespace-nowrap uppercase ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.6875rem] font-bold tracking-[0.15em] text-[#b94f35] uppercase">
                      {group.studyLabel}
                    </span>
                    <span className="mt-1.5 block font-editorial text-xl leading-tight tracking-[-0.02em] text-[#14213d] sm:text-2xl">
                      {group.title}
                    </span>
                    <span className="mt-2 block text-sm font-semibold text-[#52606d]">
                      {datasetCount} {datasetCount === 1 ? "dataset" : "datasets"}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                {datasetCount ? (
                  <table
                    className="block w-full border-separate border-spacing-0 md:table"
                    aria-label={`Datasets linked to ${group.studyLabel}`}
                  >
                    <thead className="hidden md:table-header-group">
                      <tr className="text-left">
                        <th className="w-[32%] border-y border-[#14213d]/14 bg-[#14213d] px-4 py-3 text-xs font-bold tracking-[0.1em] text-white uppercase">
                          Dataset
                        </th>
                        <th className="w-[50%] border-y border-[#14213d]/14 bg-[#14213d] px-4 py-3 text-xs font-bold tracking-[0.1em] text-white uppercase">
                          Summary
                        </th>
                        <th className="w-[18%] border-y border-[#14213d]/14 bg-[#14213d] px-4 py-3 text-xs font-bold tracking-[0.1em] text-white uppercase">
                          Dataset link and citation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="block space-y-4 md:table-row-group md:space-y-0">
                      {group.datasets.map((dataset) => {
                        const associationId = `${group.id}-${dataset.id}`;
                        const summaryPreview = getDatasetSummaryPreview(dataset.summary);
                        const summaryOpen = expandedSummaryIds.has(associationId);
                        const summaryIsTruncated = summaryPreview.length < dataset.summary.length;
                        const summaryRemainder = dataset.summary.slice(summaryPreview.length);

                        return (
                          <tr
                            key={dataset.id}
                            data-dataset-row={dataset.id}
                            data-dataset-association={associationId}
                            className="block rounded-2xl border border-[#14213d]/12 bg-white p-4 md:table-row md:rounded-none md:border-0 md:bg-transparent md:p-0"
                          >
                          <td className="block align-top md:table-cell md:border-b md:border-[#14213d]/12 md:px-4 md:py-5">
                            <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.1em] text-[#52606d] uppercase md:hidden">
                              Dataset
                            </span>
                            <span className="text-sm leading-6 font-bold text-[#14213d]">{dataset.name}</span>
                          </td>
                          <td className="mt-4 block align-top md:mt-0 md:table-cell md:border-b md:border-[#14213d]/12 md:px-4 md:py-5">
                            <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.1em] text-[#52606d] uppercase md:hidden">
                              Summary
                            </span>
                            <p
                              className="text-sm leading-6 text-[#35435b]"
                              data-summary-display={associationId}
                            >
                              <span id={`summary-${associationId}`}>
                                <span data-summary-preview={associationId}>{summaryPreview}</span>
                                {summaryOpen ? (
                                  <span data-summary-remainder={associationId}>{summaryRemainder}</span>
                                ) : summaryIsTruncated ? (
                                  <span data-summary-ellipsis={associationId} aria-hidden="true">
                                    …
                                  </span>
                                ) : null}
                              </span>
                              {summaryOpen ? (
                                <button
                                  type="button"
                                  aria-expanded="true"
                                  aria-controls={`summary-${associationId}`}
                                  aria-label={`Collapse full summary for ${dataset.name} in ${group.studyLabel}`}
                                  onClick={() => toggleSummary(associationId)}
                                  className="ml-2 inline-grid size-7 shrink-0 place-items-center rounded-full border border-[#14213d]/20 bg-white align-middle text-lg leading-none font-semibold text-[#14213d] transition-colors hover:border-[#147d79]/55 hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                                >
                                  −
                                </button>
                              ) : null}
                            </p>
                            {!summaryOpen && summaryIsTruncated ? (
                              <button
                                type="button"
                                aria-expanded="false"
                                aria-controls={`summary-${associationId}`}
                                aria-label={`Read full summary for ${dataset.name} in ${group.studyLabel}`}
                                onClick={() => toggleSummary(associationId)}
                                className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-md text-xs font-bold text-[#14213d] transition-colors hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                              >
                                Read full summary
                                <ChevronDown aria-hidden="true" className="size-3.5 shrink-0" />
                              </button>
                            ) : null}
                          </td>
                          <td className="mt-4 block align-top md:mt-0 md:table-cell md:border-b md:border-[#14213d]/12 md:px-4 md:py-5">
                            <span className="mb-2 block text-[0.625rem] font-bold tracking-[0.1em] text-[#52606d] uppercase md:hidden">
                              Dataset link and citation
                            </span>
                            <div className="flex flex-col items-start gap-2" data-dataset-actions>
                              <a
                                href={dataset.url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`View dataset: ${dataset.name}`}
                                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#14213d] px-4 py-2 text-xs font-bold whitespace-nowrap text-white transition-colors hover:bg-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                              >
                                View dataset
                                <ExternalLink aria-hidden="true" className="size-3.5" />
                              </a>
                              <button
                                type="button"
                                aria-haspopup="dialog"
                                aria-label={`Cite dataset: ${dataset.name}`}
                                onClick={() => setCitationDataset(dataset)}
                                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#14213d]/22 bg-white px-4 py-2 text-xs font-bold whitespace-nowrap text-[#14213d] transition-colors hover:border-[#147d79]/55 hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                              >
                                Cite dataset
                                <BookOpenText aria-hidden="true" className="size-3.5" />
                              </button>
                            </div>
                          </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div
                    data-empty-dataset-group={group.id}
                    className="border-l-2 border-[#b94f35] bg-[#14213d]/[0.035] px-5 py-5 text-sm leading-6 font-semibold text-[#52606d]"
                  >
                    Dataset information forthcoming.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <DatasetCitationDialog dataset={citationDataset} onClose={closeCitation} />
    </>
  );
}
