// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudyDatasetsBrowser } from "@/components/study-datasets-browser";
import { studyDatasetGroups } from "@/data/study-datasets";
import { getDatasetSummaryPreview } from "@/lib/publication-preview";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("StudyDatasetsBrowser", () => {
  it("starts collapsed and allows paper tables to expand independently", () => {
    const { container } = render(<StudyDatasetsBrowser />);
    const triggers = Array.from(container.querySelectorAll<HTMLButtonElement>("button[aria-expanded]"));

    expect(triggers).toHaveLength(11);
    expect(triggers.every((trigger) => trigger.getAttribute("aria-expanded") === "false")).toBe(true);
    expect(screen.queryByRole("table")).toBeNull();

    const segregationTrigger = container.querySelector<HTMLButtonElement>(
      '[data-dataset-group="segregation"] button[aria-expanded]',
    )!;
    const chronologicalTrigger = container.querySelector<HTMLButtonElement>(
      '[data-dataset-group="chronological-feed"] button[aria-expanded]',
    )!;

    fireEvent.click(segregationTrigger);
    expect(segregationTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("table", { name: "Datasets linked to Segregation" })).not.toBeNull();

    fireEvent.click(chronologicalTrigger);
    expect(segregationTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(chronologicalTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("table", { name: "Datasets linked to Chronological Feed" })).not.toBeNull();

    fireEvent.click(segregationTrigger);
    expect(segregationTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("table", { name: "Datasets linked to Segregation" })).toBeNull();
    expect(chronologicalTrigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("renders verified row content and safe external links in the requested order", () => {
    const { container } = render(<StudyDatasetsBrowser />);
    const segregationTrigger = container.querySelector<HTMLButtonElement>(
      '[data-dataset-group="segregation"] button[aria-expanded]',
    )!;
    fireEvent.click(segregationTrigger);

    const table = screen.getByRole("table", { name: "Datasets linked to Segregation" });
    const headers = within(table).getAllByRole("columnheader").map((header) => header.textContent);
    expect(headers).toEqual(["Dataset", "Summary", "Dataset link and citation"]);
    expect(headers).toHaveLength(3);
    expect(within(table).getAllByRole("columnheader")[0].className).toContain("w-[32%]");
    expect(within(table).getAllByRole("columnheader")[1].className).toContain("w-[50%]");

    const firstDataset = studyDatasetGroups[0].datasets[0];
    const firstRow = container.querySelector(`[data-dataset-row="${firstDataset.id}"]`)!;
    expect(firstRow.textContent).toContain(firstDataset.name);
    expect(firstRow.textContent).toContain(getDatasetSummaryPreview(firstDataset.summary));
    expect(firstRow.className).toContain("md:table-row");

    const datasetLink = within(firstRow as HTMLElement).getByRole("link", {
      name: `View dataset: ${firstDataset.name}`,
    });
    expect(datasetLink.getAttribute("href")).toBe(firstDataset.url);
    expect(datasetLink.getAttribute("target")).toBe("_blank");
    expect(datasetLink.getAttribute("rel")).toBe("noreferrer");
    expect(table.className).toContain("md:table");
    const actions = firstRow.querySelector<HTMLElement>("[data-dataset-actions]")!;
    expect(actions.className).toContain("flex-col");
    expect(actions.contains(datasetLink)).toBe(true);
    expect(
      actions.contains(
        within(firstRow as HTMLElement).getByRole("button", {
          name: `Cite dataset: ${firstDataset.name}`,
        }),
      ),
    ).toBe(true);
  });

  it("filters papers with the multi-select Paper menu and clears all selections", () => {
    const { container } = render(<StudyDatasetsBrowser />);
    const segregation = studyDatasetGroups.find((group) => group.id === "segregation")!;
    const resultCount = container.querySelector('p[aria-live="polite"]')!;
    const filter = container.querySelector<HTMLElement>("[data-dataset-filter]")!;
    const filterInstruction = screen.getByText(
      "Use the dropdown menus to search for SOMAR datasets related to each paper.",
      { exact: true },
    );
    const filterGroup = screen.getByRole("group", { name: "Search by" });
    const paperSummary = container.querySelector("summary")!;
    const paperMenu = paperSummary.closest("details")!;
    const clearButton = screen.getByRole("button", { name: "Clear all filters" }) as HTMLButtonElement;

    expect(paperSummary.textContent?.trim()).toBe("Paper");
    expect(filterInstruction.parentElement).toBe(filter);
    expect(filterInstruction.compareDocumentPosition(filterGroup)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(filter.className).toContain("border-b");
    expect(filter.className).not.toContain("border-y");
    expect(filter.className).not.toContain("border-t");
    expect(filterGroup.contains(clearButton)).toBe(true);
    expect(clearButton.disabled).toBe(true);
    expect(container.querySelector("input[type='search']")).toBeNull();
    expect(resultCount.textContent).toContain("Showing 11 of 11 papers");

    fireEvent.click(paperSummary);
    expect(paperMenu.open).toBe(true);
    expect(container.querySelectorAll("[data-dataset-paper-options] input[type='checkbox']")).toHaveLength(11);
    expect(screen.getByLabelText("Ad Experimental (Allcott et al., 2026)")).not.toBeNull();
    expect(screen.getByLabelText("Emotion (Allcott et al., Forthcoming)")).not.toBeNull();

    fireEvent.click(screen.getByLabelText(segregation.filterLabel));
    fireEvent.click(screen.getByLabelText("Vote Choice (Forthcoming)"));
    expect(container.querySelectorAll("[data-dataset-group]")).toHaveLength(2);
    expect(container.querySelector('[data-dataset-group="segregation"]')).not.toBeNull();
    expect(container.querySelector('[data-dataset-group="vote-choice"]')).not.toBeNull();
    expect(resultCount.textContent).toContain("Showing 2 of 11 papers");
    expect(paperSummary.textContent).toContain("2");
    expect(
      within(container.querySelector('[data-dataset-group="vote-choice"]') as HTMLElement).getAllByText(
        "Vote Choice",
        { exact: true },
      ),
    ).toHaveLength(2);
    expect(clearButton.disabled).toBe(false);

    const activeFilters = screen.getByLabelText("Active paper filters");
    const filterButtons = within(activeFilters).getAllByRole("button");
    expect(filterButtons.map((button) => button.textContent)).toEqual([
      `${segregation.filterLabel}Remove filter`,
      "Vote Choice (Forthcoming)Remove filter",
    ]);
    fireEvent.click(filterButtons[0]);
    expect(container.querySelector('[data-dataset-group="segregation"]')).toBeNull();
    expect(container.querySelector('[data-dataset-group="vote-choice"]')).not.toBeNull();

    fireEvent.click(clearButton);
    expect(container.querySelectorAll("[data-dataset-group]")).toHaveLength(11);
    expect(screen.queryByLabelText("Active paper filters")).toBeNull();
    expect(clearButton.disabled).toBe(true);
    expect(paperMenu.open).toBe(false);
  });

  it("previews and expands complete summaries inline for each paper association", () => {
    const { container } = render(<StudyDatasetsBrowser />);
    const segregation = studyDatasetGroups.find((group) => group.id === "segregation")!;
    const chronological = studyDatasetGroups.find((group) => group.id === "chronological-feed")!;
    const duplicateDataset = segregation.datasets.find(
      (dataset) =>
        dataset.id === "300396" &&
        chronological.datasets.some((candidate) => candidate.id === dataset.id),
    )!;
    const preview = getDatasetSummaryPreview(duplicateDataset.summary);
    const segregationAssociation = `segregation-${duplicateDataset.id}`;
    const chronologicalAssociation = `chronological-feed-${duplicateDataset.id}`;

    fireEvent.click(
      container.querySelector<HTMLButtonElement>(
        '[data-dataset-group="segregation"] button[aria-expanded]',
      )!,
    );
    fireEvent.click(
      container.querySelector<HTMLButtonElement>(
        '[data-dataset-group="chronological-feed"] button[aria-expanded]',
      )!,
    );

    const segregationPreview = container.querySelector(
      `[data-summary-preview="${segregationAssociation}"]`,
    );
    const chronologicalPreview = container.querySelector(
      `[data-summary-preview="${chronologicalAssociation}"]`,
    );
    const readSegregation = screen.getByRole("button", {
      name: `Read full summary for ${duplicateDataset.name} in Segregation`,
    });
    const readChronological = screen.getByRole("button", {
      name: `Read full summary for ${duplicateDataset.name} in Chronological Feed`,
    });

    expect(segregationPreview?.textContent).toBe(preview);
    expect(chronologicalPreview?.textContent).toBe(preview);
    expect(preview.length).toBeLessThanOrEqual(240);
    expect(duplicateDataset.summary.startsWith(preview)).toBe(true);
    expect(container.querySelector(`[data-summary-ellipsis="${segregationAssociation}"]`)).not.toBeNull();
    expect(readSegregation.getAttribute("aria-expanded")).toBe("false");
    expect(readChronological.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(readSegregation);
    const remainder = container.querySelector(`[data-summary-remainder="${segregationAssociation}"]`);
    const expandedDisplay = container.querySelector(`[data-summary-display="${segregationAssociation}"]`);
    const collapse = screen.getByRole("button", {
      name: `Collapse full summary for ${duplicateDataset.name} in Segregation`,
    });

    expect(`${segregationPreview?.textContent}${remainder?.textContent}`).toBe(duplicateDataset.summary);
    expect(expandedDisplay?.textContent).toContain(duplicateDataset.summary);
    expect(collapse.getAttribute("aria-expanded")).toBe("true");
    expect(readChronological.getAttribute("aria-expanded")).toBe("false");
    expect(
      container.querySelector(`[data-summary-remainder="${chronologicalAssociation}"]`),
    ).toBeNull();

    fireEvent.click(collapse);
    expect(
      screen.getByRole("button", {
        name: `Read full summary for ${duplicateDataset.name} in Segregation`,
      }).getAttribute("aria-expanded"),
    ).toBe("false");
    expect(container.querySelector(`[data-summary-remainder="${segregationAssociation}"]`)).toBeNull();
  });

  it("opens an accessible citation dialog with the exact citation and linked DOI", () => {
    const { container } = render(<StudyDatasetsBrowser />);
    const segregationTrigger = container.querySelector<HTMLButtonElement>(
      '[data-dataset-group="segregation"] button[aria-expanded]',
    )!;
    fireEvent.click(segregationTrigger);

    const dataset = studyDatasetGroups[0].datasets[0];
    const citeButton = screen.getByRole("button", { name: `Cite dataset: ${dataset.name}` });
    citeButton.focus();
    fireEvent.click(citeButton);

    const dialog = screen.getByRole("dialog", { name: "Cite this dataset" });
    const closeButton = within(dialog).getByRole("button", { name: "Close dataset citation" });
    const doiLink = within(dialog).getByRole("link", { name: dataset.doi });

    expect(dialog.textContent).toContain(dataset.citation);
    expect(doiLink.getAttribute("href")).toBe(dataset.doi);
    expect(doiLink.getAttribute("target")).toBe("_blank");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(doiLink);
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Cite this dataset" })).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(citeButton);
  });

  it("closes the citation dialog from its close control and overlay", () => {
    const { container } = render(<StudyDatasetsBrowser />);
    fireEvent.click(
      container.querySelector<HTMLButtonElement>('[data-dataset-group="segregation"] button[aria-expanded]')!,
    );
    const dataset = studyDatasetGroups[0].datasets[0];
    const citeButton = screen.getByRole("button", { name: `Cite dataset: ${dataset.name}` });

    fireEvent.click(citeButton);
    fireEvent.click(screen.getByRole("button", { name: "Close dataset citation" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(citeButton);
    const dialog = screen.getByRole("dialog", { name: "Cite this dataset" });
    fireEvent.mouseDown(dialog.parentElement!);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("preserves the empty Untrustworthy placeholder", () => {
    const { container } = render(<StudyDatasetsBrowser />);
    const trigger = container.querySelector<HTMLButtonElement>(
      '[data-dataset-group="untrustworthy"] button[aria-expanded]',
    )!;

    fireEvent.click(trigger);
    expect(screen.getByText("Dataset information forthcoming.")).not.toBeNull();
    expect(container.querySelector('[data-empty-dataset-group="untrustworthy"]')).not.toBeNull();
  });
});
