import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Placeholder 2",
  description: "A placeholder section for future U.S. 2020 Facebook and Instagram Election Study content.",
};

export default function PlaceholderTwoPage() {
  return (
    <PlaceholderPage
      pageNumber="02"
      title="Placeholder 2"
      description="This section is reserved for future research content."
    />
  );
}
