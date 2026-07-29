import { describe, expect, it } from "vitest";
import { peerReviewedPapers } from "@/data/peer-reviewed-papers";
import { getCitationText } from "@/lib/publication-citation";

describe("peer-reviewed papers dataset", () => {
  it("orders published papers oldest first, alphabetizes exact ties, and places forthcoming papers last", () => {
    expect(peerReviewedPapers.map((paper) => paper.studyLabel)).toEqual([
      "Segregation",
      "Chronological Feed",
      "Likeminded",
      "Reshares",
      "Deactivation",
      "Misinformation",
      "Ad Experimental",
      "Deceptive",
      "Emotion",
      "Untrustworthy",
    ]);
    expect(peerReviewedPapers.map((paper) => paper.publicationDate)).toEqual([
      "2023-07-27",
      "2023-07-27",
      "2023-07-27",
      "2023-07-27",
      "2024-05-13",
      "2024-12-11",
      "2026-03-02",
      "2026-04-06",
      null,
      null,
    ]);
  });

  it("stores exact ascending ISO dates for all published papers", () => {
    const published = peerReviewedPapers.filter((paper) => paper.status === "published");
    const dates = published.map((paper) => paper.publicationDate);

    expect(dates.every((date) => /^\d{4}-\d{2}-\d{2}$/.test(date ?? ""))).toBe(true);
    expect(dates).toEqual([...dates].sort());
  });

  it("alphabetizes the four papers first published on July 27, 2023 by full title", () => {
    expect(
      peerReviewedPapers
        .filter((paper) => paper.publicationDate === "2023-07-27")
        .map((paper) => paper.title),
    ).toEqual([
      "Asymmetric ideological segregation in exposure to political news on Facebook",
      "How do social media feed algorithms affect attitudes and behavior in an election campaign?",
      "Like-minded sources on Facebook are prevalent but not polarizing",
      "Reshares on social media amplify political news but do not detectably affect beliefs or opinions",
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

  it("has eight published papers and two forthcoming papers with verified available links", () => {
    const published = peerReviewedPapers.filter((paper) => paper.status === "published");
    const forthcoming = peerReviewedPapers.filter((paper) => paper.status === "forthcoming");

    expect(published).toHaveLength(8);
    expect(
      published.every(
        (paper) =>
          paper.publicationLinks.length === 1 &&
          paper.publicationLinks.every((link) => link.url.startsWith("https://")),
      ),
    ).toBe(true);
    expect(published.every((paper) => paper.journal && paper.year)).toBe(true);
    expect(forthcoming.map((paper) => paper.id)).toEqual(["emotion", "untrustworthy"]);
    expect(forthcoming.find((paper) => paper.id === "emotion")).toEqual(
      expect.objectContaining({
        publicationLinks: [
          {
            label: "Forthcoming (AEA)",
            url: "https://www.aeaweb.org/articles?id=10.1257/pol.20240806&&from=f",
          },
          {
            label: "Working paper (NBER PDF)",
            url: "https://www.nber.org/system/files/working_papers/w33697/w33697.pdf",
          },
        ],
        journal: "American Economic Journal: Economic Policy",
        year: null,
      }),
    );
    expect(forthcoming.find((paper) => paper.id === "untrustworthy")).toEqual(
      expect.objectContaining({ publicationLinks: [], journal: null, year: null }),
    );
  });

  it("uses the verified 2026 advertising-paper metadata", () => {
    const advertisingPaper = peerReviewedPapers.find((paper) => paper.id === "ad-experimental");

    expect(advertisingPaper).toEqual(
      expect.objectContaining({
        title: "The effects of political advertising on Facebook and Instagram before the 2020 US election",
        journal: "Nature Human Behaviour",
        year: 2026,
        publicationLinks: [
          {
            label: "Journal article",
            url: "https://www.nature.com/articles/s41562-025-02328-w",
          },
        ],
      }),
    );
    expect(advertisingPaper?.authors[0]).toBe("Hunt Allcott");
  });

  it("stores verified volume, issue, locator, and DOI metadata", () => {
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
        id: "segregation",
        volume: "381",
        issue: "6656",
        locator: "392–398",
        doi: "https://doi.org/10.1126/science.ade7138",
      },
      {
        id: "chronological-feed",
        volume: "381",
        issue: "6656",
        locator: "398–404",
        doi: "https://doi.org/10.1126/science.abp9364",
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
        id: "deactivation",
        volume: "121",
        issue: "21",
        locator: "e2321584121",
        doi: "https://doi.org/10.1073/pnas.2321584121",
      },
      {
        id: "misinformation",
        volume: "11",
        issue: null,
        locator: "1124–1146",
        doi: "https://doi.org/10.15195/v11.a41",
      },
      {
        id: "ad-experimental",
        volume: "10",
        issue: "5",
        locator: "884–895",
        doi: "https://doi.org/10.1038/s41562-025-02328-w",
      },
      {
        id: "deceptive",
        volume: "10",
        issue: "6",
        locator: "1068–1082",
        doi: "https://doi.org/10.1038/s41562-026-02435-2",
      },
      {
        id: "emotion",
        volume: null,
        issue: null,
        locator: null,
        doi: "https://doi.org/10.1257/pol.20240806",
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
