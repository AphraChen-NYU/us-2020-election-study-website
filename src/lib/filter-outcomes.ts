import { categoryMeta, type OutcomeCategory, type OutcomeTable } from "@/data/outcome-measures";
import { deriveRowSummary } from "@/lib/outcome-summary";

export type CategoryFilter = OutcomeCategory | "all";
export type SearchScope = "all" | "paper" | "measure" | "method" | "waves" | "source";

export interface VariableFilters {
  query: string;
  scope: SearchScope;
  themes: OutcomeCategory[];
  papers: string[];
  measures: string[];
  methods: string[];
}

export const emptyVariableFilters: VariableFilters = {
  query: "",
  scope: "all",
  themes: [],
  papers: [],
  measures: [],
  methods: [],
};

export function hasActiveVariableFilters(filters: VariableFilters) {
  return Boolean(
    filters.query.trim()
      || filters.themes.length
      || filters.papers.length
      || filters.measures.length
      || filters.methods.length,
  );
}

function normalizedTokens(query: string) {
  return query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
}

function queryHaystack(table: OutcomeTable, row: OutcomeTable["rows"][number], scope: SearchScope) {
  const summary = deriveRowSummary(table, row);
  const measures = [table.number, table.title, ...summary.components.map((component) => component.label), row.questionsUsed];
  const methods = [...summary.methods.map((method) => method.label), row.method];

  const fields: Record<SearchScope, string[]> = {
    all: [
      categoryMeta[table.category].label,
      row.paper,
      ...measures,
      ...methods,
      row.waves,
      row.pages,
    ],
    paper: [row.paper],
    measure: measures,
    method: methods,
    waves: [row.waves],
    source: [row.pages],
  };

  return fields[scope].join(" ").toLocaleLowerCase();
}

export function filterOutcomeTablesWithFacets(
  tables: OutcomeTable[],
  filters: VariableFilters,
  category: CategoryFilter,
): OutcomeTable[] {
  const tokens = normalizedTokens(filters.query);

  return tables.flatMap((table) => {
    if (category !== "all" && table.category !== category) return [];
    if (filters.themes.length && !filters.themes.includes(table.category)) return [];

    const matchingRows = table.rows.filter((row) => {
      const summary = deriveRowSummary(table, row);
      if (filters.papers.length && !filters.papers.includes(row.paper)) return false;

      if (filters.measures.length) {
        const tableValue = `table:${table.id}`;
        const componentValues = summary.components.map((component) => `component:${component.label}`);
        if (!filters.measures.some((measure) => measure === tableValue || componentValues.includes(measure))) return false;
      }

      if (filters.methods.length && !filters.methods.some((method) => summary.methods.some((tag) => tag.label === method))) return false;
      if (tokens.length && !tokens.every((token) => queryHaystack(table, row, filters.scope).includes(token))) return false;
      return true;
    });

    return matchingRows.length ? [{ ...table, rows: matchingRows }] : [];
  });
}

/** Backward-compatible keyword-only filtering used by older callers and tests. */
export function filterOutcomeTables(tables: OutcomeTable[], query: string, category: CategoryFilter): OutcomeTable[] {
  return filterOutcomeTablesWithFacets(tables, { ...emptyVariableFilters, query }, category);
}
