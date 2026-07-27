import { describe, expect, it } from "vitest";
import { peerReviewedPapers } from "@/data/peer-reviewed-papers";
import { getCitationText } from "@/lib/publication-citation";

describe("peer-reviewed papers dataset", () => {
  it("contains the six supplied study papers in source order", () => {
    expect(peerReviewedPapers.map((paper) => paper.studyLabel)).toEqual([
      "Ad Experimental",
      "Chronological Feed",
      "Deactivation",
      "Likeminded",
      "Reshares",
      "Untrustworthy",
    ]);
  });

  it("contains complete publication information for every paper", () => {
    for (const paper of peerReviewedPapers) {
      expect(paper.title.trim()).not.toBe("");
      expect(paper.authors.length).toBeGreaterThan(0);
      expect(paper.authors.every((author) => author.trim() !== "")).toBe(true);
      expect(paper.abstract.trim()).not.toBe("");
      expect(getCitationText(paper).trim()).not.toBe("");
    }
  });

  it("has five verified publication links and one forthcoming paper", () => {
    const published = peerReviewedPapers.filter((paper) => paper.status === "published");
    const forthcoming = peerReviewedPapers.filter((paper) => paper.status === "forthcoming");

    expect(published).toHaveLength(5);
    expect(published.every((paper) => paper.publicationUrl?.startsWith("https://"))).toBe(true);
    expect(published.every((paper) => paper.journal && paper.year)).toBe(true);
    expect(forthcoming).toEqual([
      expect.objectContaining({
        id: "untrustworthy",
        publicationUrl: null,
        journal: null,
        year: null,
      }),
    ]);
  });

  it("uses the verified 2026 advertising-paper metadata", () => {
    expect(peerReviewedPapers[0]).toEqual(
      expect.objectContaining({
        title: "The effects of political advertising on Facebook and Instagram before the 2020 US election",
        journal: "Nature Human Behaviour",
        year: 2026,
        publicationUrl: "https://www.nature.com/articles/s41562-025-02328-w",
      }),
    );
    expect(peerReviewedPapers[0].authors[0]).toBe("Hunt Allcott");
  });

  it("stores verified volume, issue, locator, and DOI metadata for published papers", () => {
    expect(
      peerReviewedPapers.map(({ id, citation }) => ({
        id,
        volume: citation.volume,
        issue: citation.issue,
        locator: citation.locator,
        doi: citation.doi,
      })),
    ).toEqual([
      {
        id: "ad-experimental",
        volume: "10",
        issue: "5",
        locator: "884–895",
        doi: "https://doi.org/10.1038/s41562-025-02328-w",
      },
      {
        id: "chronological-feed",
        volume: "381",
        issue: "6656",
        locator: "398–404",
        doi: "https://doi.org/10.1126/science.abp9364",
      },
      {
        id: "deactivation",
        volume: "121",
        issue: "21",
        locator: "e2321584121",
        doi: "https://doi.org/10.1073/pnas.2321584121",
      },
      {
        id: "likeminded",
        volume: "620",
        issue: "7972",
        locator: "137–144",
        doi: "https://doi.org/10.1038/s41586-023-06297-w",
      },
      {
        id: "reshares",
        volume: "381",
        issue: "6656",
        locator: "404–408",
        doi: "https://doi.org/10.1126/science.add8424",
      },
      {
        id: "untrustworthy",
        volume: null,
        issue: null,
        locator: null,
        doi: null,
      },
    ]);
  });
});
