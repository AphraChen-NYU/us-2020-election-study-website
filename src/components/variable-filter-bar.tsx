"use client";

import { useMemo, useState } from "react";
import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryMeta, outcomeCategories, outcomeTables, type OutcomeCategory } from "@/data/outcome-measures";
import { deriveRowSummary } from "@/lib/outcome-summary";
import { emptyVariableFilters, type SearchScope, type VariableFilters } from "@/lib/filter-outcomes";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  group?: string;
}

const scopeOptions: { value: SearchScope; label: string }[] = [
  { value: "all", label: "All fields" },
  { value: "paper", label: "Papers" },
  { value: "measure", label: "Measures" },
  { value: "method", label: "Construction methods" },
  { value: "waves", label: "Waves" },
  { value: "source", label: "Sources" },
];

const themeOptions: FilterOption[] = outcomeCategories.map((category) => ({ value: category, label: categoryMeta[category].label }));
const paperOptions: FilterOption[] = [...new Set(outcomeTables.flatMap((table) => table.rows.map((row) => row.paper)))]
  .sort((a, b) => a.localeCompare(b))
  .map((paper) => ({ value: paper, label: paper }));

const tableMeasureOptions: FilterOption[] = outcomeTables.map((table) => ({
  value: `table:${table.id}`,
  label: `${table.number} ${table.title}`,
  group: "Measure tables",
}));

const componentMeasureOptions: FilterOption[] = [...new Set(
  outcomeTables.flatMap((table) => table.rows.flatMap((row) => deriveRowSummary(table, row).components.map((component) => component.label))),
)]
  .sort((a, b) => a.localeCompare(b))
  .map((label) => ({ value: `component:${label}`, label, group: "Key variables" }));

const measureOptions = [...tableMeasureOptions, ...componentMeasureOptions];
const methodOptions: FilterOption[] = [...new Set(
  outcomeTables.flatMap((table) => table.rows.flatMap((row) => deriveRowSummary(table, row).methods.map((method) => method.label))),
)]
  .sort((a, b) => a.localeCompare(b))
  .map((label) => ({ value: label, label }));

const optionLabels = new Map(
  [...themeOptions, ...paperOptions, ...measureOptions, ...methodOptions].map((option) => [option.value, option.label]),
);

function FacetMenu({
  id,
  label,
  options,
  selected,
  onChange,
}: {
  id: string;
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [optionQuery, setOptionQuery] = useState("");
  const normalized = optionQuery.trim().toLocaleLowerCase();
  const visibleOptions = normalized ? options.filter((option) => option.label.toLocaleLowerCase().includes(normalized)) : options;
  const grouped = visibleOptions.reduce((groups, option) => {
    const group = option.group ?? "";
    groups.set(group, [...(groups.get(group) ?? []), option]);
    return groups;
  }, new Map<string, FilterOption[]>());

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <details className="group/facet relative">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-[#14213d]/16 bg-white px-4 py-2 text-sm font-bold text-[#35435b] transition-colors hover:border-[#147d79]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]">
        {label}
        {selected.length ? <span className="rounded-full bg-[#147d79] px-2 py-0.5 text-[0.68rem] text-white">{selected.length}</span> : null}
        <ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-open/facet:rotate-180" />
      </summary>
      <div className="relative z-40 mt-2 w-full rounded-2xl border border-[#14213d]/14 bg-white p-3 shadow-[0_18px_55px_rgba(20,33,61,0.16)] lg:absolute lg:left-0 lg:w-[360px]">
        {options.length > 8 ? (
          <div className="relative mb-3">
            <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#52606d]" />
            <label htmlFor={`${id}-option-search`} className="sr-only">Search {label.toLocaleLowerCase()} options</label>
            <input
              id={`${id}-option-search`}
              type="search"
              value={optionQuery}
              onChange={(event) => setOptionQuery(event.target.value)}
              placeholder={`Find ${label.toLocaleLowerCase()}`}
              className="min-h-10 w-full rounded-xl border border-[#14213d]/14 bg-[#f7f4ed] py-2 pr-3 pl-9 text-sm focus:border-[#147d79] focus:outline-none"
            />
          </div>
        ) : null}
        <div className="max-h-72 overflow-y-auto pr-1">
          {visibleOptions.length ? Array.from(grouped.entries()).map(([group, groupOptions]) => (
            <fieldset key={group || label} className={cn(group && "mb-4 last:mb-0")}>
              {group ? <legend className="mb-2 px-1 text-[0.65rem] font-bold tracking-[0.14em] text-[#b94f35] uppercase">{group}</legend> : null}
              <div className="grid gap-1">
                {groupOptions.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-sm leading-5 text-[#35435b] hover:bg-[#f7f4ed]">
                    <input
                      type="checkbox"
                      checked={selected.includes(option.value)}
                      onChange={() => toggle(option.value)}
                      className="mt-0.5 size-4 accent-[#147d79]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )) : <p className="px-2 py-5 text-center text-sm text-[#52606d]">No matching options</p>}
        </div>
      </div>
    </details>
  );
}

export function VariableFilterBar({
  id,
  filters,
  onChange,
  lockedCategory,
  tableCount,
  rowCount,
}: {
  id: string;
  filters: VariableFilters;
  onChange: (filters: VariableFilters) => void;
  lockedCategory?: OutcomeCategory;
  tableCount: number;
  rowCount: number;
}) {
  const selectedCount = filters.themes.length + filters.papers.length + filters.measures.length + filters.methods.length;
  const hasSelections = Boolean(filters.query.trim() || selectedCount);

  const facets = useMemo(() => [
    ...(!lockedCategory ? [{ key: "themes" as const, label: "Theme", options: themeOptions }] : []),
    { key: "papers" as const, label: "Paper", options: paperOptions },
    { key: "measures" as const, label: "Measure", options: measureOptions },
    { key: "methods" as const, label: "Method", options: methodOptions },
  ], [lockedCategory]);

  function update<K extends keyof VariableFilters>(key: K, value: VariableFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const activeValues = [
    ...filters.themes.map((value) => ({ field: "themes" as const, value })),
    ...filters.papers.map((value) => ({ field: "papers" as const, value })),
    ...filters.measures.map((value) => ({ field: "measures" as const, value })),
    ...filters.methods.map((value) => ({ field: "methods" as const, value })),
  ];

  return (
    <div className="border-y border-[#14213d]/12 py-5">
      <div className="grid gap-3 xl:grid-cols-[minmax(360px,1fr)_auto] xl:items-center">
        <div className="grid gap-2 sm:grid-cols-[minmax(240px,1fr)_190px]">
          <div className="relative">
            <Search aria-hidden="true" className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#52606d]" />
            <label htmlFor={`${id}-search`} className="sr-only">Search variable operationalization records</label>
            <input
              id={`${id}-search`}
              type="search"
              value={filters.query}
              onChange={(event) => update("query", event.target.value)}
              placeholder="Search records"
              className="min-h-12 w-full rounded-full border border-[#14213d]/18 bg-white py-3 pr-12 pl-12 text-sm text-[#14213d] shadow-sm placeholder:text-[#52606d]/75 focus:border-[#147d79] focus:outline-none focus:ring-3 focus:ring-[#147d79]/18"
            />
            {filters.query ? (
              <button type="button" onClick={() => update("query", "")} aria-label="Clear search" className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[#52606d] hover:bg-[#14213d]/7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]">
                <X aria-hidden="true" className="size-4" />
              </button>
            ) : null}
          </div>
          <div>
            <label htmlFor={`${id}-scope`} className="sr-only">Search within</label>
            <select
              id={`${id}-scope`}
              value={filters.scope}
              onChange={(event) => update("scope", event.target.value as SearchScope)}
              className="min-h-12 w-full rounded-full border border-[#14213d]/18 bg-white px-4 py-3 text-sm font-semibold text-[#35435b] focus:border-[#147d79] focus:outline-none focus:ring-3 focus:ring-[#147d79]/18"
            >
              {scopeOptions.map((option) => <option key={option.value} value={option.value}>Search in: {option.label}</option>)}
            </select>
          </div>
        </div>

        <div className="hidden flex-wrap gap-2 lg:flex">
          {facets.map((facet) => (
            <FacetMenu key={facet.key} id={`${id}-${facet.key}`} label={facet.label} options={facet.options} selected={filters[facet.key]} onChange={(values) => update(facet.key, values)} />
          ))}
        </div>

        <details className="group/filters lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-xl border border-[#14213d]/16 bg-white px-4 py-2.5 text-sm font-bold text-[#35435b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]">
            <span className="flex items-center gap-2"><SlidersHorizontal aria-hidden="true" className="size-4" /> Filters {selectedCount ? `(${selectedCount})` : ""}</span>
            <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open/filters:rotate-180" />
          </summary>
          <div className="mt-2 grid gap-2 rounded-2xl border border-[#14213d]/12 bg-[#fffdf8] p-3">
            {facets.map((facet) => (
              <FacetMenu key={facet.key} id={`${id}-mobile-${facet.key}`} label={facet.label} options={facet.options} selected={filters[facet.key]} onChange={(values) => update(facet.key, values)} />
            ))}
          </div>
        </details>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#52606d]">
        <p aria-live="polite">
          Showing <strong className="text-[#14213d]">{tableCount}</strong> {tableCount === 1 ? "table" : "tables"} and{" "}
          <strong className="text-[#14213d]">{rowCount}</strong> {rowCount === 1 ? "record" : "records"}
        </p>
        {hasSelections ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange({ ...emptyVariableFilters })}>
            <RotateCcw aria-hidden="true" className="size-3.5" /> Clear all
          </Button>
        ) : null}
      </div>

      {activeValues.length ? (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Active filters">
          {activeValues.map(({ field, value }) => (
            <button
              key={`${field}-${value}`}
              type="button"
              onClick={() => update(field, filters[field].filter((item) => item !== value))}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#147d79]/25 bg-[#eaf5f3] px-3 py-1.5 text-xs font-semibold text-[#125f5c] hover:border-[#147d79]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
            >
              <span className="truncate">{optionLabels.get(value) ?? value}</span>
              <X aria-hidden="true" className="size-3" />
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
