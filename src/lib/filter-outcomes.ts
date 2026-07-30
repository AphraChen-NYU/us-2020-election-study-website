import { categoryMeta, outcomeCategories, type OutcomeCategory, type OutcomeTable } from "@/data/outcome-measures";

export type CategoryFilter = OutcomeCategory | "all";

export interface VariableFilters {
  themes: OutcomeCategory[];
  papers: string[];
  outcomes: string[];
}

export const emptyVariableFilters: VariableFilters = {
  themes: [],
  papers: [],
  outcomes: [],
};

export interface VariableFilterOption {
  value: string;
  label: string;
  group?: string;
}

export function hasActiveVariableFilters(filters: VariableFilters) {
  return Boolean(filters.themes.length || filters.papers.length || filters.outcomes.length);
}

export function getOutcomeFilterLabel(table: OutcomeTable) {
  const withoutOutcomeMeasures = table.title.replace(/\s+outcome measures$/i, "");
  const label = (withoutOutcomeMeasures === table.title
    ? table.title.replace(/\s+measures$/i, "")
    : withoutOutcomeMeasures).trim();

  return table.id === "a4-7" ? "Pro-attitudinal knowledge of events and belief in false claims" : label;
}

export function getVariableFilterOptions(
  tables: OutcomeTable[],
  lockedCategory?: OutcomeCategory,
  filters: VariableFilters = emptyVariableFilters,
) {
  const selectedThemes = lockedCategory
    ? [lockedCategory]
    : filters.themes.length
      ? filters.themes
      : outcomeCategories;
  const themeScopedTables = tables.filter((table) => selectedThemes.includes(table.category));
  const outcomeScopedTables = filters.papers.length
    ? themeScopedTables.filter((table) => table.rows.some((row) => filters.papers.includes(row.paper)))
    : themeScopedTables;

  const themes: VariableFilterOption[] = outcomeCategories.map((category) => ({
    value: category,
    label: categoryMeta[category].label,
  }));
  const papers: VariableFilterOption[] = [...new Set(themeScopedTables.flatMap((table) => table.rows.map((row) => row.paper)))]
    .sort((a, b) => a.localeCompare(b))
    .map((paper) => ({ value: paper, label: paper }));
  const outcomes: VariableFilterOption[] = outcomeScopedTables.map((table) => ({
    value: `table:${table.id}`,
    label: getOutcomeFilterLabel(table),
    group: lockedCategory ? undefined : categoryMeta[table.category].label,
  }));

  return { themes, papers, outcomes };
}

export function reconcileVariableFilters(
  tables: OutcomeTable[],
  filters: VariableFilters,
  lockedCategory?: OutcomeCategory,
): VariableFilters {
  const themeScopedOptions = getVariableFilterOptions(tables, lockedCategory, {
    ...filters,
    papers: [],
    outcomes: [],
  });
  const allowedPapers = new Set(themeScopedOptions.papers.map((option) => option.value));
  const papers = filters.papers.filter((paper) => allowedPapers.has(paper));

  const dependentOptions = getVariableFilterOptions(tables, lockedCategory, {
    ...filters,
    papers,
    outcomes: [],
  });
  const allowedOutcomes = new Set(dependentOptions.outcomes.map((option) => option.value));

  return {
    themes: lockedCategory ? [] : filters.themes,
    papers,
    outcomes: filters.outcomes.filter((outcome) => allowedOutcomes.has(outcome)),
  };
}

export function filterOutcomeTablesWithFacets(
  tables: OutcomeTable[],
  filters: VariableFilters,
  category: CategoryFilter,
): OutcomeTable[] {
  return tables.flatMap((table) => {
    if (category !== "all" && table.category !== category) return [];
    if (filters.themes.length && !filters.themes.includes(table.category)) return [];
    if (filters.outcomes.length && !filters.outcomes.includes(`table:${table.id}`)) return [];

    const matchingRows = table.rows.filter((row) => {
      if (filters.papers.length && !filters.papers.includes(row.paper)) return false;
      return true;
    });

    return matchingRows.length ? [{ ...table, rows: matchingRows }] : [];
  });
}
