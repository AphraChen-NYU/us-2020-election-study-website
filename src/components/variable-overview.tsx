"use client";

import { useMemo, useState } from "react";
import { ThemeGrid } from "@/components/theme-grid";
import { VariableResults } from "@/components/outcome-browser";
import { VariableFilterBar } from "@/components/variable-filter-bar";
import { Badge } from "@/components/ui/badge";
import { outcomeTables } from "@/data/outcome-measures";
import {
  emptyVariableFilters,
  filterOutcomeTablesWithFacets,
  hasActiveVariableFilters,
  type VariableFilters,
} from "@/lib/filter-outcomes";

export function VariableOverview() {
  const [filters, setFilters] = useState<VariableFilters>({ ...emptyVariableFilters });
  const hasFilters = hasActiveVariableFilters(filters);
  const filteredTables = useMemo(() => filterOutcomeTablesWithFacets(outcomeTables, filters, "all"), [filters]);
  const visibleRows = filteredTables.reduce((total, table) => total + table.rows.length, 0);

  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-14 sm:px-8 md:pt-20 lg:px-12">
      <div className="grid items-end gap-8 pb-10 lg:grid-cols-[1fr_0.8fr] lg:pb-12">
        <div>
          <Badge>Variable operationalization</Badge>
          <h1 className="mt-6 max-w-4xl text-[clamp(3.2rem,7vw,6.6rem)] leading-[0.9] tracking-[-0.05em]">
            Variables by theme, paper, or measure
          </h1>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-[#52606d] lg:pb-2">
          Use the drop down menus to search for FIES variables
        </p>
      </div>

      <VariableFilterBar id="overview-variable-filter" filters={filters} onChange={setFilters} tableCount={filteredTables.length} rowCount={visibleRows} />

      <div className="py-10 md:py-14">
        {hasFilters ? <VariableResults tables={filteredTables} onReset={() => setFilters({ ...emptyVariableFilters })} /> : <ThemeGrid />}
      </div>
    </section>
  );
}
