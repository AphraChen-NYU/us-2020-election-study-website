import { describe, expect, it } from "vitest";
import { outcomeTables } from "@/data/outcome-measures";
import { emptyVariableFilters, filterOutcomeTables, filterOutcomeTablesWithFacets } from "@/lib/filter-outcomes";

describe("filterOutcomeTables", () => {
  it("returns every table with no active filters", () => {
    expect(filterOutcomeTables(outcomeTables, "", "all")).toHaveLength(24);
  });

  it("filters by category", () => {
    const results = filterOutcomeTables(outcomeTables, "", "knowledge");
    expect(results).toHaveLength(7);
    expect(results.every((table) => table.category === "knowledge")).toBe(true);
  });

  it("searches table titles without dropping rows", () => {
    const results = filterOutcomeTables(outcomeTables, "Affective polarization", "all");
    expect(results).toHaveLength(1);
    expect(results[0].number).toBe("A1.1");
    expect(results[0].rows).toHaveLength(6);
  });

  it("searches all retained row fields case-insensitively", () => {
    const results = filterOutcomeTables(outcomeTables, "VARIMAX ROTATION", "all");
    expect(results.length).toBeGreaterThan(0);
    expect(results.flatMap((table) => table.rows).every((row) => row.method.toLowerCase().includes("varimax rotation"))).toBe(true);
  });

  it("returns no results for an unrelated term", () => {
    expect(filterOutcomeTables(outcomeTables, "no-such-measure-xyz", "all")).toEqual([]);
  });
});

describe("filterOutcomeTablesWithFacets", () => {
  it("supports scoped, multi-term paper search", () => {
    const results = filterOutcomeTablesWithFacets(outcomeTables, { ...emptyVariableFilters, query: "Guess Reshares", scope: "paper" }, "all");
    expect(results.length).toBeGreaterThan(0);
    expect(results.flatMap((table) => table.rows).every((row) => row.paper === "Reshares (Guess et al., 2023)")).toBe(true);
  });

  it("filters measures at both table and curated-component levels", () => {
    const tableResults = filterOutcomeTablesWithFacets(outcomeTables, { ...emptyVariableFilters, measures: ["table:a4-3"] }, "all");
    expect(tableResults.map((table) => table.id)).toEqual(["a4-3"]);
    expect(tableResults[0].rows).toHaveLength(2);

    const component = "Feeling-thermometer difference: preferred-party supporters vs. other-party supporters";
    const componentResults = filterOutcomeTablesWithFacets(outcomeTables, { ...emptyVariableFilters, measures: [`component:${component}`] }, "all");
    expect(componentResults.map((table) => table.id)).toEqual(["a1-1"]);
    expect(componentResults[0].rows).toHaveLength(6);
  });

  it("combines groups with AND and selections within a group with OR", () => {
    const results = filterOutcomeTablesWithFacets(outcomeTables, {
      ...emptyVariableFilters,
      themes: ["polarization"],
      papers: ["Chronological Feed (Guess et al., 2023)", "Reshares (Guess et al., 2023)"],
      methods: ["PCA"],
    }, "all");
    expect(results.every((table) => table.category === "polarization")).toBe(true);
    expect(results.flatMap((table) => table.rows).every((row) => row.paper.startsWith("Chronological Feed") || row.paper.startsWith("Reshares"))).toBe(true);
  });

  it("preserves the route theme as a fixed outer scope", () => {
    const results = filterOutcomeTablesWithFacets(outcomeTables, { ...emptyVariableFilters, themes: ["knowledge"] }, "polarization");
    expect(results).toEqual([]);
  });

  it("uses curated Participation summary methods in method facets", () => {
    const method = "Binary coding for party-line presidential voting";
    const results = filterOutcomeTablesWithFacets(outcomeTables, { ...emptyVariableFilters, methods: [method] }, "participation");
    expect(results.map((table) => table.id)).toEqual(["a2-6"]);
    expect(results[0].rows.map((row) => row.paper)).toEqual(["Reshares (Guess et al., 2023)"]);
  });
});
