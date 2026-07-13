import { describe, expect, it } from "vitest";
import { parseDetailOutline } from "@/lib/detail-outline";

describe("parseDetailOutline", () => {
  it("groups dash-prefixed components beneath numbered measures", () => {
    expect(parseDetailOutline("Overview\n\n1. Election knowledge\n\n- SPECKNOWPOA: First\n\n- SPECKNOWPOB: Second\n\n2. News knowledge\n\n- SPECKNOWEVA: Third")).toEqual({
      introduction: ["Overview"],
      items: [
        {
          number: "1",
          text: "Election knowledge",
          children: [
            { kind: "bullet", text: "SPECKNOWPOA: First" },
            { kind: "bullet", text: "SPECKNOWPOB: Second" },
          ],
        },
        {
          number: "2",
          text: "News knowledge",
          children: [{ kind: "bullet", text: "SPECKNOWEVA: Third" }],
        },
      ],
    });
  });

  it("groups alphabetical construction steps beneath numbered methods", () => {
    const outline = parseDetailOutline("1. Knowledge score:\n\n(a) Difference score\n\n(b) Inferred ideology\n\n(c) Standardized\n\n2. False beliefs:\n\n(a) Mean score\n\n(b) Inferred ideology\n\n(c) Standardized");

    expect(outline.items).toHaveLength(2);
    expect(outline.items.map((item) => item.children.map((child) => child.kind))).toEqual([
      ["alpha", "alpha", "alpha"],
      ["alpha", "alpha", "alpha"],
    ]);
    expect(outline.items.map((item) => item.children.length)).toEqual([3, 3]);
  });
});
