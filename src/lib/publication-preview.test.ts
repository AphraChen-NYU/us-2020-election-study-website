import { describe, expect, it } from "vitest";
import {
  ABSTRACT_PREVIEW_CHARACTER_LIMIT,
  DATASET_SUMMARY_PREVIEW_CHARACTER_LIMIT,
  getAbstractPreview,
  getAuthorPreview,
  getDatasetSummaryPreview,
} from "@/lib/publication-preview";

describe("publication previews", () => {
  it("returns the first three authors without changing their text or order", () => {
    const authors = ["Author One", "Author Two", "Author Three", "Author Four"];

    expect(getAuthorPreview(authors)).toEqual(authors.slice(0, 3));
    expect(authors).toEqual(["Author One", "Author Two", "Author Three", "Author Four"]);
  });

  it("returns an exact whole-word prefix within the character limit", () => {
    const abstract = `${"A complete source word ".repeat(20)}Final sentence.`;
    const preview = getAbstractPreview(abstract);

    expect(preview.length).toBeLessThanOrEqual(ABSTRACT_PREVIEW_CHARACTER_LIMIT);
    expect(abstract.startsWith(preview)).toBe(true);
    expect(abstract.at(preview.length)).toBe(" ");
    expect(preview.endsWith(" ")).toBe(false);
  });

  it("returns the complete abstract when it is within the character limit", () => {
    const abstract = "This complete abstract is already short.";

    expect(getAbstractPreview(abstract)).toBe(abstract);
  });

  it("uses the same exact whole-word prefix behavior for dataset summaries", () => {
    const summary = `${"A complete dataset summary word ".repeat(20)}Final sentence.`;
    const preview = getDatasetSummaryPreview(summary);

    expect(preview.length).toBeLessThanOrEqual(DATASET_SUMMARY_PREVIEW_CHARACTER_LIMIT);
    expect(summary.startsWith(preview)).toBe(true);
    expect(summary.at(preview.length)).toBe(" ");
    expect(preview.endsWith(" ")).toBe(false);
  });
});
