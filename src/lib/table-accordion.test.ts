import { describe, expect, it } from "vitest";
import { outcomeTables } from "@/data/outcome-measures";
import { resolveVisibleOpenTable } from "@/lib/table-accordion";

describe("resolveVisibleOpenTable", () => {
  it("keeps all tables collapsed when no table has been selected", () => {
    expect(resolveVisibleOpenTable("", outcomeTables)).toBe("");
  });

  it("preserves an explicitly opened table while it remains visible", () => {
    expect(resolveVisibleOpenTable("a1-1", outcomeTables)).toBe("a1-1");
  });

  it("collapses the accordion when the opened table is filtered out", () => {
    const knowledgeTables = outcomeTables.filter((table) => table.category === "knowledge");
    expect(resolveVisibleOpenTable("a1-1", knowledgeTables)).toBe("");
  });
});
