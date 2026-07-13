import { describe, expect, it } from "vitest";
import { curatedRecordSummaries } from "@/data/record-summaries";
import { outcomeTables } from "@/data/outcome-measures";
import { methodToneStyles } from "@/lib/method-tag-palette";
import { deriveMethodTags, deriveRowSummary } from "@/lib/outcome-summary";

function luminance(hex: string) {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((channel) => Number.parseInt(channel, 16) / 255) ?? [];
  const linear = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(first: string, second: string) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

describe("method-tag palette", () => {
  it("classifies representative methods into all nine logical families", () => {
    const cases = [
      ["Principal components analysis", "PCA", "analysis"],
      ["Principal components analysis with varimax rotation", "Varimax rotation", "rotation"],
      ["Average of standardized measures", "Average of standardized measures", "aggregation"],
      ["Responses were re-signed so higher values indicate party congeniality", "Direction aligned to party congeniality", "transformation"],
      ["Binary measure", "Binary coding", "coding"],
      ["Matched survey participants to voter file data", "Validated against administrative records", "validation"],
      ["Excluded respondents without a party lean", "Excluded respondents without a party lean", "restriction"],
      ["Self-reported measure", "Self-reported measure", "selfReport"],
      ["Calculated using a paper-specific procedure", "Calculated using a paper-specific procedure", "general"],
    ] as const;

    for (const [method, label, tone] of cases) {
      expect(deriveMethodTags(method)).toContainEqual({ label, tone });
    }
  });

  it("keeps identical labels in one stable family across every record", () => {
    const tonesByLabel = new Map<string, Set<string>>();
    for (const table of outcomeTables) {
      for (const row of table.rows) {
        for (const method of deriveRowSummary(table, row).methods) {
          const tones = tonesByLabel.get(method.label) ?? new Set<string>();
          tones.add(method.tone);
          tonesByLabel.set(method.label, tones);
        }
      }
    }

    for (const [label, tones] of tonesByLabel) {
      expect(tones.size, label).toBe(1);
    }
  });

  it("supports every curated tone and every palette family", () => {
    expect(Object.keys(methodToneStyles).sort()).toEqual([
      "aggregation",
      "analysis",
      "coding",
      "general",
      "restriction",
      "rotation",
      "selfReport",
      "transformation",
      "validation",
    ]);

    for (const summary of Object.values(curatedRecordSummaries)) {
      for (const method of summary.methods ?? []) {
        expect(methodToneStyles).toHaveProperty(method.tone);
      }
    }
  });

  it("meets contrast targets for text, borders, and dots", () => {
    for (const [tone, style] of Object.entries(methodToneStyles)) {
      expect(contrast(style.text, style.background), `${tone} text`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(style.border, style.background), `${tone} border`).toBeGreaterThanOrEqual(3);
      expect(style.dotClassName, `${tone} dot`).toContain(style.border);
    }
  });
});
