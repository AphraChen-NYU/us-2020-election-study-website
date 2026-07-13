import type { CuratedMethodTagTone } from "@/data/record-summaries";

export interface MethodToneStyle {
  text: `#${string}`;
  background: `#${string}`;
  border: `#${string}`;
  className: string;
  dotClassName: string;
}

export const methodToneStyles: Record<CuratedMethodTagTone, MethodToneStyle> = {
  analysis: {
    text: "#174A8B",
    background: "#E8F0FF",
    border: "#4776BD",
    className: "border-[#4776BD] bg-[#E8F0FF] text-[#174A8B]",
    dotClassName: "bg-[#4776BD]",
  },
  rotation: {
    text: "#5B3B9B",
    background: "#F0EAFE",
    border: "#9273CC",
    className: "border-[#9273CC] bg-[#F0EAFE] text-[#5B3B9B]",
    dotClassName: "bg-[#9273CC]",
  },
  aggregation: {
    text: "#0E625F",
    background: "#E2F4F1",
    border: "#3B8C87",
    className: "border-[#3B8C87] bg-[#E2F4F1] text-[#0E625F]",
    dotClassName: "bg-[#3B8C87]",
  },
  transformation: {
    text: "#7A365F",
    background: "#FCECF6",
    border: "#B65F8D",
    className: "border-[#B65F8D] bg-[#FCECF6] text-[#7A365F]",
    dotClassName: "bg-[#B65F8D]",
  },
  coding: {
    text: "#2E6535",
    background: "#E8F4E5",
    border: "#5F965B",
    className: "border-[#5F965B] bg-[#E8F4E5] text-[#2E6535]",
    dotClassName: "bg-[#5F965B]",
  },
  validation: {
    text: "#8A3D28",
    background: "#FFF0E8",
    border: "#B85E47",
    className: "border-[#B85E47] bg-[#FFF0E8] text-[#8A3D28]",
    dotClassName: "bg-[#B85E47]",
  },
  restriction: {
    text: "#744E0B",
    background: "#FFF4D6",
    border: "#A87A20",
    className: "border-[#A87A20] bg-[#FFF4D6] text-[#744E0B]",
    dotClassName: "bg-[#A87A20]",
  },
  selfReport: {
    text: "#285B6A",
    background: "#E9F3F6",
    border: "#5F8D99",
    className: "border-[#5F8D99] bg-[#E9F3F6] text-[#285B6A]",
    dotClassName: "bg-[#5F8D99]",
  },
  general: {
    text: "#39475A",
    background: "#F0F2F5",
    border: "#6F7C8D",
    className: "border-[#6F7C8D] bg-[#F0F2F5] text-[#39475A]",
    dotClassName: "bg-[#6F7C8D]",
  },
};
