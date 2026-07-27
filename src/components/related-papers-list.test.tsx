// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RelatedPapersList } from "@/components/related-papers-list";
import { peerReviewedPapers } from "@/data/peer-reviewed-papers";
import { getCitationText } from "@/lib/publication-citation";
import { getAbstractPreview } from "@/lib/publication-preview";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("RelatedPapersList", () => {
  it("renders simplified metadata and the expected publication actions", () => {
    const { container } = render(<RelatedPapersList />);

    expect(container.querySelectorAll("article")).toHaveLength(6);
    expect(screen.getAllByRole("link", { name: "View publication" })).toHaveLength(5);
    expect(screen.getAllByRole("button", { name: /^Cite this paper:/ })).toHaveLength(6);
    expect(screen.getByText("A publication link is not yet available.")).not.toBeNull();
    expect(container.querySelector('[data-author-display="ad-experimental"]')?.textContent).toContain("Ro’ee Levy");
    expect(container.querySelector('[data-author-display="untrustworthy"]')?.textContent).toContain(
      "Olivier Bergeron-Boutin",
    );
    expect(Array.from(container.querySelectorAll("dt")).map((term) => term.textContent)).toEqual(
      Array.from({ length: 6 }, () => ["Authors", "Publication"]).flat(),
    );
    expect(container.querySelectorAll('[data-publication-status="published"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-publication-status="forthcoming"]')).toHaveLength(1);
    expect(screen.getAllByText("Journal Article", { exact: true })).toHaveLength(5);
    expect(screen.getAllByText("Forthcoming", { exact: true })).toHaveLength(2);
    expect(screen.queryByText("View full author list", { exact: true })).toBeNull();
    expect(container.querySelector('[data-publication-status="published"]')?.className).not.toBe(
      container.querySelector('[data-publication-status="forthcoming"]')?.className,
    );
    peerReviewedPapers.forEach((paper) => {
      const marker = container.querySelector(`[data-paper-marker="${paper.id}"]`);
      expect(marker?.className).toContain("flex-col");
      expect(marker?.querySelector("[data-publication-status]")?.previousElementSibling?.textContent).toBe(
        String(peerReviewedPapers.indexOf(paper) + 1).padStart(2, "0"),
      );
    });
    expect(screen.queryByText(getCitationText(peerReviewedPapers[0]))).toBeNull();
  });

  it("derives verbatim author and abstract previews from the full source content", () => {
    const { container } = render(<RelatedPapersList />);

    peerReviewedPapers.forEach((paper) => {
      const authorDisplay = container.querySelector(`[data-author-display="${paper.id}"]`);
      const abstractPreview = container.querySelector(`[data-abstract-preview="${paper.id}"]`);
      const expectedAbstractPreview = getAbstractPreview(paper.abstract);

      expect(authorDisplay?.textContent).toBe(paper.authors.slice(0, 3).join(", "));
      expect(abstractPreview?.textContent).toBe(expectedAbstractPreview);
      expect(expectedAbstractPreview.length).toBeLessThanOrEqual(240);
      expect(paper.abstract.startsWith(expectedAbstractPreview)).toBe(true);
      expect(container.querySelector(`[data-abstract-ellipsis="${paper.id}"]`)).not.toBeNull();
      expect(container.querySelector(`[data-abstract-remainder="${paper.id}"]`)).toBeNull();
    });
  });

  it("expands author lists independently with accessible plus and minus controls", () => {
    const { container } = render(<RelatedPapersList />);
    const showAuthorButtons = screen.getAllByRole("button", { name: /^Show full author list for/ });
    const authorDisplays = peerReviewedPapers.map((paper) =>
      container.querySelector<HTMLElement>(`[data-author-display="${paper.id}"]`)!,
    );

    expect(showAuthorButtons).toHaveLength(6);
    expect(showAuthorButtons.every((button) => button.textContent === "+" && button.getAttribute("aria-expanded") === "false")).toBe(
      true,
    );
    expect(authorDisplays[0].textContent).toBe(peerReviewedPapers[0].authors.slice(0, 3).join(", "));

    fireEvent.click(showAuthorButtons[0]);
    const hideFirstAuthorButton = screen.getByRole("button", {
      name: `Hide full author list for ${peerReviewedPapers[0].title}`,
    });

    expect(hideFirstAuthorButton.textContent).toBe("−");
    expect(hideFirstAuthorButton.getAttribute("aria-expanded")).toBe("true");
    expect(authorDisplays[0].textContent).toBe(peerReviewedPapers[0].authors.join(", "));
    expect(authorDisplays[0].nextElementSibling).toBe(hideFirstAuthorButton);
    expect(authorDisplays[1].textContent).toBe(peerReviewedPapers[1].authors.slice(0, 3).join(", "));
    expect(showAuthorButtons[1].getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(hideFirstAuthorButton);
    expect(authorDisplays[0].textContent).toBe(peerReviewedPapers[0].authors.slice(0, 3).join(", "));
    expect(screen.getByRole("button", { name: `Show full author list for ${peerReviewedPapers[0].title}` }).textContent).toBe(
      "+",
    );
  });

  it("expands abstract remainders inline and collapses them independently", () => {
    const { container } = render(<RelatedPapersList />);
    const readAbstractButtons = screen.getAllByRole("button", { name: /^Read full abstract for/ });
    const firstPaper = peerReviewedPapers[0];
    const firstPreview = getAbstractPreview(firstPaper.abstract);

    expect(readAbstractButtons).toHaveLength(6);
    expect(readAbstractButtons.every((button) => button.getAttribute("aria-expanded") === "false")).toBe(true);

    fireEvent.click(readAbstractButtons[0]);
    const firstRemainder = container.querySelector(`[data-abstract-remainder="${firstPaper.id}"]`);
    const firstAbstractDisplay = container.querySelector(`[data-abstract-display="${firstPaper.id}"]`);
    const collapseFirstAbstract = screen.getByRole("button", {
      name: `Collapse full abstract for ${firstPaper.title}`,
    });

    expect(firstRemainder?.textContent).toBe(firstPaper.abstract.slice(firstPreview.length));
    expect(firstPreview + firstRemainder?.textContent).toBe(firstPaper.abstract);
    expect(container.querySelector(`[data-abstract-ellipsis="${firstPaper.id}"]`)).toBeNull();
    expect(collapseFirstAbstract.textContent).toBe("−");
    expect(collapseFirstAbstract.getAttribute("aria-expanded")).toBe("true");
    expect(firstAbstractDisplay?.lastElementChild).toBe(collapseFirstAbstract);
    expect(readAbstractButtons[1].getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(collapseFirstAbstract);
    expect(container.querySelector(`[data-abstract-remainder="${firstPaper.id}"]`)).toBeNull();
    expect(container.querySelector(`[data-abstract-ellipsis="${firstPaper.id}"]`)).not.toBeNull();
    expect(screen.getByRole("button", { name: `Read full abstract for ${firstPaper.title}` })).not.toBeNull();
  });

  it("opens the selected citation in a modal and restores focus after Escape", () => {
    render(<RelatedPapersList />);
    const citationButtons = screen.getAllByRole("button", { name: /^Cite this paper:/ });

    citationButtons[1].focus();
    fireEvent.click(citationButtons[1]);

    const dialog = screen.getByRole("dialog", { name: "Cite this paper" });
    expect(dialog.querySelector("p")?.textContent).toBe(getCitationText(peerReviewedPapers[1]));
    expect(within(dialog).getByText("Science, 381", { exact: true }).tagName).toBe("CITE");
    expect(within(dialog).getByRole("link", { name: peerReviewedPapers[1].citation.doi! }).getAttribute("href")).toBe(
      peerReviewedPapers[1].citation.doi,
    );
    expect(within(dialog).queryByText(peerReviewedPapers[1].title, { exact: true })).toBeNull();
    expect(within(dialog).queryByText(peerReviewedPapers[1].studyLabel, { exact: true })).toBeNull();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close citation" }));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(citationButtons[1]);
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the citation from the overlay and handles the forthcoming paper", () => {
    render(<RelatedPapersList />);
    const citationButtons = screen.getAllByRole("button", { name: /^Cite this paper:/ });

    fireEvent.click(citationButtons.at(-1)!);
    const dialog = screen.getByRole("dialog", { name: "Cite this paper" });
    expect(dialog.querySelector("p")?.textContent).toBe(getCitationText(peerReviewedPapers.at(-1)!));

    fireEvent.mouseDown(dialog.parentElement!);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
