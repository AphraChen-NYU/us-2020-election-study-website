// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";

afterEach(cleanup);

describe("SiteFooter", () => {
  it("summarizes the public research hub without temporary local language", () => {
    render(<SiteFooter />);

    expect(
      screen.getByText(
        "A research hub bringing together study publications, research themes, and detailed documentation of how key variables were operationalized.",
      ),
    ).not.toBeNull();
    expect(screen.queryByText("A local research interface", { exact: false })).toBeNull();
  });

  it("shows all four internal destinations in the requested order", () => {
    render(<SiteFooter />);

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Browse study publications",
      "Explore variable operationalization",
      "Placeholder 1",
      "Placeholder 2",
    ]);
    expect(links[0].getAttribute("href")).toBe("/related-papers");
    expect(links[1].getAttribute("href")).toBe("/variable-operationalization");
    expect(links[2].getAttribute("href")).toBe("/placeholder-1");
    expect(links[3].getAttribute("href")).toBe("/placeholder-2");
    expect(screen.queryByText("ICPSR study overview")).toBeNull();
  });
});
