const AUTHOR_PREVIEW_COUNT = 3;
export const ABSTRACT_PREVIEW_CHARACTER_LIMIT = 240;

export function getAuthorPreview(authors: readonly string[]) {
  return authors.slice(0, AUTHOR_PREVIEW_COUNT);
}

export function getAbstractPreview(abstract: string) {
  if (abstract.length <= ABSTRACT_PREVIEW_CHARACTER_LIMIT) {
    return abstract;
  }

  const candidate = abstract.slice(0, ABSTRACT_PREVIEW_CHARACTER_LIMIT);
  const nextCharacter = abstract.at(ABSTRACT_PREVIEW_CHARACTER_LIMIT);

  if (nextCharacter === " " || candidate.endsWith(" ")) {
    return candidate.trimEnd();
  }

  const lastWordBoundary = candidate.lastIndexOf(" ");
  return candidate.slice(0, lastWordBoundary).trimEnd();
}
