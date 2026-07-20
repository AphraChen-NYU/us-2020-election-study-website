import { describe, expect, it } from "vitest";
import { outcomeTables } from "@/data/outcome-measures";
import {
  emptyVariableFilters,
  filterOutcomeTablesWithFacets,
  getOutcomeFilterLabel,
  getVariableFilterOptions,
  hasActiveVariableFilters,
  reconcileVariableFilters,
} from "@/lib/filter-outcomes";

describe("getOutcomeFilterLabel", () => {
  it("removes table codes by using titles and strips generic measure suffixes", () => {
    expect(getOutcomeFilterLabel(outcomeTables.find((table) => table.id === "a1-1")!)).toBe("Affective polarization");
    expect(getOutcomeFilterLabel(outcomeTables.find((table) => table.id === "a3-2")!)).toBe("Party-congenial election misconduct and outcomes");
    expect(getOutcomeFilterLabel(outcomeTables.find((table) => table.id === "a4-7")!)).toBe("Pro-attitudinal Knowledge of Events and Belief in False Claims");
  });
});

describe("getVariableFilterOptions", () => {
  it("exposes only the four themes, six papers, and 24 outcome tables", () => {
    const options = getVariableFilterOptions(outcomeTables);

    expect(options.themes).toHaveLength(4);
    expect(options.papers).toHaveLength(6);
    expect(options.outcomes).toHaveLength(24);
    expect(options.outcomes.every((option) => option.value.startsWith("table:"))).toBe(true);
    expect(options.outcomes.every((option) => option.group && ["Polarization", "Participation", "Trust", "Knowledge"].includes(option.group))).toBe(true);
    expect(options.outcomes.some((option) => option.label.includes("Key variables"))).toBe(false);
  });

  it("scopes paper and outcome options to a locked theme", () => {
    const options = getVariableFilterOptions(outcomeTables, "polarization");

    expect(options.outcomes).toHaveLength(3);
    expect(options.outcomes.map((option) => option.value)).toEqual(["table:a1-1", "table:a1-2", "table:a1-3"]);
    expect(options.outcomes.every((option) => option.group === undefined)).toBe(true);
    expect(options.papers.map((option) => option.value)).toContain("Untrustworthy (Bergeron-Boutin et al., forthcoming)");
  });

  it("scopes overview paper and outcome options to selected themes", () => {
    const options = getVariableFilterOptions(outcomeTables, undefined, {
      ...emptyVariableFilters,
      themes: ["trust"],
    });

    expect(options.outcomes).toHaveLength(8);
    expect(options.outcomes.every((option) => option.group === "Trust")).toBe(true);
    expect(options.outcomes.map((option) => option.value)).toContain("table:a3-2");
    expect(options.outcomes.map((option) => option.value)).not.toContain("table:a1-1");
    expect(options.papers.map((option) => option.value)).toContain("Likeminded (Nyhan et al., 2023)");
  });

  it("further scopes outcome options to selected papers", () => {
    const options = getVariableFilterOptions(outcomeTables, undefined, {
      themes: ["trust"],
      papers: ["Chronological Feed (Guess et al., 2023)"],
      outcomes: [],
    });

    expect(options.outcomes.map((option) => option.value)).toEqual([
      "table:a3-1",
      "table:a3-6",
      "table:a3-7",
      "table:a3-8",
    ]);
  });
});

describe("reconcileVariableFilters", () => {
  it("removes outcomes that no longer belong to a newly selected theme", () => {
    expect(reconcileVariableFilters(outcomeTables, {
      themes: ["trust"],
      papers: [],
      outcomes: ["table:a1-1", "table:a3-2"],
    })).toEqual({
      themes: ["trust"],
      papers: [],
      outcomes: ["table:a3-2"],
    });
  });

  it("keeps compatible paper selections and removes incompatible outcomes", () => {
    expect(reconcileVariableFilters(outcomeTables, {
      themes: ["trust"],
      papers: ["Chronological Feed (Guess et al., 2023)"],
      outcomes: ["table:a3-1", "table:a3-2"],
    })).toEqual({
      themes: ["trust"],
      papers: ["Chronological Feed (Guess et al., 2023)"],
      outcomes: ["table:a3-1"],
    });
  });
});

describe("filterOutcomeTablesWithFacets", () => {
  it("returns every table with no active filters", () => {
    expect(filterOutcomeTablesWithFacets(outcomeTables, emptyVariableFilters, "all")).toHaveLength(24);
    expect(hasActiveVariableFilters(emptyVariableFilters)).toBe(false);
  });

  it("combines multiple themes with OR", () => {
    const results = filterOutcomeTablesWithFacets(outcomeTables, {
      ...emptyVariableFilters,
      themes: ["polarization", "knowledge"],
    }, "all");

    expect(results).toHaveLength(10);
    expect(results.every((table) => table.category === "polarization" || table.category === "knowledge")).toBe(true);
  });

  it("combines multiple papers with OR and retains only matching rows", () => {
    const papers = ["Chronological Feed (Guess et al., 2023)", "Reshares (Guess et al., 2023)"];
    const results = filterOutcomeTablesWithFacets(outcomeTables, { ...emptyVariableFilters, papers }, "all");

    expect(results.length).toBeGreaterThan(0);
    expect(results.flatMap((table) => table.rows).every((row) => papers.includes(row.paper))).toBe(true);
  });

  it("selects whole outcome tables and retains every paper row", () => {
    const results = filterOutcomeTablesWithFacets(outcomeTables, {
      ...emptyVariableFilters,
      outcomes: ["table:a4-3"],
    }, "all");

    expect(results.map((table) => table.id)).toEqual(["a4-3"]);
    expect(results[0].rows).toHaveLength(2);
  });

  it("combines different filter groups with AND", () => {
    const results = filterOutcomeTablesWithFacets(outcomeTables, {
      themes: ["polarization"],
      papers: ["Chronological Feed (Guess et al., 2023)", "Reshares (Guess et al., 2023)"],
      outcomes: ["table:a1-1", "table:a1-2"],
    }, "all");

    expect(results.map((table) => table.id)).toEqual(["a1-1", "a1-2"]);
    expect(results.flatMap((table) => table.rows).every((row) => row.paper.startsWith("Chronological Feed") || row.paper.startsWith("Reshares"))).toBe(true);
  });

  it("preserves the route theme as a fixed outer scope", () => {
    const results = filterOutcomeTablesWithFacets(outcomeTables, {
      ...emptyVariableFilters,
      outcomes: ["table:a4-3"],
    }, "polarization");

    expect(results).toEqual([]);
  });
});
