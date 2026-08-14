// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";

afterEach(cleanup);

describe("SiteFooter", () => {
  it("summarizes the public research hub and links to the external project page", () => {
    const { container } = render(<SiteFooter />);
    const description = container.querySelector("footer p:nth-of-type(2)");
    const projectPage = screen.getByRole("link", { name: "project page" });

    expect(description?.textContent).toBe(
      "A research hub bringing together study publications, research themes, and detailed documentation of how key variables were operationalized. For more details about the project, see the project page.",
    );
    expect(projectPage.getAttribute("href")).toBe("https://medium.com/@2020_election_research_project");
    expect(projectPage.getAttribute("target")).toBe("_blank");
    expect(projectPage.getAttribute("rel")).toBe("noreferrer");
    expect(screen.queryByText("A local research interface", { exact: false })).toBeNull();
  });

  it("shows the three requested internal destinations in order", () => {
    render(<SiteFooter />);

    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/"));
    expect(links.map((link) => link.textContent)).toEqual([
      "View study publications",
      "Browse study datasets",
      "Explore variable operationalization",
    ]);
    expect(links[0].getAttribute("href")).toBe("/related-papers");
    expect(links[1].getAttribute("href")).toBe("/datasets");
    expect(links[2].getAttribute("href")).toBe("/variable-operationalization");
    expect(screen.queryByRole("link", { name: "Placeholder 1" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Placeholder 2" })).toBeNull();
    expect(screen.queryByText("ICPSR study overview")).toBeNull();
    expect(screen.queryByRole("link", { name: "Browse study publications" })).toBeNull();
  });
});
