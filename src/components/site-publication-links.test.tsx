// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import StudyDatasetsPage from "@/app/datasets/page";
import RelatedPapersPage from "@/app/related-papers/page";
import VariableOperationalizationPage from "@/app/variable-operationalization/page";
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
      "https://www.icpsr.umich.edu/sites/somar/search/studies?start=0&fq=PRINCIPAL_INVESTIGATORS_FACET%3AMeta+%28United+States%29&q=",
    );
    expect(icpsrLink.getAttribute("target")).toBe("_blank");
    expect(icpsrLink.getAttribute("rel")).toBe("noreferrer");
    expect(relatedCards).toHaveLength(1);
  });

  it("places Study Datasets between Study Publications and Variable Operationalization in both menus", () => {
    const { container } = render(<SiteHeader />);

    const desktopNavigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(desktopNavigation.className).toContain("md:flex");
    expect(container.querySelector('button[aria-label="Open navigation"]')?.className).toContain("md:hidden");
    expect(within(desktopNavigation).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Home",
      "Study Publications",
      "Study Datasets",
      "Variable Operationalization",
    ]);
    expect(screen.getByRole("link", { name: "Study Publications" }).getAttribute("href")).toBe("/related-papers");

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(mobileNavigation).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Home",
      "Study Publications",
      "Study Datasets",
      "Variable Operationalization",
    ]);
    expect(screen.getAllByRole("link", { name: "Study Publications" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Study Datasets" })).toHaveLength(2);
  });

  it("uses the revised variable overview heading and search guidance", () => {
    const { container } = render(<VariableOperationalizationPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Variables by theme, paper, or measure" })).not.toBeNull();
    expect(screen.getAllByText("Use the drop down menus to search for FIES variables", { exact: true })).toHaveLength(1);
    const scopeNote = screen.getByRole("complementary", { name: "Variable scope guidance" });
    const variableNameNote = screen.getByRole("complementary", { name: "Variable-name note" });
    expect(scopeNote.textContent).toContain(
      "The variable descriptions below are for common measures used across the papers. For variables that were used primarily in only one study (e.g. emotional state - Allcott et al., forthcoming; deceptive online networks - Appel et al., 2026; diffusion and ideological segregation - González-Bailón et al., 2023, 2024), please see the individual papers.",
    );
    expect(within(variableNameNote).getByText("Note:", { exact: true })).not.toBeNull();
    expect(
      within(variableNameNote).getByText(
        "When variable names are included in the variable details on this website, these refer to the variable names as included in the supplemental appendices of the papers.",
        { exact: true },
      ),
    ).not.toBeNull();
    expect(within(scopeNote).getByRole("link", { name: "individual papers" }).getAttribute("href")).toBe(
      "/related-papers",
    );
    expect(within(variableNameNote).queryByRole("link")).toBeNull();
    expect(scopeNote.className).not.toContain("grid-cols");
    expect(scopeNote.className).not.toContain("border-y");
    expect(scopeNote.className).not.toContain("rounded-2xl");
    expect(scopeNote).not.toBe(variableNameNote);
    expect(screen.queryByText("Scope note", { exact: true })).toBeNull();
    expect(screen.queryByText("Variable-name reference", { exact: true })).toBeNull();
    const instruction = container.querySelector('[data-filter-instruction="overview-variable-filter"]');
    const filter = container.querySelector('[data-variable-filter="overview-variable-filter"]');
    const filterLabel = container.querySelector("#overview-variable-filter-label");
    const polarizationTheme = screen.getByRole("link", {
      name: "View Polarization variable operationalization tables",
    });
    expect(instruction?.parentElement).toBe(filter);
    expect(scopeNote.compareDocumentPosition(instruction!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(instruction!.compareDocumentPosition(filterLabel!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(polarizationTheme.compareDocumentPosition(variableNameNote)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.queryByText("Choose a research theme", { exact: true })).toBeNull();
    expect(screen.queryByText("Select a theme", { exact: false })).toBeNull();
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

  it("uses the Study Datasets title and introduction", () => {
    render(<StudyDatasetsPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Study datasets" })).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Datasets by paper" })).not.toBeNull();
    expect(screen.getByRole("region", { name: "Study datasets by paper" })).not.toBeNull();
    expect(
      screen.getByText(
        "Browse The Social Media Archive (SOMAR) datasets linked to publications from the U.S. 2020 Facebook and Instagram Election Study.",
      ),
    ).not.toBeNull();
    expect(
      screen.getByText(
        "Expand a paper to review its linked datasets, table summaries, source records, and citations.",
      ),
    ).not.toBeNull();
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

  it("adds the three homepage resource panels in the requested order", () => {
    render(<Home />);

    const resources = screen.getByRole("region", { name: "Explore study resources" });
    const headings = within(resources).getAllByRole("heading", { level: 2 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "Explore the study publications",
      "Explore the study datasets",
      "See how every variable was operationalized",
    ]);
    expect(
      within(resources).getByRole("link", { name: "View study publications" }).getAttribute("href"),
    ).toBe("/related-papers");
    expect(
      within(resources).getByRole("link", { name: "View study datasets" }).getAttribute("href"),
    ).toBe("/datasets");
    expect(within(resources).getByRole("link", { name: "Open the library" }).getAttribute("href")).toBe(
      "/variable-operationalization",
    );
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Four lenses on the Study - Variable Operationalization",
      }),
    ).not.toBeNull();
  });
});
