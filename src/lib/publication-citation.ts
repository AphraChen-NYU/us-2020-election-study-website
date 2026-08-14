import type { PeerReviewedPaper } from "@/data/peer-reviewed-papers";

export function getCitationTitle(title: string) {
  return /[.!?]$/.test(title) ? title : `${title}.`;
}

export function getPaperCitationTitle(paper: PeerReviewedPaper) {
  return getCitationTitle(paper.citation?.title ?? paper.title);
}

export function getCitationText(paper: PeerReviewedPaper) {
  const { citation } = paper;
  if (!citation) return null;
  const publication = paper.journal
    ? ` ${paper.journal}${citation.volume ? `, ${citation.volume}` : ""}${
        citation.issue ? `(${citation.issue})` : ""
      }${citation.locator ? `, ${citation.locator}` : ""}.`
    : "";
  const doi = citation.doi ? ` ${citation.doi}` : "";

  return `${citation.authors} (${citation.yearLabel}). ${getPaperCitationTitle(paper)}${publication}${doi}`;
}
