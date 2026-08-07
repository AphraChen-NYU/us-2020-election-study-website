const AUTHOR_PREVIEW_COUNT = 3;
export const ABSTRACT_PREVIEW_CHARACTER_LIMIT = 240;
export const DATASET_SUMMARY_PREVIEW_CHARACTER_LIMIT = 240;

export function getAuthorPreview(authors: readonly string[]) {
  return authors.slice(0, AUTHOR_PREVIEW_COUNT);
}

function getWholeWordPreview(text: string, characterLimit: number) {
  if (text.length <= characterLimit) {
    return text;
  }

  const candidate = text.slice(0, characterLimit);
  const nextCharacter = text.at(characterLimit);

  if (nextCharacter === " " || candidate.endsWith(" ")) {
    return candidate.trimEnd();
  }

  const lastWordBoundary = candidate.lastIndexOf(" ");
  return candidate.slice(0, lastWordBoundary).trimEnd();
}

export function getAbstractPreview(abstract: string) {
  return getWholeWordPreview(abstract, ABSTRACT_PREVIEW_CHARACTER_LIMIT);
}

export function getDatasetSummaryPreview(summary: string) {
  return getWholeWordPreview(summary, DATASET_SUMMARY_PREVIEW_CHARACTER_LIMIT);
}
