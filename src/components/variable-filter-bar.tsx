"use client";

import { useMemo, useState } from "react";
import { ChevronDown, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { outcomeTables, type OutcomeCategory } from "@/data/outcome-measures";
import { emptyVariableFilters, getVariableFilterOptions, reconcileVariableFilters, type VariableFilterOption, type VariableFilters } from "@/lib/filter-outcomes";
import { cn } from "@/lib/utils";

function FacetMenu({
  label,
  options,
  selected,
  onChange,
  open,
  onOpenChange,
}: {
  label: string;
  options: VariableFilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const grouped = options.reduce((groups, option) => {
    const group = option.group ?? "";
    groups.set(group, [...(groups.get(group) ?? []), option]);
    return groups;
  }, new Map<string, VariableFilterOption[]>());

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <details open={open} className="group/facet relative">
      <summary
        onClick={(event) => {
          event.preventDefault();
          onOpenChange(!open);
        }}
        className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-[#14213d]/16 bg-white px-4 py-2 text-sm font-bold text-[#35435b] transition-colors hover:border-[#147d79]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
      >
        {label}
        {selected.length ? <span className="rounded-full bg-[#147d79] px-2 py-0.5 text-[0.68rem] text-white">{selected.length}</span> : null}
        <ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-open/facet:rotate-180" />
      </summary>
      <div className="relative z-40 mt-2 w-[min(360px,calc(100vw-2.5rem))] rounded-2xl border border-[#14213d]/14 bg-white p-3 shadow-[0_18px_55px_rgba(20,33,61,0.16)] sm:absolute sm:left-0">
        <div className="max-h-72 overflow-y-auto pr-1">
          {Array.from(grouped.entries()).map(([group, groupOptions]) => (
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
          ))}
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
  const filterOptions = useMemo(
    () => getVariableFilterOptions(outcomeTables, lockedCategory, filters),
    [filters, lockedCategory],
  );

  const facets = useMemo(() => [
    ...(!lockedCategory ? [{ key: "themes" as const, label: "Theme", options: filterOptions.themes }] : []),
    { key: "papers" as const, label: "Paper", options: filterOptions.papers },
    { key: "outcomes" as const, label: "Measure", options: filterOptions.outcomes },
  ], [filterOptions, lockedCategory]);
  const [openFacet, setOpenFacet] = useState<keyof VariableFilters | null>(null);
  const visibleOpenFacet = facets.some((facet) => facet.key === openFacet) ? openFacet : null;

  const selectedCount = filters.themes.length + filters.papers.length + filters.outcomes.length;
  const optionLabels = useMemo(() => new Map(
    [...filterOptions.themes, ...filterOptions.papers, ...filterOptions.outcomes].map((option) => [option.value, option.label]),
  ), [filterOptions]);

  function update<K extends keyof VariableFilters>(key: K, value: VariableFilters[K]) {
    onChange(reconcileVariableFilters(outcomeTables, { ...filters, [key]: value }, lockedCategory));
  }

  const activeValues = [
    ...filters.themes.map((value) => ({ field: "themes" as const, value })),
    ...filters.papers.map((value) => ({ field: "papers" as const, value })),
    ...filters.outcomes.map((value) => ({ field: "outcomes" as const, value })),
  ];

  return (
    <div className="border-y border-[#14213d]/12 py-5">
      <div className="flex flex-wrap items-center gap-2.5" role="group" aria-labelledby={`${id}-label`}>
        <span id={`${id}-label`} className="mr-1 text-sm font-bold tracking-[0.08em] text-[#52606d] uppercase">Search by</span>
        {facets.map((facet) => (
          <FacetMenu
            key={facet.key}
            label={facet.label}
            options={facet.options}
            selected={filters[facet.key]}
            onChange={(values) => update(facet.key, values)}
            open={visibleOpenFacet === facet.key}
            onOpenChange={(open) => setOpenFacet((current) => open ? facet.key : current === facet.key ? null : current)}
          />
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!selectedCount}
          onClick={() => {
            setOpenFacet(null);
            onChange({ ...emptyVariableFilters });
          }}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" /> Clear all filters
        </Button>
      </div>

      <div className="mt-4 text-sm text-[#52606d]">
        <p aria-live="polite">
          Showing <strong className="text-[#14213d]">{tableCount}</strong> {tableCount === 1 ? "table" : "tables"} and{" "}
          <strong className="text-[#14213d]">{rowCount}</strong> {rowCount === 1 ? "record" : "records"}
        </p>
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
