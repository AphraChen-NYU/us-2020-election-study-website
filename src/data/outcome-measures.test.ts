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
});
