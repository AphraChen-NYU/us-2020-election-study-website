// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { VariableResults } from "@/components/outcome-browser";
import { outcomeTables } from "@/data/outcome-measures";

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
