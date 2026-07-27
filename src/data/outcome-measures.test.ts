import { describe, expect, it } from "vitest";
import { outcomeCategories, outcomeTables } from "@/data/outcome-measures";

describe("outcome measures dataset", () => {
  it("contains the 24 planned tables in the expected category distribution", () => {
    expect(outcomeTables).toHaveLength(24);
    expect(
      Object.fromEntries(
        outcomeCategories.map((category) => [
          category,
          outcomeTables.filter((table) => table.category === category).length,
        ]),
      ),
    ).toEqual({ polarization: 3, participation: 6, trust: 8, knowledge: 7 });
  });

  it("retains exactly the five public row fields and omits the internal Questions column", () => {
    const expectedKeys = ["method", "pages", "paper", "questionsUsed", "waves"];

    for (const table of outcomeTables) {
      expect(table.rows.length).toBeGreaterThan(0);
      for (const row of table.rows) {
        expect(Object.keys(row).sort()).toEqual(expectedKeys);
        expect(row).not.toHaveProperty("questions");
        expect(row.paper.trim()).not.toBe("");
      }
    }
  });

  it("contains all 90 paper-level source records", () => {
    expect(outcomeTables.reduce((total, table) => total + table.rows.length, 0)).toBe(90);
  });

  it("uses the forthcoming citation for every Untrustworthy record", () => {
    const rows = outcomeTables.flatMap((table) => table.rows);
    const untrustworthyRows = rows.filter((row) => row.paper.startsWith("Untrustworthy (Bergeron-Boutin"));

    expect(untrustworthyRows).toHaveLength(16);
    expect(untrustworthyRows.every((row) => row.paper === "Untrustworthy (Bergeron-Boutin et al., forthcoming)")).toBe(true);
    expect(rows.some((row) => row.paper === "Untrustworthy (Bergeron-Boutin et al., working paper)")).toBe(false);
  });

  it("uses the 2026 citation for every Ad Experimental record", () => {
    const rows = outcomeTables.flatMap((table) => table.rows);
    const adExperimentalRows = rows.filter((row) => row.paper.startsWith("Ad Experimental"));

    expect(adExperimentalRows).toHaveLength(16);
    expect(adExperimentalRows.every((row) => row.paper === "Ad Experimental (Allcott et al., 2026)")).toBe(true);
    expect(rows.some((row) => row.paper === "Ad Experimental (Allcott et al., working paper)")).toBe(false);
  });
});
