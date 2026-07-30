// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { OutcomeBrowser, VariableResults } from "@/components/outcome-browser";
import { categoryMeta, outcomeCategories, outcomeTables } from "@/data/outcome-measures";

afterEach(cleanup);

describe("VariableResults", () => {
  it("renders every A2.1 record when the table is expanded", () => {
    const platformUsage = outcomeTables.find((table) => table.id === "a2-1");
    if (!platformUsage) throw new Error("A2.1 fixture is missing");

    const { container } = render(<VariableResults tables={[platformUsage]} />);
    const trigger = screen.getByRole("button", {
      name: "A2.1Platform usage outcome measures5 paper records",
    });

    expect(screen.queryByRole("table", { name: "A2.1: Platform usage outcome measures" })).toBeNull();

    fireEvent.click(trigger);

    const table = screen.getByRole("table", { name: "A2.1: Platform usage outcome measures" });
    expect(table.querySelectorAll("tbody tr")).toHaveLength(platformUsage.rows.length);
    expect(screen.getAllByRole("button", { name: /^View details for/ })).toHaveLength(platformUsage.rows.length);
    expect(container.querySelector('[data-table-layout="cards"]')?.className).toContain("sm:hidden");
    expect(container.querySelector('[data-table-layout="table"]')?.className).toContain("sm:block");

    fireEvent.click(trigger);
    expect(screen.queryByRole("table", { name: "A2.1: Platform usage outcome measures" })).toBeNull();
  });
});

describe("OutcomeBrowser variable guidance", () => {
  it.each(outcomeCategories)("renders separated notes around the filters and %s results", (category) => {
    const { container } = render(<OutcomeBrowser category={category} />);
    const scopeNote = screen.getByRole("complementary", { name: "Variable scope guidance" });
    const variableNameNote = screen.getByRole("complementary", { name: "Variable-name note" });
    const instruction = screen.getByText("Use the drop down menus to search for FIES variables", { exact: true });
    const filterLabel = container.querySelector("#theme-variable-filter-label");
    const resultsHeading = screen.getByRole("heading", { level: 2, name: categoryMeta[category].label });

    expect(scopeNote.textContent).toContain("The variable descriptions below are for common measures used across the papers.");
    expect(variableNameNote.textContent).toContain("When variable names are included in the variable details on this website");
    expect(screen.getByText("Note:", { exact: true })).not.toBeNull();
    expect(screen.queryByText("Scope note", { exact: true })).toBeNull();
    expect(screen.queryByText("Variable-name reference", { exact: true })).toBeNull();
    expect(screen.getAllByText("Use the drop down menus to search for FIES variables", { exact: true })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "individual papers" }).getAttribute("href")).toBe("/related-papers");
    expect(scopeNote.compareDocumentPosition(instruction)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(instruction.compareDocumentPosition(filterLabel!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(resultsHeading.compareDocumentPosition(variableNameNote)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(scopeNote).not.toBe(variableNameNote);
  });
});
