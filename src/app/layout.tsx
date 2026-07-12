import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/newsreader/wght.css";
import "./globals.css";

const [githubOwner = "", githubRepository = ""] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const githubProjectPath = githubRepository && !githubRepository.endsWith(".github.io") ? `/${githubRepository}` : "";
const defaultSiteUrl = process.env.GITHUB_ACTIONS && githubOwner
  ? `https://${githubOwner}.github.io${githubProjectPath}`
  : "http://localhost:3000";
const metadataBase = new URL(`${(process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/$/, "")}/`);
const socialImageUrl = new URL("og.png", metadataBase).toString();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "U.S. 2020 Election Study",
    template: "%s | U.S. 2020 Election Study",
  },
  description: "Research materials from the U.S. 2020 Facebook and Instagram Election Study.",
  openGraph: {
    type: "website",
    title: "U.S. 2020 Facebook and Instagram Election Study",
    description: "Explore how key variables were operationalized across the study's papers.",
    images: [{ url: socialImageUrl, width: 1731, height: 909, alt: "U.S. 2020 Facebook and Instagram Election Study" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "U.S. 2020 Facebook and Instagram Election Study",
    description: "Explore how key variables were operationalized across the study's papers.",
    images: [socialImageUrl],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
