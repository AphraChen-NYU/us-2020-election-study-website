// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import RelatedPapersPage from "@/app/related-papers/page";
import { SiteHeader } from "@/components/site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

afterEach(cleanup);

describe("publication links", () => {
  it("uses the renamed home resources and internal related-papers route", () => {
    const { container } = render(<Home />);
    const icpsrLink = screen.getByRole("link", { name: "ICPSR-SOMAR replication data" });
    const relatedCards = container.querySelectorAll('#about a[href="/related-papers"]');

    expect(icpsrLink.getAttribute("href")).toBe(
      "https://www.icpsr.umich.edu/sites/icpsr/news/data-from-u-s-2020-presidential-election-facebook-and-instagram-study-now-available-at-icpsr",
    );
    expect(relatedCards).toHaveLength(1);
  });

  it("places Study Publications before Variable Operationalization in desktop and mobile navigation", () => {
    render(<SiteHeader />);

    const desktopNavigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(desktopNavigation).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Home",
      "Study Publications",
      "Variable Operationalization",
      "Placeholder 1",
      "Placeholder 2",
    ]);
    expect(screen.getByRole("link", { name: "Study Publications" }).getAttribute("href")).toBe("/related-papers");

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(mobileNavigation).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Home",
      "Study Publications",
      "Variable Operationalization",
      "Placeholder 1",
      "Placeholder 2",
    ]);
    expect(screen.getAllByRole("link", { name: "Study Publications" })).toHaveLength(2);
  });

  it("uses the Study Publications title and introduction", () => {
    render(<RelatedPapersPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Study publications" })).not.toBeNull();
    expect(screen.getByRole("list", { name: "Study publications" })).not.toBeNull();
    expect(
      screen.getByText("Browse publications from the U.S. 2020 Facebook and Instagram Election Study."),
    ).not.toBeNull();
    expect(screen.queryByText("Open any abstract", { exact: false })).toBeNull();
    expect(screen.queryByText("Titles, author lists, citations", { exact: false })).toBeNull();
    expect(screen.queryByText("Papers", { exact: true })).toBeNull();
    expect(screen.queryByText("Published", { exact: true })).toBeNull();
  });

  it("places About before Research themes and updates the hero actions", () => {
    const { container } = render(<Home />);
    const sections = Array.from(container.querySelectorAll<HTMLElement>("main > section"));
    const aboutIndex = sections.findIndex((section) => section.id === "about");
    const themesIndex = sections.findIndex((section) => section.textContent?.includes("Research themes"));
    const hero = sections[0];

    expect(aboutIndex).toBe(1);
    expect(themesIndex).toBe(2);
    expect(aboutIndex).toBeLessThan(themesIndex);
    expect(within(hero).getByRole("link", { name: "About the study" }).getAttribute("href")).toBe("#about");
    expect(within(hero).getByRole("link", { name: "Explore variable operationalization" }).getAttribute("href")).toBe(
      "/variable-operationalization",
    );
    expect(within(sections[aboutIndex]).getByRole("link", { name: "Study Publications" }).getAttribute("href")).toBe(
      "/related-papers",
    );
    expect(screen.queryByText("Related Papers", { exact: true })).toBeNull();
  });
});
