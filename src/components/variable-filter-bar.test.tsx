// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VariableFilterBar } from "@/components/variable-filter-bar";
import type { OutcomeCategory } from "@/data/outcome-measures";
import { emptyVariableFilters } from "@/lib/filter-outcomes";

afterEach(cleanup);

function FilterHarness({ lockedCategory }: { lockedCategory?: OutcomeCategory }) {
  const [filters, setFilters] = useState({ ...emptyVariableFilters });

  return (
    <VariableFilterBar
      id={lockedCategory ? "theme-harness" : "overview-harness"}
      filters={filters}
      onChange={setFilters}
      lockedCategory={lockedCategory}
      tableCount={lockedCategory ? 3 : 24}
      rowCount={lockedCategory ? 14 : 90}
    />
  );
}

describe("VariableFilterBar", () => {
  it("renders only the three selection controls on the overview", () => {
    const { container } = render(
      <VariableFilterBar
        id="overview-test"
        filters={emptyVariableFilters}
        onChange={() => undefined}
        tableCount={24}
        rowCount={90}
      />,
    );

    expect(screen.getByText("Search by")).not.toBeNull();
    expect(Array.from(container.querySelectorAll("summary")).map((summary) => summary.textContent?.trim())).toEqual([
      "Theme",
      "Paper",
      "Measure",
    ]);
    const filterGroup = screen.getByRole("group", { name: "Search by" });
    const clearButton = screen.getByRole("button", { name: "Clear all filters" }) as HTMLButtonElement;
    expect(filterGroup.lastElementChild).toBe(clearButton);
    expect(clearButton.disabled).toBe(true);
    expect(container.querySelector("input[type='search']")).toBeNull();
    expect(container.querySelector("select")).toBeNull();
    expect(container.textContent).not.toContain("Search in:");
    expect(container.textContent).not.toContain("Key variables");
    expect(container.textContent).not.toContain("Method");
    expect(container.textContent).not.toContain("Filters");
  });

  it("renders table-only outcome labels and the forthcoming paper citation", () => {
    const { container } = render(
      <VariableFilterBar
        id="options-test"
        filters={emptyVariableFilters}
        onChange={() => undefined}
        tableCount={24}
        rowCount={90}
      />,
    );

    expect(screen.getByLabelText("Affective polarization")).not.toBeNull();
    expect(screen.getByLabelText("Party-congenial election misconduct and outcomes")).not.toBeNull();
    expect(screen.getByLabelText("Untrustworthy (Bergeron-Boutin et al., forthcoming)")).not.toBeNull();
    expect(container.textContent).not.toContain("A1.1 Affective polarization outcome measures");
    expect(container.textContent).not.toContain("Bergeron-Boutin et al., working paper");
  });

  it("emits a multi-select Theme filter update", () => {
    const onChange = vi.fn();
    render(
      <VariableFilterBar
        id="selection-test"
        filters={{ ...emptyVariableFilters, themes: ["polarization"] }}
        onChange={onChange}
        tableCount={3}
        rowCount={14}
      />,
    );

    fireEvent.click(screen.getByLabelText("Knowledge"));
    expect(onChange).toHaveBeenCalledWith({
      themes: ["polarization", "knowledge"],
      papers: [],
      outcomes: [],
    });
  });

  it("keeps multiple Theme selections while allowing only one open sublist", () => {
    const { container } = render(<FilterHarness />);
    const summaries = Array.from(container.querySelectorAll("summary"));
    const [themeSummary, paperSummary, outcomeSummary] = summaries;
    const themeMenu = themeSummary.closest("details")!;
    const paperMenu = paperSummary.closest("details")!;
    const outcomeMenu = outcomeSummary.closest("details")!;

    fireEvent.click(themeSummary);
    expect(themeMenu.open).toBe(true);
    expect(paperMenu.open).toBe(false);

    fireEvent.click(screen.getByLabelText("Polarization"));
    fireEvent.click(screen.getByLabelText("Knowledge"));
    expect(themeMenu.open).toBe(true);
    expect(themeSummary.textContent).toContain("2");

    fireEvent.click(paperSummary);
    expect(themeMenu.open).toBe(false);
    expect(paperMenu.open).toBe(true);
    expect((screen.getByLabelText("Polarization") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Knowledge") as HTMLInputElement).checked).toBe(true);

    fireEvent.click(outcomeSummary);
    expect(themeMenu.open).toBe(false);
    expect(paperMenu.open).toBe(false);
    expect(outcomeMenu.open).toBe(true);

    fireEvent.click(outcomeSummary);
    expect(outcomeMenu.open).toBe(false);
    expect((screen.getByLabelText("Polarization") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Knowledge") as HTMLInputElement).checked).toBe(true);
  });

  it("shows only outcomes from the selected overview theme", () => {
    const { container } = render(<FilterHarness />);
    const [themeSummary, paperSummary, outcomeSummary] = Array.from(container.querySelectorAll("summary"));

    fireEvent.click(themeSummary);
    fireEvent.click(screen.getByLabelText("Trust"));

    fireEvent.click(outcomeSummary);
    expect(screen.getByLabelText("Party-congenial election misconduct and outcomes")).not.toBeNull();
    expect(screen.queryByLabelText("Affective polarization")).toBeNull();

    fireEvent.click(paperSummary);
    expect(screen.getByLabelText("Chronological Feed (Guess et al., 2023)")).not.toBeNull();
  });

  it("narrows overview measures further when a paper is selected", () => {
    const { container } = render(<FilterHarness />);
    const [themeSummary, paperSummary, outcomeSummary] = Array.from(container.querySelectorAll("summary"));

    fireEvent.click(themeSummary);
    fireEvent.click(screen.getByLabelText("Trust"));
    fireEvent.click(paperSummary);
    fireEvent.click(screen.getByLabelText("Chronological Feed (Guess et al., 2023)"));
    fireEvent.click(outcomeSummary);

    expect(screen.getByLabelText("Beliefs in the legitimacy of the election")).not.toBeNull();
    expect(screen.queryByLabelText("Party-congenial election misconduct and outcomes")).toBeNull();
  });

  it("keeps checkbox selection open and Clear all filters closes the menu and clears selections", () => {
    const { container } = render(<FilterHarness />);
    const themeSummary = container.querySelector("summary")!;
    const themeMenu = themeSummary.closest("details")!;

    fireEvent.click(themeSummary);
    fireEvent.click(screen.getByLabelText("Polarization"));
    expect(themeMenu.open).toBe(true);
    expect((screen.getByLabelText("Polarization") as HTMLInputElement).checked).toBe(true);

    const clearButton = screen.getByRole("button", { name: "Clear all filters" }) as HTMLButtonElement;
    expect(clearButton.disabled).toBe(false);
    fireEvent.click(clearButton);
    expect(themeMenu.open).toBe(false);
    expect((screen.getByLabelText("Polarization") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole("button", { name: "Clear all filters" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("omits Theme and scopes Measure options on a theme route", () => {
    const { container } = render(
      <VariableFilterBar
        id="theme-test"
        filters={emptyVariableFilters}
        onChange={() => undefined}
        lockedCategory="polarization"
        tableCount={3}
        rowCount={14}
      />,
    );

    expect(Array.from(container.querySelectorAll("summary")).map((summary) => summary.textContent?.trim())).toEqual([
      "Paper",
      "Measure",
    ]);
    expect(screen.getByRole("group", { name: "Search by" }).lastElementChild).toBe(
      screen.getByRole("button", { name: "Clear all filters" }),
    );
    expect(screen.getByLabelText("Affective polarization")).not.toBeNull();
    expect(screen.queryByLabelText("Election knowledge")).toBeNull();
  });

  it("allows only Paper or Measure to be open on a theme route", () => {
    const { container } = render(<FilterHarness lockedCategory="polarization" />);
    const [paperSummary, outcomeSummary] = Array.from(container.querySelectorAll("summary"));
    const paperMenu = paperSummary.closest("details")!;
    const outcomeMenu = outcomeSummary.closest("details")!;

    fireEvent.click(paperSummary);
    fireEvent.click(screen.getByLabelText("Chronological Feed (Guess et al., 2023)"));
    fireEvent.click(screen.getByLabelText("Reshares (Guess et al., 2023)"));
    expect(paperMenu.open).toBe(true);
    expect(paperSummary.textContent).toContain("2");

    fireEvent.click(outcomeSummary);
    expect(paperMenu.open).toBe(false);
    expect(outcomeMenu.open).toBe(true);
    expect((screen.getByLabelText("Chronological Feed (Guess et al., 2023)") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Reshares (Guess et al., 2023)") as HTMLInputElement).checked).toBe(true);
  });
});
