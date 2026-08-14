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
  it("uses the SOMAR resource and external project overview cards", () => {
    const { container } = render(<Home />);
    const icpsrLink = screen.getByRole("link", { name: "ICPSR-SOMAR replication data" });
    const projectOverview = screen.getByRole("link", { name: "Project overview" });
    const relatedCards = container.querySelectorAll('#about a[href="/related-papers"]');

    expect(icpsrLink.getAttribute("href")).toBe(
      "https://www.icpsr.umich.edu/sites/somar/search/studies?start=0&fq=PRINCIPAL_INVESTIGATORS_FACET%3AMeta+%28United+States%29&q=",
    );
    expect(icpsrLink.getAttribute("target")).toBe("_blank");
    expect(icpsrLink.getAttribute("rel")).toBe("noreferrer");
    expect(projectOverview.getAttribute("href")).toBe("https://medium.com/@2020_election_research_project");
    expect(projectOverview.getAttribute("target")).toBe("_blank");
    expect(projectOverview.getAttribute("rel")).toBe("noreferrer");
    expect(relatedCards).toHaveLength(0);
  });

  it("uses the revised homepage About heading and external-academic wording", () => {
    const { container } = render(<Home />);
    const hero = container.querySelector<HTMLElement>("main > section")!;

    expect(
      within(hero).getByRole("heading", {
        level: 1,
        name: "Explore the U.S. 2020 Facebook and Instagram Election Study",
      }),
    ).not.toBeNull();
    expect(
      within(hero).queryByText("U.S. 2020 Facebook and Instagram Election Study", { exact: true }),
    ).toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "An index of variables, datasets, and papers" }),
    ).not.toBeNull();
    expect(screen.getAllByText(/external academics/)).toHaveLength(2);
    expect(screen.queryByText(/independent academics/)).toBeNull();
    expect(screen.queryByText(/independent external academics/)).toBeNull();
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
    const { container } = render(<StudyDatasetsPage />);

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
    const accessGuidance = screen.getByRole("complementary", { name: "Dataset access guidance" });
    expect(accessGuidance.textContent).toBe(
      "Datasets for the project are housed at the Social Media Archive (SOMAR) at the University of Michigan’s Inter-university Consortium for Political and Social Research (ICPSR). To obtain access, researchers must complete a form and pay a fee. Please see the SOMAR website for more details.",
    );
    expect(accessGuidance.className).toContain("border-l-4");
    expect(accessGuidance.className).toContain("text-white/72");
    const somarLink = within(accessGuidance).getByRole("link", { name: "the SOMAR website" });
    expect(somarLink.getAttribute("href")).toBe("https://www.icpsr.umich.edu/sites/somar/home");
    expect(somarLink.getAttribute("target")).toBe("_blank");
    expect(somarLink.getAttribute("rel")).toBe("noreferrer");
    const datasetIntroduction = screen.getByText(
      "Browse The Social Media Archive (SOMAR) datasets linked to publications from the U.S. 2020 Facebook and Instagram Election Study.",
    );
    expect(datasetIntroduction.nextElementSibling).toBe(accessGuidance);
    const datasetLibrary = screen.getByRole("heading", { level: 2, name: "Datasets by paper" });
    expect(accessGuidance.compareDocumentPosition(datasetLibrary)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(container.querySelectorAll('a[href="https://www.icpsr.umich.edu/sites/somar/home"]')).toHaveLength(1);
  });

  it("orders the homepage resource sections and exposes all hero actions", () => {
    const { container } = render(<Home />);
    const sections = Array.from(container.querySelectorAll<HTMLElement>("main > section"));
    const aboutIndex = sections.findIndex((section) => section.id === "about");
    const hero = sections[0];
    const orderedResources = Array.from(
      container.querySelectorAll<HTMLElement>("[data-home-resource-section]"),
    ).map((section) => section.dataset.homeResourceSection);

    expect(aboutIndex).toBe(1);
    expect(orderedResources).toEqual([
      "study-publications",
      "study-datasets",
      "variable-operationalization",
      "explore-resources",
    ]);
    const heroActions = within(hero).getAllByRole("link");
    expect(heroActions.map((link) => link.textContent?.trim())).toEqual([
      "About the study",
      "View study publications",
      "Browse study datasets",
      "Explore variable operationalization",
    ]);
    expect(heroActions.map((link) => link.getAttribute("href"))).toEqual([
      "#about",
      "/related-papers",
      "/datasets",
      "/variable-operationalization",
    ]);
    expect(hero.querySelector("[data-hero-actions]")).not.toBeNull();
    expect(within(sections[aboutIndex]).queryByRole("link", { name: "Study Publications" })).toBeNull();
    expect(screen.queryByText("Related Papers", { exact: true })).toBeNull();
  });

  it("uses simplified editorial headers with refined instructions", () => {
    const { container } = render(<Home />);
    const publicationSection = container.querySelector<HTMLElement>('[data-home-resource-section="study-publications"]')!;
    const datasetSection = container.querySelector<HTMLElement>('[data-home-resource-section="study-datasets"]')!;
    const variableSection = container.querySelector<HTMLElement>('[data-home-resource-section="variable-operationalization"]')!;

    expect(within(publicationSection).getByRole("heading", { level: 2, name: "Study Publications" })).not.toBeNull();
    expect(publicationSection.hasAttribute("data-compact-resource-section")).toBe(true);
    expect(publicationSection.querySelector("[data-resource-index]")).toBeNull();
    expect(publicationSection.querySelectorAll("[data-editorial-resource-header]")).toHaveLength(1);
    expect(
      within(publicationSection).getByText(
        "Browse all peer-reviewed and forthcoming papers from the U.S. 2020 Facebook and Instagram Election Study. View complete author lists, abstracts, publication links, and formatted citations for each paper.",
      ),
    ).not.toBeNull();
    expect(within(publicationSection).queryAllByRole("article")).toHaveLength(0);
    expect(publicationSection.querySelector("[data-editorial-preview-grid]")).toBeNull();
    expect(
      within(publicationSection).getByRole("link", { name: "Browse study publications" }).getAttribute("href"),
    ).toBe("/related-papers");

    expect(within(datasetSection).getByRole("heading", { level: 2, name: "Study Datasets" })).not.toBeNull();
    expect(datasetSection.hasAttribute("data-compact-resource-section")).toBe(true);
    expect(datasetSection.querySelector("[data-resource-index]")).toBeNull();
    expect(datasetSection.className).toContain("bg-[#fffdf8]");
    expect(
      within(datasetSection).getByText(
        "Explore SOMAR replication datasets linked to each study publication. Review concise dataset summaries, open source records, and access complete citation information.",
      ),
    ).not.toBeNull();
    expect(within(datasetSection).queryAllByRole("article")).toHaveLength(0);
    expect(datasetSection.querySelector("[data-editorial-preview-grid]")).toBeNull();
    expect(
      within(datasetSection).getByRole("link", { name: "Explore study datasets" }).getAttribute("href"),
    ).toBe("/datasets");

    expect(variableSection.hasAttribute("data-compact-resource-section")).toBe(true);
    expect(variableSection.querySelector("[data-resource-index]")).toBeNull();
    expect(within(variableSection).getByText("Variable Library", { exact: true })).not.toBeNull();
    expect(within(variableSection).getAllByRole("link")).toHaveLength(4);
    const themeGrid = variableSection.querySelector<HTMLElement>("[data-variable-theme-grid]")!;
    expect(themeGrid).not.toBeNull();
    expect(themeGrid.dataset.variableThemeLayout).toBe("responsive-row");
    expect(themeGrid.className).toContain("md:grid-cols-2");
    expect(themeGrid.className).toContain("xl:grid-cols-4");
    expect(within(themeGrid).getAllByText(/^0[1-4]$/).map((number) => number.textContent)).toEqual([
      "01",
      "02",
      "03",
      "04",
    ]);
    expect(within(themeGrid).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "/variable-operationalization/polarization",
      "/variable-operationalization/participation",
      "/variable-operationalization/trust",
      "/variable-operationalization/knowledge",
    ]);
    expect(within(themeGrid).getAllByRole("link")[0].className).toContain(
      "xl:[&:not(:last-child)]:border-r",
    );
    expect(container.querySelectorAll("[data-hero-actions] svg").length).toBeGreaterThan(0);
  });

  it("uses one combined panel with three destination tiles", () => {
    const { container } = render(<Home />);

    const resources = screen.getByRole("region", { name: "Explore study resources" });
    const tiles = container.querySelector("[data-resource-destination-tiles]")!;
    expect(within(resources).getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Explore the study",
    ]);
    expect(within(tiles as HTMLElement).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "/related-papers",
      "/datasets",
      "/variable-operationalization",
    ]);
    expect(within(tiles as HTMLElement).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Study Publications",
      "Study Datasets",
      "Variable Operationalization",
    ]);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Four lenses on the Study - Variable Operationalization",
      }),
    ).not.toBeNull();
  });
});
