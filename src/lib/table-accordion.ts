import type { OutcomeTable } from "@/data/outcome-measures";

export function resolveVisibleOpenTable(openTableId: string, tables: OutcomeTable[]) {
  return openTableId && tables.some((table) => table.id === openTableId) ? openTableId : "";
}
