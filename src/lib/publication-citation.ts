import type { PeerReviewedPaper } from "@/data/peer-reviewed-papers";

export function getCitationTitle(title: string) {
  return /[.!?]$/.test(title) ? title : `${title}.`;
}

export function getCitationText(paper: PeerReviewedPaper) {
  const { citation } = paper;
  const publication =
    paper.journal && citation.volume
      ? ` ${paper.journal}, ${citation.volume}${citation.issue ? `(${citation.issue})` : ""}${
          citation.locator ? `, ${citation.locator}` : ""
        }.`
      : "";
  const doi = citation.doi ? ` ${citation.doi}` : "";

  return `${citation.authors} (${citation.yearLabel}). ${getCitationTitle(paper.title)}${publication}${doi}`;
}
