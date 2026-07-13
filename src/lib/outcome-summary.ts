import type { OutcomeRow, OutcomeTable } from "@/data/outcome-measures";
import {
  getCuratedRecordSummary,
  type CuratedComponent,
  type CuratedMethodTag,
  type CuratedMethodTagTone,
} from "@/data/record-summaries";

export interface SourceEntry {
  reference: string;
  description: string;
}

export type MethodTagTone = CuratedMethodTagTone;

export type MethodTag = CuratedMethodTag;

export interface RowSummary {
  components: CuratedComponent[];
  methods: MethodTag[];
  sources: SourceEntry[];
}

const SOURCE_BOUNDARY = /\)\s+(?=(?:S[- ]?\d|Main\s|Extended\s))/gi;

function normalizeInline(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Split numbered source items whether the number starts a paragraph or appears
 * inline. Numbering may contain multiple digits or restart inside subsections.
 */
export function splitNumberedItems(value: string): string[] {
  const normalized = value.replace(/\r/g, "").trim();
  if (!normalized) return [];

  const markers = [...normalized.matchAll(/(?:^|\s)(\d{1,2})[.)]\s+/g)];
  if (!markers.length) {
    const paragraphs = normalized.split(/\n\s*\n+/).map(normalizeInline).filter(Boolean);
    return paragraphs.length ? paragraphs : [normalizeInline(normalized)];
  }

  const items = markers.map((marker, index) => {
    const start = (marker.index ?? 0) + marker[0].length;
    const end = markers[index + 1]?.index ?? normalized.length;
    return normalized.slice(start, end).trim();
  });

  const firstMarkerIndex = markers[0]?.index ?? 0;
  const introduction = normalized.slice(0, firstMarkerIndex).trim();
  if (introduction && introduction.length <= 100 && introduction.endsWith(":")) {
    items[0] = `${introduction} ${items[0]}`;
  }

  for (let index = 0; index < items.length - 1; index += 1) {
    if (markers[index + 1]?.[1] !== "1") continue;
    const subsection = items[index].match(/\s((?:Self-reported|Validated|Main|Auxiliary|Additional)[^.!?]{0,80}:)\s*$/i);
    if (!subsection) continue;
    items[index] = items[index].slice(0, subsection.index).trim();
    items[index + 1] = `${subsection[1]} ${items[index + 1]}`;
  }

  return items.filter(Boolean);
}

function compactFallbackMethod(value: string) {
  return normalizeInline(value)
    .replace(/^An?\s+/i, "")
    .replace(/^The\s+/i, "")
    .replace(/[.;:]\s*$/, "");
}

function tagsForMethodItem(item: string): MethodTag[] {
  const value = normalizeInline(item);
  const lower = value.toLocaleLowerCase();
  const tags: MethodTag[] = [];
  const add = (label: string, tone: MethodTagTone) => {
    if (!tags.some((tag) => tag.label === label)) tags.push({ label, tone });
  };

  if (/principal components? analysis|principle components? analysis/.test(lower)) add("PCA", "analysis");
  if (/exploratory factor analysis/.test(lower)) add("Exploratory factor analysis", "analysis");
  else if (/factor analysis/.test(lower) && !/principal|principle components?/.test(lower)) add("Factor analysis", "analysis");
  if (/varimax rotation/.test(lower)) add("Varimax rotation", "transformation");
  if (/average of (three |the |these )?standardized|average of standardized|standardized average/.test(lower)) add("Average of standardized measures", "transformation");
  if (/index of standardized|composite.*standardized/.test(lower)) add("Standardized composite index", "transformation");
  if (/sum of .*binary|sum of self-reported binary/.test(lower)) add("Sum of binary items", "coding");
  else if (/composite \(summed\)|summed index|sum of scores|number of correct/.test(lower)) add("Summed index", "coding");
  if (/standardized value|standardize the value|standardized at|standard deviation units/.test(lower)
    && !tags.some((tag) => tag.label.includes("standardized"))) add("Standardized score", "transformation");
  if (/difference between mean belief|difference between mean|avg\. true|average.*true.*average.*false/.test(lower)) add("True-minus-false belief score", "coding");
  if (/binary (survey question|question|measure|measurement)|dichotomized/.test(lower)) add("Binary coding", "coding");
  if (/recoded as a scale from 0-1|recoded.*0-1/.test(lower)) add("Recoded to 0-1", "coding");
  if (/missing values? (are |were )?coded as incorrect/.test(lower)) add("Missing responses coded incorrect", "coding");
  if (/re-signed|resigned so that higher|reverse coded|reverse-coded/.test(lower)) add("Direction aligned to party congeniality", "transformation");
  if (/exclude|excluded|omit|dropped/.test(lower)) {
    if (/do not lean|lean toward neither|non-partisan|no party/.test(lower)) add("Excludes respondents without a party lean", "restriction");
    else add(compactFallbackMethod(value), "restriction");
  }
  if (/matched voter|voter file|validated contribution|campaign contribution data/.test(lower)) add("Validated against administrative records", "coding");
  if (/self-reported/.test(lower) && tags.length === 0) add("Self-reported measure", "general");

  if (!tags.length) add(compactFallbackMethod(value), "general");
  return tags;
}

export function deriveMethodTags(value: string): MethodTag[] {
  const tags = splitNumberedItems(value).flatMap(tagsForMethodItem);
  return tags.filter((tag, index) => tags.findIndex((candidate) => candidate.label === tag.label) === index);
}

/**
 * Separate source-reference groups such as S-9 (...), S-17, S-19 (...),
 * Main Figure 2 (...), and Extended Data Table 4 (...).
 */
export function parseSourceEntries(value: string): SourceEntry[] {
  const normalized = value.replace(/\r/g, "").trim();
  if (!normalized) return [];

  const fragments = normalized.split(SOURCE_BOUNDARY).map((fragment, index, all) => {
    const trimmed = fragment.trim();
    return index < all.length - 1 && !trimmed.endsWith(")") ? `${trimmed})` : trimmed;
  }).filter(Boolean);

  const entries = fragments.map((fragment) => {
    const descriptionStart = fragment.indexOf("(");
    if (descriptionStart < 0) return { reference: normalizeInline(fragment), description: "" };

    const reference = normalizeInline(fragment.slice(0, descriptionStart).replace(/,\s*$/, ""));
    const description = normalizeInline(fragment.slice(descriptionStart + 1).replace(/\)\s*$/, ""));
    return { reference: reference || normalizeInline(fragment), description };
  });

  return entries.length ? entries : [{ reference: normalizeInline(normalized), description: "" }];
}

export function deriveRowSummary(table: OutcomeTable, row: OutcomeRow): RowSummary {
  const curated = getCuratedRecordSummary(table, row);
  if (!curated) throw new Error(`Missing curated summary for ${table.id} / ${row.paper}`);
  const excludedMethodTagTerms = curated.excludedMethodTagTerms ?? [];
  const derivedMethods = curated.methods ?? deriveMethodTags(row.method).map((method) => ({
    ...method,
    label: curated.methodTagReplacements?.[method.label] ?? method.label,
  }));

  return {
    components: curated.components,
    methods: derivedMethods.filter((method) => (
      !excludedMethodTagTerms.some((term) => method.label.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
    )),
    sources: parseSourceEntries(row.pages),
  };
}
