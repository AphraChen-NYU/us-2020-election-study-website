import { describe, expect, it } from "vitest";
import { outcomeTables } from "@/data/outcome-measures";
import { curatedRecordSummaries, getCuratedRecordSummary, recordSummaryKey } from "@/data/record-summaries";
import { deriveRowSummary, parseSourceEntries, splitNumberedItems } from "@/lib/outcome-summary";

const expectedComponentCounts: Record<string, number[]> = {
  "a1-1": [3, 3, 3, 3, 3, 3],
  "a1-2": [1, 8, 8, 1, 1, 1],
  "a1-3": [3, 2, 2, 3, 3],
  "a2-1": [3, 1, 3, 3, 3],
  "a2-2": [6, 6, 6, 1, 6],
  "a2-3": [3, 4],
  "a2-4": [8, 7, 8],
  "a2-5": [1, 2, 2, 2, 2],
  "a2-6": [3, 5, 5, 4, 2, 4],
  "a3-1": [4, 4],
  "a3-2": [3, 3],
  "a3-3": [1, 1],
  "a3-4": [3, 3],
  "a3-5": [6, 6, 1, 1],
  "a3-6": [1, 1],
  "a3-7": [1, 6, 6, 1, 1],
  "a3-8": [1, 2, 2, 1],
  "a4-1": [1, 6, 6, 1, 1, 1],
  "a4-2": [1, 7, 7, 1, 1, 2],
  "a4-3": [11, 11],
  "a4-4": [3, 3],
  "a4-5": [1, 1, 2, 8],
  "a4-6": [2, 5],
  "a4-7": [2, 2],
};

const detailedIssueLabels = [
  "IMMIG: Civilian-refugee admissions",
  "HEALTH: Repeal of the Affordable Care Act",
  "UNEMPLOY: $600-per-week supplemental unemployment benefit",
  "COVID: Public face-mask requirement",
  "FOREIGN: Ban on Chinese-owned apps",
  "POLICE: Reallocation of police funding to social services",
  "BLACKWHITE[A-D]: Perceived racial fairness across institutions",
  "SEXISM1_2[A,B]: Attitudes about sexism and sexual-harassment allegations",
];

describe("splitNumberedItems", () => {
  it("extracts paragraph-separated and inline numbered components", () => {
    expect(splitNumberedItems("1. Supporters\n\n2. Candidates\n\n3. Smartness")).toEqual(["Supporters", "Candidates", "Smartness"]);
    expect(splitNumberedItems("1. Supporters 2. Candidates\n\n3. Smartness")).toEqual(["Supporters", "Candidates", "Smartness"]);
  });

  it("handles introductory headings, restarted numbering, and double-digit items", () => {
    expect(splitNumberedItems("Components: 1. First 2. Second")).toEqual(["Components: First", "Second"]);
    expect(splitNumberedItems("Self-reported measures: 1. Any contribution 2. Amount Validated measures: 1. Total 2. Last 30 days")).toEqual([
      "Self-reported measures: Any contribution",
      "Amount",
      "Validated measures: Total",
      "Last 30 days",
    ]);
    expect(splitNumberedItems("9. Ninth 10. Tenth 11. Eleventh")).toEqual(["Ninth", "Tenth", "Eleventh"]);
    expect(splitNumberedItems("  ")).toEqual([]);
  });
});

describe("curated record summaries", () => {
  it("covers every one of the 90 unique records with audited component counts and provenance", () => {
    const rows = outcomeTables.flatMap((table) => table.rows.map((row, index) => ({ table, row, index })));
    expect(rows).toHaveLength(90);
    expect(Object.keys(curatedRecordSummaries)).toHaveLength(90);

    for (const { table, row, index } of rows) {
      const summary = getCuratedRecordSummary(table, row);
      expect(summary, recordSummaryKey(table.id, row.paper)).toBeDefined();
      expect(summary.components).toHaveLength(expectedComponentCounts[table.id][index]);
      expect(summary.components.every((component) => component.label.trim() && component.sourceField && component.sourceItem)).toBe(true);
    }
  });

  it("keeps all three Affective Polarization components for Reshares", () => {
    const table = outcomeTables.find((candidate) => candidate.id === "a1-1")!;
    const row = table.rows.find((candidate) => candidate.paper.startsWith("Reshares"))!;
    const components = deriveRowSummary(table, row).components;
    expect(components).toHaveLength(3);
    expect(components.map((component) => component.label)).toEqual([
      "Feeling-thermometer difference: preferred-party supporters vs. other-party supporters",
      "Feeling-thermometer difference: people running for office for the preferred party vs. the other party",
      "Perceived-smartness difference: preferred-party supporters vs. other-party supporters",
    ]);
  });

  it("keeps corrected Polarization content and curated summary labels", () => {
    const affective = outcomeTables.find((table) => table.id === "a1-1")!;
    const issue = outcomeTables.find((table) => table.id === "a1-2")!;
    const chronologicalAffective = affective.rows.find((row) => row.paper.startsWith("Chronological Feed"))!;
    const deactivationAffective = affective.rows.find((row) => row.paper.startsWith("Deactivation"))!;
    const untrustworthyAffective = affective.rows.find((row) => row.paper.startsWith("Untrustworthy"))!;
    const chronologicalIssue = issue.rows.find((row) => row.paper.startsWith("Chronological Feed"))!;
    const adIssue = issue.rows.find((row) => row.paper.startsWith("Ad Experimental"))!;
    const deactivationIssue = issue.rows.find((row) => row.paper.startsWith("Deactivation"))!;
    const likemindedIssue = issue.rows.find((row) => row.paper.startsWith("Likeminded"))!;
    const resharesIssue = issue.rows.find((row) => row.paper.startsWith("Reshares"))!;

    expect(chronologicalAffective.pages).toContain("S-57, S-58, S-59, S-60 (pooled treatment effects, across specifications, Instagram)");
    expect(chronologicalAffective.pages).not.toContain("pooled treatment effects, pooled, across specifications, Instagram");
    expect(deactivationAffective.waves).toBe("Wave 4 (main analyses)\n\nWave 5 (post-endline analyses)");
    expect(untrustworthyAffective.method).toContain("2. Omit Question (3) because it was only asked in Wave 4");
    expect(untrustworthyAffective.method).toContain("3. Main outcome combines the W4 and W5 for Questions (1) and (2)");
    expect(deriveRowSummary(issue, chronologicalIssue).methods.every((method) => !method.label.toLocaleLowerCase().includes("factor analysis"))).toBe(true);
    expect(chronologicalIssue.method).toContain("factor analysis showed");
    expect(deriveRowSummary(issue, adIssue).components.map((component) => component.label)).toEqual(detailedIssueLabels);
    expect(deriveRowSummary(issue, deactivationIssue).components.map((component) => component.label)).toEqual(detailedIssueLabels);
    expect(likemindedIssue.waves).toBe("Wave 4");
    expect(splitNumberedItems(resharesIssue.method)).toHaveLength(3);
  });

  it("derives display data without mutating persisted records", () => {
    const snapshot = JSON.stringify(outcomeTables);
    const summaries = outcomeTables.flatMap((table) => table.rows.map((row) => deriveRowSummary(table, row)));
    expect(summaries).toHaveLength(90);
    expect(summaries.every((summary) => summary.components.length > 0 && summary.sources.length > 0)).toBe(true);
    expect(JSON.stringify(outcomeTables)).toBe(snapshot);
  });
});

describe("parseSourceEntries", () => {
  it("separates complex supplemental references and keeps each description", () => {
    expect(parseSourceEntries(
      "S-9 (variable description) S-17, S-19, (complier treatment effects with FB) S-53, S-54, S-55, S-56 (pooled treatment effects, across specifications, Facebook) S-57, S-58, S-59, S-60 (pooled treatment effects, pooled, across specifications, Instagram) S-77, S-78, S-79, S-80, S-81 (wave-by-wave treatment results)",
    )).toEqual([
      { reference: "S-9", description: "variable description" },
      { reference: "S-17, S-19", description: "complier treatment effects with FB" },
      { reference: "S-53, S-54, S-55, S-56", description: "pooled treatment effects, across specifications, Facebook" },
      { reference: "S-57, S-58, S-59, S-60", description: "pooled treatment effects, pooled, across specifications, Instagram" },
      { reference: "S-77, S-78, S-79, S-80, S-81", description: "wave-by-wave treatment results" },
    ]);
  });

  it("recognizes main and extended-data groups and handles unusual text safely", () => {
    expect(parseSourceEntries("S10 (variable description) Main Fig.3, Extended Data Fig. 4, Extended Data Table 3 (main treatment effects)"))
      .toEqual([
        { reference: "S10", description: "variable description" },
        { reference: "Main Fig.3, Extended Data Fig. 4, Extended Data Table 3", description: "main treatment effects" },
      ]);
    expect(parseSourceEntries("Appendix reference without a description")).toEqual([{ reference: "Appendix reference without a description", description: "" }]);
  });
});
