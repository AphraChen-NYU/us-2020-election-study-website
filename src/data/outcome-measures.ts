import rawOutcomeTables from "./outcome-measures.json";

export const outcomeCategories = ["polarization", "participation", "trust", "knowledge"] as const;
export type OutcomeCategory = (typeof outcomeCategories)[number];

export interface OutcomeRow {
  paper: string;
  questionsUsed: string;
  waves: string;
  method: string;
  pages: string;
}

export interface OutcomeTable {
  id: string;
  number: string;
  title: string;
  category: OutcomeCategory;
  rows: OutcomeRow[];
}

export const categoryMeta: Record<OutcomeCategory, { label: string; description: string }> = {
  polarization: {
    label: "Polarization",
    description: "Affective, ideological, and perceived polarization.",
  },
  participation: {
    label: "Participation",
    description: "Platform use, political engagement, turnout, and vote preference.",
  },
  trust: {
    label: "Trust",
    description: "Election legitimacy, democratic performance, institutions, and information.",
  },
  knowledge: {
    label: "Knowledge",
    description: "Election, news, and factual knowledge, discernment, and false claims.",
  },
};

export const outcomeTables = rawOutcomeTables as OutcomeTable[];
