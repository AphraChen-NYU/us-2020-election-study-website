"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import { RecordDetailModal } from "@/components/record-detail-modal";
import { VariableFilterBar } from "@/components/variable-filter-bar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  categoryMeta,
  outcomeCategories,
  outcomeTables,
  type OutcomeCategory,
  type OutcomeRow,
  type OutcomeTable,
} from "@/data/outcome-measures";
import {
  emptyVariableFilters,
  filterOutcomeTablesWithFacets,
  type CategoryFilter,
  type VariableFilters,
} from "@/lib/filter-outcomes";
import { deriveRowSummary, type MethodTagTone } from "@/lib/outcome-summary";
import { resolveVisibleOpenTable } from "@/lib/table-accordion";
import { cn } from "@/lib/utils";

const filterOptions: { value: CategoryFilter; label: string; href: string }[] = [
  { value: "all", label: "Overview", href: "/variable-operationalization" },
  ...outcomeCategories.map((category) => ({
    value: category,
    label: categoryMeta[category].label,
    href: `/variable-operationalization/${category}`,
  })),
];

const methodToneClasses: Record<MethodTagTone, string> = {
  analysis: "border-[#8fb8ff] bg-[#edf4ff] text-[#2159b3]",
  transformation: "border-[#cbb4f7] bg-[#f5efff] text-[#6943ad]",
  restriction: "border-[#14213d]/14 bg-[#f4f2ee] text-[#52606d]",
  coding: "border-[#9fcf9a] bg-[#edf8eb] text-[#327039]",
  general: "border-[#14213d]/14 bg-white text-[#35435b]",
};

function ComponentSummary({ table, row }: { table: OutcomeTable; row: OutcomeRow }) {
  const components = deriveRowSummary(table, row).components;
  if (!components.length) return <span className="text-[#52606d]" aria-label="Not specified in source">—</span>;

  return (
    <ol className="min-w-0 list-decimal space-y-1 pl-5 text-[#35435b] marker:font-bold marker:text-[#2159b3]">
      {components.map((component) => <li key={`${component.sourceField}-${component.sourceItem}`}>{component.label}</li>)}
    </ol>
  );
}

function MethodSummary({ table, row }: { table: OutcomeTable; row: OutcomeRow }) {
  const methods = deriveRowSummary(table, row).methods;
  if (!methods.length) return <span className="text-[#52606d]" aria-label="Not specified in source">—</span>;

  return (
    <div className="flex flex-wrap gap-1.5">
      {methods.map((method) => (
        <span key={method.label} className={cn("inline-flex rounded-md border px-2 py-1 text-xs font-semibold leading-5", methodToneClasses[method.tone])}>{method.label}</span>
      ))}
    </div>
  );
}

function SourceChips({ table, row }: { table: OutcomeTable; row: OutcomeRow }) {
  const sources = deriveRowSummary(table, row).sources;
  if (!sources.length) return <span className="text-[#52606d]" aria-label="Not specified in source">—</span>;

  return (
    <div className="flex flex-wrap gap-1.5">
      {sources.map((source, index) => (
        <span key={`${source.reference}-${index}`} className="inline-flex rounded-md border border-[#14213d]/12 bg-[#f7f4ed] px-2 py-1 text-xs font-semibold leading-5 text-[#35435b]">{source.reference}</span>
      ))}
    </div>
  );
}

function MobileSummaryCard({ table, row, index, onOpen }: { table: OutcomeTable; row: OutcomeRow; index: number; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="w-full rounded-2xl border border-[#14213d]/12 bg-white p-5 text-left shadow-[0_12px_30px_rgba(20,33,61,0.04)] transition-colors hover:border-[#147d79]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]" aria-label={`View details for ${row.paper}`}>
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-base font-bold leading-6 text-[#14213d]">{row.paper}</h4>
        <span className="rounded-full bg-[#14213d]/6 px-2.5 py-1 text-xs font-semibold text-[#52606d]">{index + 1}</span>
      </div>
      <dl className="mt-5 grid gap-5">
        <div>
          <dt className="text-[0.68rem] font-bold tracking-[0.13em] text-[#b94f35] uppercase">Waves</dt>
          <dd className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[#35435b]">{row.waves.trim() || "—"}</dd>
        </div>
        <div>
          <dt className="text-[0.68rem] font-bold tracking-[0.13em] text-[#b94f35] uppercase">Components / Key Variables</dt>
          <dd className="mt-2 text-sm"><ComponentSummary table={table} row={row} /></dd>
        </div>
        <div>
          <dt className="text-[0.68rem] font-bold tracking-[0.13em] text-[#b94f35] uppercase">Construction Method</dt>
          <dd className="mt-2 text-sm"><MethodSummary table={table} row={row} /></dd>
        </div>
        <div>
          <dt className="text-[0.68rem] font-bold tracking-[0.13em] text-[#b94f35] uppercase">Source Pages / Figures</dt>
          <dd className="mt-2"><SourceChips table={table} row={row} /></dd>
        </div>
      </dl>
      <span className="mt-5 flex items-center justify-end gap-2 text-sm font-bold text-[#147d79]">View full record <ArrowRight aria-hidden="true" className="size-4" /></span>
    </button>
  );
}

function SummaryTable({ table, onOpen }: { table: OutcomeTable; onOpen: (row: OutcomeRow) => void }) {
  return (
    <>
      <div className="grid gap-4 md:hidden">
        {table.rows.map((row, index) => <MobileSummaryCard key={`${table.id}-${row.paper}-${index}`} table={table} row={row} index={index} onOpen={() => onOpen(row)} />)}
      </div>

      <div className="hidden min-w-0 max-w-full overflow-x-auto rounded-2xl border border-[#14213d]/12 bg-white md:block">
        <table className="w-full min-w-[1180px] border-collapse text-left text-[0.82rem]">
          <caption className="sr-only">{table.number}: {table.title}</caption>
          <thead>
            <tr className="bg-[#14213d] text-white">
              <th scope="col" className="w-[17%] px-4 py-4 font-semibold">Paper</th>
              <th scope="col" className="w-[9%] px-4 py-4 font-semibold">Waves</th>
              <th scope="col" className="w-[28%] px-4 py-4 font-semibold">Components / Key Variables</th>
              <th scope="col" className="w-[21%] px-4 py-4 font-semibold">Construction Method</th>
              <th scope="col" className="w-[20%] px-4 py-4 font-semibold">Source Pages / Figures</th>
              <th scope="col" className="w-[5%] px-3 py-4 text-center font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr key={`${table.id}-${row.paper}-${index}`} tabIndex={0} onClick={() => onOpen(row)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(row); } }} aria-label={`View details for ${row.paper}`} className="cursor-pointer align-top even:bg-[#f7f4ed]/70 hover:bg-[#eaf5f3] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#147d79]">
                <th scope="row" className="border-r border-t border-[#14213d]/10 px-4 py-4 font-bold leading-5 text-[#14213d]">{row.paper}</th>
                <td className="whitespace-pre-line border-r border-t border-[#14213d]/10 px-4 py-4 leading-5 text-[#35435b]">{row.waves.trim() || "—"}</td>
                <td className="border-r border-t border-[#14213d]/10 px-4 py-4"><ComponentSummary table={table} row={row} /></td>
                <td className="border-r border-t border-[#14213d]/10 px-4 py-4"><MethodSummary table={table} row={row} /></td>
                <td className="border-r border-t border-[#14213d]/10 px-4 py-4"><SourceChips table={table} row={row} /></td>
                <td className="border-t border-[#14213d]/10 px-3 py-4 text-center">
                  <button type="button" onClick={(event) => { event.stopPropagation(); onOpen(row); }} aria-label={`View full details for ${row.paper}`} className="inline-grid size-9 place-items-center rounded-full text-[#147d79] hover:bg-[#147d79]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]">
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function VariableResults({ tables, onReset }: { tables: OutcomeTable[]; onReset?: () => void }) {
  const visibleTableKey = tables.map((table) => table.id).join("|");
  const [accordionState, setAccordionState] = useState({ visibleTableKey, openTable: "" });
  const [selectedRecord, setSelectedRecord] = useState<{ table: OutcomeTable; row: OutcomeRow } | null>(null);
  const effectiveOpen = resolveVisibleOpenTable(accordionState.openTable, tables);
  const closeModal = useCallback(() => setSelectedRecord(null), []);

  if (accordionState.visibleTableKey !== visibleTableKey) {
    setAccordionState({ visibleTableKey, openTable: effectiveOpen });
  }

  if (!tables.length) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-[#14213d]/12 bg-white px-6 py-16 text-center">
        <Search aria-hidden="true" className="mx-auto size-8 text-[#147d79]" />
        <h2 className="mt-5 text-3xl">No matching variable records</h2>
        <p className="mt-3 leading-7 text-[#52606d]">Try a broader term or clear the current search.</p>
        {onReset ? <Button type="button" variant="outline" onClick={onReset} className="mt-7"><RotateCcw aria-hidden="true" className="size-4" /> Clear all</Button> : null}
      </div>
    );
  }

  return (
    <>
      <Accordion
        type="single"
        collapsible
        value={effectiveOpen}
        onValueChange={(openTable) => setAccordionState({ visibleTableKey, openTable })}
        className="grid min-w-0 gap-12"
      >
        {outcomeCategories.map((groupCategory) => {
          const groupTables = tables.filter((table) => table.category === groupCategory);
          if (!groupTables.length) return null;
          const meta = categoryMeta[groupCategory as OutcomeCategory];

          return (
            <section key={groupCategory} aria-labelledby={`${groupCategory}-heading`} className="min-w-0">
              <div className="mb-3 flex items-end justify-between gap-4 border-b border-[#14213d]/18 pb-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#b94f35] uppercase">Research theme</p>
                  <h2 id={`${groupCategory}-heading`} className="mt-2 text-4xl tracking-[-0.025em]">{meta.label}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#52606d]">{meta.description}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-[#52606d]">{groupTables.length} {groupTables.length === 1 ? "table" : "tables"}</span>
              </div>
              <div className="min-w-0 rounded-2xl border border-[#14213d]/12 bg-[#fffdf8] px-5 shadow-[0_18px_55px_rgba(20,33,61,0.04)] sm:px-7">
                {groupTables.map((table) => (
                  <AccordionItem key={table.id} value={table.id}>
                    <AccordionTrigger>
                      <span className="flex min-w-0 items-start gap-4 sm:items-center">
                        <Badge className="shrink-0">{table.number}</Badge>
                        <span>
                          <span className="font-editorial block text-xl leading-6 tracking-[-0.015em] text-[#14213d] sm:text-2xl">{table.title}</span>
                          <span className="mt-1 block text-xs font-medium text-[#52606d]">{table.rows.length} paper {table.rows.length === 1 ? "record" : "records"}</span>
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent><SummaryTable table={table} onOpen={(row) => setSelectedRecord({ table, row })} /></AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            </section>
          );
        })}
      </Accordion>
      <RecordDetailModal record={selectedRecord} onClose={closeModal} />
    </>
  );
}

export function OutcomeBrowser({ category }: { category: CategoryFilter }) {
  const [filters, setFilters] = useState<VariableFilters>({ ...emptyVariableFilters });
  const filteredTables = useMemo(() => filterOutcomeTablesWithFacets(outcomeTables, filters, category), [filters, category]);
  const visibleRows = filteredTables.reduce((total, table) => total + table.rows.length, 0);
  const lockedCategory = category === "all" ? undefined : category;

  return (
    <div>
      <div className="sticky top-20 z-30 bg-[#f7f4ed]/96 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <nav className="flex flex-wrap gap-2 pt-4" aria-label="Browse variable operationalization by research theme">
            {filterOptions.map((option) => (
              <Link key={option.value} href={option.href} aria-current={category === option.value ? "page" : undefined} className={cn("min-h-10 rounded-full border px-4 py-2 text-xs font-bold transition-colors sm:text-sm", category === option.value ? "border-[#147d79] bg-[#147d79] text-white" : "border-[#14213d]/16 bg-white text-[#52606d] hover:border-[#147d79]/50 hover:text-[#14213d]")}>{option.label}</Link>
            ))}
          </nav>
          <VariableFilterBar id="theme-variable-filter" filters={filters} onChange={setFilters} lockedCategory={lockedCategory} tableCount={filteredTables.length} rowCount={visibleRows} />
        </div>
      </div>
      <div className="mx-auto min-w-0 max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <VariableResults tables={filteredTables} onReset={() => setFilters({ ...emptyVariableFilters })} />
      </div>
    </div>
  );
}
