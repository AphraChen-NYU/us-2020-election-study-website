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

    expect(container.querySelectorAll("article")).toHaveLength(11);
    expect(screen.getAllByRole("link", { name: "View publication" })).toHaveLength(9);
    expect(screen.getByRole("button", { name: /^View publication options for/ })).not.toBeNull();
    expect(screen.getAllByRole("button", { name: /^Cite this paper:/ })).toHaveLength(11);
    expect(screen.queryByText("Publication link forthcoming", { exact: true })).toBeNull();
    expect(screen.queryByText("Citation information Forthcoming", { exact: true })).toBeNull();
    expect(container.querySelector('[data-author-display="ad-experimental"]')?.textContent).toContain("Ro’ee Levy");
    expect(container.querySelector('[data-author-display="untrustworthy"]')?.textContent).toContain(
      "Olivier Bergeron-Boutin",
    );
    expect(Array.from(container.querySelectorAll("dt")).map((term) => term.textContent)).toEqual(
      Array.from({ length: 11 }, () => ["Authors", "Publication"]).flat(),
    );
    expect(container.querySelectorAll('[data-publication-status="published"]')).toHaveLength(9);
    expect(container.querySelectorAll('[data-publication-status="forthcoming"]')).toHaveLength(2);
    expect(screen.getAllByText("Journal Article", { exact: true })).toHaveLength(9);
    for (const studyLabel of [
      "Diffusion",
      "Ads Experimental",
      "Deceptive online networks",
      "Emotional State",
      "Vote Choice",
    ]) {
      expect(screen.getAllByText(studyLabel, { exact: true }).length).toBeGreaterThan(0);
    }
    expect(screen.getByText("American Economic Journal: Economic Policy · Forthcoming", { exact: true })).not.toBeNull();
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
    expect(screen.queryByText(getCitationText(peerReviewedPapers[0])!)).toBeNull();
  });

  it("renders Vote Choice last with its verified title, author preview, and forthcoming actions", () => {
    const { container } = render(<RelatedPapersList />);
    const articles = container.querySelectorAll("article");
    const voteChoiceArticle = articles.item(articles.length - 1);
    const voteChoicePaper = peerReviewedPapers.find((paper) => paper.id === "vote-choice")!;

    expect(within(voteChoiceArticle).getByText("Vote Choice", { exact: true })).not.toBeNull();
    expect(within(voteChoiceArticle).getByText(voteChoicePaper.title, { exact: true })).not.toBeNull();
    expect(within(voteChoiceArticle).getAllByText("Forthcoming", { exact: true })).toHaveLength(2);
    expect(container.querySelector('[data-author-display="vote-choice"]')?.textContent).toBe(
      "Matthew Tyler, Shanto Iyengar, Arjun Wilkins",
    );
    expect(within(voteChoiceArticle).getByText("Abstract information forthcoming.", { exact: true })).not.toBeNull();
    const authorButton = within(voteChoiceArticle).getByRole("button", {
      name: `Show full author list for ${voteChoicePaper.title}`,
    });
    expect(authorButton).not.toBeNull();
    expect(
      within(voteChoiceArticle).getByRole("button", { name: `View publication: ${voteChoicePaper.title}` }),
    ).not.toBeNull();
    expect(
      within(voteChoiceArticle).getByRole("button", { name: `Cite this paper: ${voteChoicePaper.title}` }),
    ).not.toBeNull();
    expect(within(voteChoiceArticle).queryByText("Publication link forthcoming", { exact: true })).toBeNull();
    expect(within(voteChoiceArticle).queryByText("Citation information Forthcoming", { exact: true })).toBeNull();
    expect(within(voteChoiceArticle).queryByRole("link")).toBeNull();

    fireEvent.click(authorButton);
    expect(container.querySelector('[data-author-display="vote-choice"]')?.textContent).toBe(
      voteChoicePaper.authors.join(", "),
    );
  });

  it("derives verbatim author and abstract previews from the full source content", () => {
    const { container } = render(<RelatedPapersList />);

    peerReviewedPapers.filter((paper) => paper.authors.length > 0 && paper.abstract).forEach((paper) => {
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
    expect(container.querySelector('[data-author-placeholder="vote-choice"]')).toBeNull();
    expect(container.querySelector('[data-author-display="vote-choice"]')?.textContent).toBe(
      "Matthew Tyler, Shanto Iyengar, Arjun Wilkins",
    );
    expect(container.querySelector('[data-abstract-placeholder="vote-choice"]')?.textContent).toBe(
      "Abstract information forthcoming.",
    );
  });

  it("expands author lists independently with accessible plus and minus controls", () => {
    const { container } = render(<RelatedPapersList />);
    const showAuthorButtons = screen.getAllByRole("button", { name: /^Show full author list for/ });
    const authorDisplays = peerReviewedPapers
      .filter((paper) => paper.authors.length > 0)
      .map((paper) => container.querySelector<HTMLElement>(`[data-author-display="${paper.id}"]`)!);

    expect(showAuthorButtons).toHaveLength(11);
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

    expect(readAbstractButtons).toHaveLength(10);
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

  it("opens Emotion's publication choices with accessible focus and exact external links", () => {
    render(<RelatedPapersList />);
    const emotionPaper = peerReviewedPapers.find((paper) => paper.id === "emotion")!;
    const trigger = screen.getByRole("button", {
      name: `View publication options for ${emotionPaper.title}`,
    });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Choose a publication link" });
    const journalLink = within(dialog).getByRole("link", { name: "Forthcoming (AEA)" });
    const workingPaperLink = within(dialog).getByRole("link", { name: "Working paper (NBER PDF)" });
    const closeButton = within(dialog).getByRole("button", { name: "Close publication links" });

    expect(within(dialog).queryByText(emotionPaper.title, { exact: true })).toBeNull();
    expect(dialog.className).toContain("h-full");
    expect(dialog.className).toContain("w-full");
    expect(dialog.className).toContain("sm:h-auto");
    expect(dialog.className).toContain("sm:max-w-2xl");
    expect(journalLink.getAttribute("href")).toBe(
      "https://www.aeaweb.org/articles?id=10.1257/pol.20240806&&from=f",
    );
    expect(workingPaperLink.getAttribute("href")).toBe(
      "https://www.nber.org/system/files/working_papers/w33697/w33697.pdf",
    );
    for (const link of [journalLink, workingPaperLink]) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noreferrer");
    }
    expect(document.activeElement).toBe(journalLink);
    expect(document.body.style.overflow).toBe("hidden");

    workingPaperLink.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(workingPaperLink);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Choose a publication link" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the publication chooser from its close button, overlay, and selected destination", () => {
    render(<RelatedPapersList />);
    const emotionPaper = peerReviewedPapers.find((paper) => paper.id === "emotion")!;
    const trigger = screen.getByRole("button", {
      name: `View publication options for ${emotionPaper.title}`,
    });

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Close publication links" }));
    expect(screen.queryByRole("dialog", { name: "Choose a publication link" })).toBeNull();

    trigger.focus();
    fireEvent.click(trigger);
    const overlayDialog = screen.getByRole("dialog", { name: "Choose a publication link" });
    fireEvent.mouseDown(overlayDialog.parentElement!);
    expect(screen.queryByRole("dialog", { name: "Choose a publication link" })).toBeNull();

    trigger.focus();
    fireEvent.click(trigger);
    const selectedLink = screen.getByRole("link", { name: "Working paper (NBER PDF)" });
    fireEvent.click(selectedLink);
    expect(screen.queryByRole("dialog", { name: "Choose a publication link" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("opens Vote Choice publication details in an accessible forthcoming-state dialog", () => {
    render(<RelatedPapersList />);
    const voteChoicePaper = peerReviewedPapers.find((paper) => paper.id === "vote-choice")!;
    const trigger = screen.getByRole("button", { name: `View publication: ${voteChoicePaper.title}` });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "View publication" });
    const closeButton = within(dialog).getByRole("button", { name: "Close publication links" });
    expect(within(dialog).getByText("Publication link forthcoming", { exact: true })).not.toBeNull();
    expect(within(dialog).queryByRole("link")).toBeNull();
    expect(document.activeElement).toBe(closeButton);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "View publication" })).toBeNull();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    const reopenedDialog = screen.getByRole("dialog", { name: "View publication" });
    fireEvent.mouseDown(reopenedDialog.parentElement!);
    expect(screen.queryByRole("dialog", { name: "View publication" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("opens the selected citation in a modal and restores focus after Escape", () => {
    render(<RelatedPapersList />);
    const citationButtons = screen.getAllByRole("button", { name: /^Cite this paper:/ });
    const chronologicalIndex = peerReviewedPapers.findIndex((paper) => paper.id === "chronological-feed");
    const chronologicalPaper = peerReviewedPapers[chronologicalIndex];

    citationButtons[chronologicalIndex].focus();
    fireEvent.click(citationButtons[chronologicalIndex]);

    const dialog = screen.getByRole("dialog", { name: "Cite this paper" });
    expect(dialog.querySelector("p")?.textContent).toBe(getCitationText(chronologicalPaper));
    expect(within(dialog).getByText("Science, 381", { exact: true }).tagName).toBe("CITE");
    expect(within(dialog).getByRole("link", { name: chronologicalPaper.citation!.doi! }).getAttribute("href")).toBe(
      chronologicalPaper.citation!.doi,
    );
    expect(within(dialog).queryByText(chronologicalPaper.title, { exact: true })).toBeNull();
    expect(within(dialog).queryByText(chronologicalPaper.studyLabel, { exact: true })).toBeNull();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close citation" }));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(citationButtons[chronologicalIndex]);
    expect(document.body.style.overflow).toBe("");
  });

  it("opens Vote Choice citation details in an accessible forthcoming-state dialog", () => {
    render(<RelatedPapersList />);
    const voteChoicePaper = peerReviewedPapers.find((paper) => paper.id === "vote-choice")!;
    const trigger = screen.getByRole("button", { name: `Cite this paper: ${voteChoicePaper.title}` });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Cite this paper" });
    const closeButton = within(dialog).getByRole("button", { name: "Close citation" });
    expect(within(dialog).getByText("Citation information Forthcoming", { exact: true })).not.toBeNull();
    expect(within(dialog).queryByRole("link")).toBeNull();
    expect(dialog.querySelector("cite")).toBeNull();
    expect(document.activeElement).toBe(closeButton);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Cite this paper" })).toBeNull();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    const reopenedDialog = screen.getByRole("dialog", { name: "Cite this paper" });
    fireEvent.mouseDown(reopenedDialog.parentElement!);
    expect(screen.queryByRole("dialog", { name: "Cite this paper" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes the citation from the overlay and handles the forthcoming paper", () => {
    render(<RelatedPapersList />);
    const emotionPaper = peerReviewedPapers.find((paper) => paper.id === "emotion")!;
    fireEvent.click(screen.getByRole("button", { name: `Cite this paper: ${emotionPaper.title}` }));
    const dialog = screen.getByRole("dialog", { name: "Cite this paper" });
    expect(dialog.querySelector("p")?.textContent).toBe(getCitationText(emotionPaper));

    fireEvent.mouseDown(dialog.parentElement!);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("italicizes the verified journal name for the forthcoming Emotion paper", () => {
    render(<RelatedPapersList />);
    const emotionPaper = peerReviewedPapers.find((paper) => paper.id === "emotion")!;

    fireEvent.click(screen.getByRole("button", { name: `Cite this paper: ${emotionPaper.title}` }));

    const dialog = screen.getByRole("dialog", { name: "Cite this paper" });
    expect(within(dialog).getByText("American Economic Journal: Economic Policy", { exact: true }).tagName).toBe("CITE");
    expect(dialog.querySelector("p")?.textContent).toBe(getCitationText(emotionPaper));
  });

  it("italicizes the verified journal and volume for the published Untrustworthy paper", () => {
    render(<RelatedPapersList />);
    const untrustworthyPaper = peerReviewedPapers.find((paper) => paper.id === "untrustworthy")!;

    fireEvent.click(screen.getByRole("button", { name: `Cite this paper: ${untrustworthyPaper.title}` }));

    const dialog = screen.getByRole("dialog", { name: "Cite this paper" });
    expect(within(dialog).getByText("Science Advances, 12", { exact: true }).tagName).toBe("CITE");
    expect(dialog.querySelector("p")?.textContent).toBe(getCitationText(untrustworthyPaper));
  });
});
