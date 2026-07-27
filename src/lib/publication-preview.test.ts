import { describe, expect, it } from "vitest";
import {
  ABSTRACT_PREVIEW_CHARACTER_LIMIT,
  getAbstractPreview,
  getAuthorPreview,
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
});
