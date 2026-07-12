"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { categoryMeta, type OutcomeRow, type OutcomeTable } from "@/data/outcome-measures";
import { parseSourceEntries } from "@/lib/outcome-summary";

interface RecordDetailModalProps {
  record: { table: OutcomeTable; row: OutcomeRow } | null;
  onClose: () => void;
}

function FullField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.68rem] font-bold tracking-[0.14em] text-[#b94f35] uppercase">{label}</dt>
      <dd className="mt-2 whitespace-pre-line text-sm leading-7 text-[#35435b] sm:text-base">
        {value.trim() || <span aria-label="Not specified in source">—</span>}
      </dd>
    </div>
  );
}

export function RecordDetailModal({ record, onClose }: RecordDetailModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!record) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("hidden"));
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [record, onClose]);

  if (!record) return null;

  const { table, row } = record;
  const sources = parseSourceEntries(row.pages);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex bg-[#0b1326]/72 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full flex-col overflow-hidden bg-[#fffdf8] shadow-2xl sm:max-h-[min(880px,calc(100vh-3rem))] sm:max-w-5xl sm:rounded-[2rem]"
      >
        <header className="flex items-start justify-between gap-6 border-b border-[#14213d]/12 px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-[#147d79] uppercase">
              {categoryMeta[table.category].label} · {table.number}
            </p>
            <h2 id={titleId} className="mt-2 max-w-3xl text-2xl leading-tight tracking-[-0.025em] sm:text-4xl">
              {row.paper}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#52606d]">{table.title}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close record details"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-[#14213d]/14 bg-white text-[#14213d] transition-colors hover:border-[#147d79]/45 hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9">
          <dl className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-12">
            <FullField label="Complete questions used" value={row.questionsUsed} />
            <div className="grid content-start gap-8">
              <FullField label="Waves" value={row.waves} />
              <FullField label="Complete method" value={row.method} />
            </div>
          </dl>

          <section className="mt-10 border-t border-[#14213d]/12 pt-8" aria-labelledby={`${titleId}-sources`}>
            <h3 id={`${titleId}-sources`} className="text-xs font-bold tracking-[0.14em] text-[#b94f35] uppercase">Source pages and figures</h3>
            {sources.length ? (
              <ul className="mt-4 grid gap-3">
                {sources.map((source, index) => (
                  <li key={`${source.reference}-${index}`} className="rounded-xl border border-[#14213d]/10 bg-white px-4 py-3 sm:grid sm:grid-cols-[minmax(130px,auto)_1fr] sm:items-start sm:gap-4">
                    <span className="inline-flex w-fit rounded-md bg-[#14213d]/7 px-2.5 py-1 text-sm font-bold text-[#14213d]">{source.reference}</span>
                    <p className="mt-2 text-sm leading-6 text-[#52606d] sm:mt-0">{source.description || "No description provided in the source."}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[#52606d]" aria-label="Not specified in source">—</p>
            )}
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
