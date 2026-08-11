import { describe, expect, it } from "vitest";
import { outcomeTables } from "@/data/outcome-measures";
import { curatedRecordSummaries, getCuratedRecordSummary, recordSummaryKey } from "@/data/record-summaries";
import { parseDetailOutline } from "@/lib/detail-outline";
import { deriveRowSummary, parseSourceEntries, splitNumberedItems } from "@/lib/outcome-summary";

const expectedComponentCounts: Record<string, number[]> = {
  "a1-1": [3, 3, 3, 3, 3, 3],
  "a1-2": [1, 8, 8, 1, 1, 1],
  "a1-3": [3, 2, 2, 3, 3],
  "a2-1": [0, 0, 0, 0, 0],
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
    const adIssue = issue.rows.find((row) => row.paper.startsWith("Ads Experimental"))!;
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

  it("keeps corrected Participation content and spacing", () => {
    const table = (id: string) => outcomeTables.find((candidate) => candidate.id === id)!;
    const row = (tableId: string, paper: string) => table(tableId).rows.find((candidate) => candidate.paper.startsWith(paper))!;

    expect(table("a2-1").rows.map((candidate) => candidate.waves)).toEqual([
      "Participants who completed both Waves 1–2 and at least one of post-treatment surveys",
      "Participants who completed Waves 1–2 and Wave 4",
      "Participants who completed both Waves 1–2 and one of post-election surveys",
      "Participants who completed Waves 1–2 and one of post-treatment surveys",
      "Participants who completed Waves 1–2 and one of post-treatment surveys",
    ]);
    expect(table("a2-1").rows.every((candidate) => deriveRowSummary(table("a2-1"), candidate).components.length === 0)).toBe(true);
    expect(row("a2-1", "Untrustworthy").method).toContain("Mac and Android systems");

    expect(row("a2-2", "Chronological Feed").questionsUsed).toContain("they know\n\n(POLPART 1 W4");
    expect(row("a2-2", "Ads Experimental").questionsUsed).toContain("(POLPART_2)\n\n3. Signed");
    expect(row("a2-2", "Ads Experimental").method).toContain("binary questions\n\n2. Standardized");
    expect(row("a2-2", "Likeminded").waves).toBe("Wave 4");
    expect(row("a2-2", "Untrustworthy").questionsUsed).toContain("you know\n\n(survey item POLPART)");
    expect(table("a2-2").rows.every((candidate) => deriveRowSummary(table("a2-2"), candidate).methods.every((method) => method.label !== "Binary coding"))).toBe(true);

    expect(row("a2-3", "Ads Experimental").questionsUsed).toContain("(CONTRIBUT)\n\nValidated measures:");
    expect(row("a2-3", "Ads Experimental").method).toContain("coded as $1500\n\nValidated contribution:");
    expect(deriveRowSummary(table("a2-3"), row("a2-3", "Ads Experimental")).methods.every((method) => !method.label.toLocaleLowerCase().includes("binned contributions"))).toBe(true);
    expect(row("a2-3", "Deactivation").questionsUsed).toContain("(CONTRIBUT)\n\nValidated measures:\n\n1.");
    expect(row("a2-3", "Deactivation").method).toContain("More than $1000)\n\nValidated contribution:");
    expect(deriveRowSummary(table("a2-3"), row("a2-3", "Deactivation")).methods.map((method) => method.label)).toEqual([
      "Self-reported measure",
      "Validated against administrative records",
    ]);

    expect(table("a2-4").rows.map((candidate) => candidate.waves)).toEqual([
      "Participants who completed the baseline Wave 1 and 2 surveys and at least one of post-treatment surveys",
      "Participants who completed Waves 1–2 and Wave 4",
      "Participants who completed Waves 1–2 and one of post-election surveys",
    ]);
    expect(row("a2-4", "Chronological Feed").questionsUsed).toContain("commenting/resharing");
    expect(deriveRowSummary(table("a2-4"), row("a2-4", "Chronological Feed")).methods.map((method) => method.label)).toEqual([
      "PCA",
      "Varimax rotation",
      "Index of on-platform political engagement",
    ]);
    expect(row("a2-4", "Ads Experimental").questionsUsed.startsWith("1. Engagement with civic content")).toBe(true);
    expect(row("a2-4", "Ads Experimental").questionsUsed).toContain("comments/reshares\n\n2. Engagement with Voter Hub");
    expect(row("a2-4", "Likeminded").method).toContain("views of civic content");
    expect(deriveRowSummary(table("a2-4"), row("a2-4", "Likeminded")).methods.map((method) => method.label)).toEqual([
      "Exploratory factor analysis",
      "Varimax rotation",
      "The average of standardized measures",
    ]);

    expect(deriveRowSummary(table("a2-5"), row("a2-5", "Chronological Feed")).components.map((component) => component.label)).toEqual([
      "Self-reported voting in the 2020 presidential election",
    ]);
    expect(row("a2-5", "Ads Experimental").waves).toBe("Wave 4");
    expect(row("a2-5", "Deactivation").waves).toBe("Wave 4");
    expect(row("a2-5", "Likeminded").waves).toBe("-");
    expect(row("a2-5", "Untrustworthy").waves).toBe("Wave 4 and Wave 5 (pooled for self-reported)");

    expect(row("a2-6", "Chronological Feed").waves).toBe("Trump favorability (Waves 3–5)\n\nParty-line presidential voting (Waves 4–5)\n\nParty-line downballot voting (Waves 4–5)");
    expect(deriveRowSummary(table("a2-6"), row("a2-6", "Chronological Feed")).methods.map((method) => method.label)).toEqual([
      "Self-reported measures",
      "binary coding for presidential voting",
      "sum of votes for downballot voting",
    ]);
    expect(row("a2-6", "Ads Experimental").questionsUsed).toContain("more than one office out of Senate");
    expect(row("a2-6", "Ads Experimental").method).toContain("otherwise (including did not vote)");
    expect(row("a2-6", "Likeminded").waves).toContain("Waves 4 and 5)\n\nFeeling thermometer ratings");
    expect(deriveRowSummary(table("a2-6"), row("a2-6", "Reshares")).methods.map((method) => method.label)).toEqual([
      "Binary coding for party-line presidential voting",
      "Sum of votes for party-line downballot voting",
    ]);
    expect(row("a2-6", "Reshares").pages).toContain("S-9 (variable descriptions for party-line presidential voting and party-line downballot voting)");
    expect(row("a2-6", "Untrustworthy").waves).toBe("Presidential and down-ballot vote choices (Wave 4 and 5)\n\nFeeling thermometers (Wave 4)");
  });

  it("keeps corrected Trust content, spacing, summaries, and tones", () => {
    const table = (id: string) => outcomeTables.find((candidate) => candidate.id === id)!;
    const row = (tableId: string, paper: string) => table(tableId).rows.find((candidate) => candidate.paper.startsWith(paper))!;
    const methods = (tableId: string, paper: string) => deriveRowSummary(table(tableId), row(tableId, paper)).methods;

    for (const paper of ["Chronological Feed", "Reshares"]) {
      expect(row("a3-1", paper).questionsUsed).toContain("mail-in voting\n\n(ELECTWIN_W5");
    }

    expect(methods("a3-2", "Likeminded")).toEqual([
      { label: "Exploratory factor analysis", tone: "analysis" },
      { label: "Varimax rotation", tone: "rotation" },
      { label: "Average of standardized measures", tone: "aggregation" },
      { label: "Inferred partisanship", tone: "general" },
      { label: "Belief that registered voters were prevented from voting and that this affected election outcomes was excluded from the scale because it did not load with other items and was evaluated separately", tone: "restriction" },
    ]);
    expect(methods("a3-2", "Untrustworthy")).toEqual([
      { label: "Factor analysis", tone: "analysis" },
      { label: "Varimax rotation", tone: "rotation" },
      { label: "Average of standardized measures", tone: "aggregation" },
      { label: "Self-reported partisanship", tone: "selfReport" },
      { label: "Belief that registered voters were prevented from voting and that this affected election outcomes was excluded from the scale", tone: "restriction" },
    ]);
    for (const paper of ["Likeminded", "Untrustworthy"]) {
      expect(row("a3-2", paper).method).toContain("Excluded items include:\n\n(a)");
      expect(row("a3-2", paper).method).toContain("\n\n(b) Asked only");
    }
    expect(methods("a3-2", "Untrustworthy").every((method) => !method.label.includes("ELECTWIN"))).toBe(true);

    expect(methods("a3-3", "Likeminded")).toEqual([
      { label: "Standardized measure", tone: "transformation" },
      { label: "Inferred ideology", tone: "general" },
    ]);
    expect(methods("a3-3", "Untrustworthy")).toEqual([
      { label: "Standardized measure", tone: "transformation" },
      { label: "Self-reported partisanship", tone: "selfReport" },
    ]);
    expect(methods("a3-4", "Likeminded")).toEqual([
      { label: "Exploratory factor analysis", tone: "analysis" },
      { label: "Varimax rotation", tone: "rotation" },
      { label: "Average of standardized measures", tone: "aggregation" },
      { label: "Inferred ideology", tone: "general" },
    ]);
    expect(methods("a3-4", "Untrustworthy")).toEqual([
      { label: "Factor analysis", tone: "analysis" },
      { label: "Varimax rotation", tone: "rotation" },
      { label: "Average of standardized measures", tone: "aggregation" },
      { label: "Self-reported partisanship", tone: "selfReport" },
    ]);

    expect(row("a3-5", "Likeminded").waves).toBe("Wave 4-5 (pooled)");
    expect(row("a3-5", "Untrustworthy").waves).toBe("Main analyses: Wave 4-5 (pooled)\n\nAuxiliary analyses: Wave 5");
    expect(row("a3-5", "Untrustworthy").method).toContain("1. Main Analyses:\n\n1) Because");
    expect(row("a3-5", "Untrustworthy").method).toContain("\n\n2) Standardized measure\n\n2. Auxiliary Analyses:");
    expect(row("a3-5", "Untrustworthy").method).not.toContain("(?)");
    expect(methods("a3-5", "Untrustworthy")).toEqual([
      { label: "Standardized measure", tone: "transformation" },
      { label: "Average of standardized measures", tone: "aggregation" },
    ]);

    for (const paper of ["Chronological Feed", "Reshares"]) {
      expect(row("a3-6", paper).waves).toBe("Wave 3 and Wave 5 (pooled)");
    }
    expect(row("a3-6", "Chronological Feed").pages).toContain("Main Fig. 3");
    expect(row("a3-6", "Chronological Feed").pages).toContain("wave-specific treatment effects");
    expect(row("a3-6", "Chronological Feed").pages).not.toContain("specifica treatment");

    for (const paper of ["Chronological Feed", "Reshares"]) {
      expect(row("a3-7", paper).questionsUsed).toContain("CNN\n\n(INFOTRUSTA W4");
    }
    expect(row("a3-7", "Untrustworthy").questionsUsed).toContain("news\n\n(INFOTRUST SOURCE)");
    expect(row("a3-7", "Untrustworthy").pages).toContain("Main Figure 3");
    expect(row("a3-7", "Untrustworthy").pages).toContain("wave-specific treatment effects");
    expect(row("a3-7", "Untrustworthy").pages).not.toContain("Figue");

    for (const paper of ["Chronological Feed", "Reshares"]) {
      expect(row("a3-8", paper).questionsUsed).toContain("Twitter\n\n(INFOTRUSTC W4");
    }
    expect(row("a3-8", "Chronological Feed").waves).toBe("Wave 4 and Wave 5 (pooled)");
    expect(row("a3-8", "Deactivation").method).toMatch(/^1\. Each response/);
    expect(methods("a3-8", "Deactivation")).toContainEqual({ label: "Recoded to 0-1", tone: "coding" });
  });

  it("preserves the all-table proofreading corrections", () => {
    const table = (id: string) => outcomeTables.find((candidate) => candidate.id === id)!;
    const row = (tableId: string, paper: string) => table(tableId).rows.find((candidate) => candidate.paper.startsWith(paper))!;
    const dataset = JSON.stringify(outcomeTables);
    const confirmedDefects = [
      "responses resigned",
      "question was resigned",
      "tratment effects",
      "computed by subtraction",
      "Measured total web visits",
      "passive tracing data",
      "average of the standard measures",
      "civil content engagement",
      "principle components",
      "Republkican",
      "Probaby",
      "should not conced (",
      "Repubican",
      "93 if Democrat",
      "standardizd",
      "Government protests",
      "USEDEMOCF",
      "A index using",
      "treattment",
      "SPECKNOW EVD",
      "an six-question",
      "campan season",
      "Hunter Bidens’",
      "standardize d",
      "operationali zed",
      "correspondi ng",
      "wave-by-wa ve",
      "Ture COVID",
      "four-scale",
      "sclae",
      "a women",
      "while supremacists",
      "Donal Trump",
    ];

    for (const defect of confirmedDefects) {
      expect(dataset, defect).not.toContain(defect);
    }

    expect(row("a1-1", "Reshares").questionsUsed).toContain("FT PEOPD W5]\n\n2. Difference");
    expect(row("a1-1", "Untrustworthy").questionsUsed).toContain("FT-PEOPC, FT-PEOPD]");
    expect(row("a1-2", "Ads Experimental").method).toContain("\n\n3. Respondents");
    expect(row("a2-6", "Reshares").questionsUsed).toMatch(/VOTEGOV_W5\)$/);
    expect(row("a3-5", "Ads Experimental").questionsUsed).toContain("USDEMOCD)\n\n5. Elections");
    expect(row("a3-5", "Ads Experimental").questionsUsed).toContain("USDEMOCF)");
    expect(row("a4-1", "Ads Experimental").questionsUsed).toContain("$15 per hour\n\n3. SPECKNOWPOC");
    expect(row("a4-2", "Ads Experimental").questionsUsed).toContain("COVID-related restrictions\n\n2. SPECKNOWEVB");
    for (const paper of ["Ads Experimental", "Deactivation"]) {
      expect(row("a4-3", paper).questionsUsed).toContain("COVID-19\n\n6. MISINFOF");
      expect(row("a4-3", paper).questionsUsed).toContain("Hunter Biden’s laptop");
    }
    expect(row("a4-5", "Reshares").questionsUsed).toMatch(/MISINFO7 W3\)$/);
  });

  it("keeps corrected Knowledge spacing, nested details, summaries, and tones", () => {
    const table = (id: string) => outcomeTables.find((candidate) => candidate.id === id)!;
    const row = (tableId: string, paper: string) => table(tableId).rows.find((candidate) => candidate.paper.startsWith(paper))!;
    const methods = (tableId: string, paper: string) => deriveRowSummary(table(tableId), row(tableId, paper)).methods;

    for (const paper of ["Chronological Feed", "Reshares"]) {
      expect(row("a4-1", paper).questionsUsed).toContain("policy positions\n\n(SPECKNOWPOA W4");
      expect(row("a4-2", paper).questionsUsed).toContain("did not occur\n\n(SPECKNOWEVA W4");
      expect(row("a4-5", paper).questionsUsed).toContain("time of the study\n\n(MISINFOI W4");
    }

    expect(row("a4-2", "Likeminded").questionsUsed).toContain("currently in the news\n\n(SPECKNOWPO)");
    expect(row("a4-2", "Untrustworthy").questionsUsed).toContain("three did not.\n\n(SPECKNOWEVENT-[ITEM])");
    expect(row("a4-2", "Untrustworthy").questionsUsed).toContain("currently in the news\n\n(SPECKNOWPO)");

    const a43Methods = [{ label: "Standardized average score", tone: "aggregation" }];
    for (const paper of ["Ads Experimental", "Deactivation"]) {
      expect(methods("a4-3", paper)).toEqual(a43Methods);
      const outline = parseDetailOutline(row("a4-4", paper).questionsUsed);
      expect(outline.items.map((item) => item.children.length)).toEqual([6, 7, 11]);
      expect(outline.items[0].children[0].text).toMatch(/^SPECKNOWPOA:/);
      expect(outline.items[1].children[0].text).toMatch(/^SPECKNOWEVA:/);
      expect(outline.items[2].children[0].text).toMatch(/^MISINFOA:/);
    }

    expect(row("a4-5", "Likeminded").questionsUsed.match(/\n\n\(MISINFO\)/g)).toHaveLength(2);
    expect(row("a4-6", "Likeminded").questionsUsed.match(/\n\n\(MISINFO\)/g)).toHaveLength(2);
    expect(row("a4-6", "Untrustworthy").waves).toBe("Wave 4");

    const a47Methods = [
      { label: "Pro-attitudinal knowledge: difference between mean belief in true and false claims", tone: "coding" },
      { label: "Pro-attitudinal false beliefs: mean belief in false claims", tone: "aggregation" },
    ];
    expect(row("a4-7", "Likeminded").questionsUsed.match(/\n\n\(MISINFO\)/g)).toHaveLength(2);
    expect(row("a4-7", "Untrustworthy").questionsUsed).toContain("adult film star (T)\n\n(MISINFO-C");
    expect(row("a4-7", "Untrustworthy").questionsUsed).toContain("masks in public (T)\n\n(MISINFO-A");
    for (const paper of ["Likeminded", "Untrustworthy"]) {
      expect(methods("a4-7", paper)).toEqual(a47Methods);
      const outline = parseDetailOutline(row("a4-7", paper).method);
      expect(outline.items).toHaveLength(2);
      expect(outline.items.map((item) => item.children.length)).toEqual([3, 3]);
      expect(outline.items.flatMap((item) => item.children).every((child) => child.kind === "alpha")).toBe(true);
    }
  });

  it("uses the requested Trump-favorability summary for both experimental papers", () => {
    const votePreference = outcomeTables.find((table) => table.id === "a2-6")!;
    const expected = "Trump favorability: (a) average of standardized values; (b) self-reported approval coded 1–5; (c) absolute difference between thermometer ratings";
    for (const paper of ["Ads Experimental", "Deactivation"]) {
      const candidate = votePreference.rows.find((row) => row.paper.startsWith(paper))!;
      expect(deriveRowSummary(votePreference, candidate).methods.map((method) => method.label)).toContain(expected);
    }
  });

  it("derives display data without mutating persisted records", () => {
    const snapshot = JSON.stringify(outcomeTables);
    const summaries = outcomeTables.flatMap((table) => table.rows.map((row) => deriveRowSummary(table, row)));
    expect(summaries).toHaveLength(90);
    expect(summaries.every((summary) => summary.sources.length > 0)).toBe(true);
    expect(summaries.filter((summary) => summary.components.length === 0)).toHaveLength(5);
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
