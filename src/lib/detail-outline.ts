export type DetailOutlineChildKind = "alpha" | "bullet";

export interface DetailOutlineChild {
  kind: DetailOutlineChildKind;
  text: string;
}

export interface DetailOutlineItem {
  number: string;
  text: string;
  children: DetailOutlineChild[];
}

export interface DetailOutline {
  introduction: string[];
  items: DetailOutlineItem[];
}

export function parseDetailOutline(value: string): DetailOutline {
  const paragraphs = value
    .replace(/\r/g, "")
    .trim()
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
  const outline: DetailOutline = { introduction: [], items: [] };
  let currentItem: DetailOutlineItem | undefined;

  for (const paragraph of paragraphs) {
    const parent = paragraph.match(/^(\d+)\.\s+(.+)$/);
    if (parent) {
      currentItem = { number: parent[1], text: parent[2], children: [] };
      outline.items.push(currentItem);
      continue;
    }

    const alphaChild = paragraph.match(/^\(([a-z])\)\s+(.+)$/i);
    if (alphaChild && currentItem) {
      currentItem.children.push({ kind: "alpha", text: alphaChild[2] });
      continue;
    }

    const bulletChild = paragraph.match(/^-\s+(.+)$/);
    if (bulletChild && currentItem) {
      currentItem.children.push({ kind: "bullet", text: bulletChild[1] });
      continue;
    }

    if (currentItem) {
      currentItem.text = `${currentItem.text}\n\n${paragraph}`;
    } else {
      outline.introduction.push(paragraph);
    }
  }

  return outline;
}
