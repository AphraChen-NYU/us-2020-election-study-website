// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import VariableThemePage, { generateStaticParams } from "@/app/variable-operationalization/[category]/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/variable-operationalization/polarization",
  notFound: () => {
    throw new Error("not found");
  },
}));

afterEach(cleanup);

describe("variable operationalization category pages", () => {
  it("generates all four category routes", () => {
    expect(generateStaticParams()).toEqual([
      { category: "polarization" },
      { category: "participation" },
      { category: "trust" },
      { category: "knowledge" },
    ]);
  });

  it.each([
    ["polarization", "Polarization"],
    ["participation", "Participation"],
    ["trust", "Trust"],
    ["knowledge", "Knowledge"],
  ])("links the %s category badge back to the homepage", async (category, label) => {
    const page = await VariableThemePage({ params: Promise.resolve({ category }) });
    render(page);

    const badgeLink = screen.getByRole("link", {
      name: `Return to the home page from ${label} variable operationalization`,
    });
    expect(badgeLink.getAttribute("href")).toBe("/");
    expect(badgeLink.textContent).toBe(`Variable operationalization / ${label}`);
  });
});
