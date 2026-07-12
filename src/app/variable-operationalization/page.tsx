import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VariableOverview } from "@/components/variable-overview";

export const metadata: Metadata = {
  title: "Variable Operationalization",
  description: "Explore how variables were operationalized across papers in the U.S. 2020 Facebook and Instagram Election Study.",
};

export default function VariableOperationalizationPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ed]">
      <SiteHeader />
      <main>
        <VariableOverview />
      </main>
      <SiteFooter />
    </div>
  );
}
