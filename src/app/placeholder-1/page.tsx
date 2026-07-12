import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Placeholder 1",
  description: "A placeholder section for future U.S. 2020 Facebook and Instagram Election Study content.",
};

export default function PlaceholderOnePage() {
  return (
    <PlaceholderPage
      pageNumber="01"
      title="Placeholder 1"
      description="This section is reserved for future research content."
    />
  );
}
