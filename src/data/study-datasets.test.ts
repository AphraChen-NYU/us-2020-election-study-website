import { describe, expect, it } from "vitest";
import { peerReviewedPapers } from "@/data/peer-reviewed-papers";
import {
  studyDatasetAssociationCount,
  studyDatasetGroups,
  studyDatasets,
} from "@/data/study-datasets";

describe("study datasets", () => {
  it("stores all PDF associations while reusing the 54 verified dataset records", () => {
    expect(Object.keys(studyDatasets)).toHaveLength(54);
    expect(studyDatasetAssociationCount).toBe(67);
    expect(studyDatasetGroups.map((group) => group.datasets.length)).toEqual([
      14, 4, 7, 4, 3, 3, 5, 22, 0, 3, 2,
    ]);

    const occurrences = new Map<string, (typeof studyDatasetGroups)[number]["datasets"]>();
    for (const group of studyDatasetGroups) {
      for (const dataset of group.datasets) {
        const previous = occurrences.get(dataset.id);
        if (previous) {
          expect(previous[0]).toBe(dataset);
        } else {
          occurrences.set(dataset.id, [dataset]);
        }
      }
    }
  });

  it("follows publication order and appends Vote Choice as an additional forthcoming group", () => {
    expect(studyDatasetGroups.slice(0, 10).map((group) => group.paperId)).toEqual(
      peerReviewedPapers.map((paper) => paper.id),
    );
    expect(studyDatasetGroups.map((group) => group.studyLabel)).toEqual([
      "Segregation",
      "Chronological Feed",
      "Likeminded",
      "Reshares",
      "Deactivation",
      "Misinformation",
      "Ad Experimental",
      "Deceptive",
      "Untrustworthy",
      "Emotion",
      "Vote Choice",
    ]);
    expect(studyDatasetGroups.at(-1)).toEqual(
      expect.objectContaining({
        id: "vote-choice",
        paperId: null,
        studyLabel: "Vote Choice",
        title: "Vote Choice",
        status: "forthcoming",
      }),
    );
  });

  it("contains complete verified metadata for every populated record", () => {
    for (const dataset of Object.values(studyDatasets)) {
      expect(dataset.id).toMatch(/^\d+$/);
      expect(dataset.name.trim()).not.toBe("");
      expect(dataset.summary.trim()).not.toBe("");
      expect(dataset.url).toBe(
        `https://www.icpsr.umich.edu/sites/somar/view/studies/${dataset.id}/study-details`,
      );
      expect(dataset.doi).toMatch(/^https:\/\/doi\.org\/10\.3886\//);
      expect(dataset.citation).toContain(`“${dataset.name}.”`);
      expect(dataset.citation).toContain(dataset.doi);
      expect(dataset.citation).not.toContain(".. “");
    }
  });

  it("uses current metadata where the PDF contained wrapping artifacts or older wording", () => {
    expect(studyDatasets["300446"].name).toBe(
      "Passive-Tracking Participants' Daily Views of Facebook Posts with Civic News Domains",
    );
    expect(studyDatasets["300466"].summary).toBe(
      "Researchers at New York University, the University of Texas at Austin, and other academic institutions, as well as Meta, partnered with NORC at the University of Chicago to understand more about how the information people see on Facebook and Instagram affects their opinions and behaviors. This dataset contains survey data associated with the U.S. 2020 Facebook and Instagram Election Study.",
    );
  });

  it("keeps Untrustworthy as the only empty current-publication group", () => {
    const emptyGroups = studyDatasetGroups.filter((group) => group.datasets.length === 0);
    expect(emptyGroups.map((group) => group.id)).toEqual(["untrustworthy"]);
  });
});
