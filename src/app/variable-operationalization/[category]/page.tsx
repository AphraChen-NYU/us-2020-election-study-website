import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OutcomeBrowser } from "@/components/outcome-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { categoryMeta, outcomeCategories, type OutcomeCategory } from "@/data/outcome-measures";

type ThemePageProps = { params: Promise<{ category: string }> };

function isOutcomeCategory(value: string): value is OutcomeCategory {
  return outcomeCategories.includes(value as OutcomeCategory);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return outcomeCategories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isOutcomeCategory(category)) return {};

  return {
    title: `${categoryMeta[category].label} Variable Operationalization`,
    description: `Browse ${categoryMeta[category].label.toLowerCase()} variable operationalization tables from the U.S. 2020 Facebook and Instagram Election Study.`,
  };
}

export default async function VariableThemePage({ params }: ThemePageProps) {
  const { category } = await params;
  if (!isOutcomeCategory(category)) notFound();
  const meta = categoryMeta[category];

  return (
    <div className="min-h-screen bg-[#f7f4ed]">
      <SiteHeader />
      <main>
        <section className="matrix-pattern overflow-hidden bg-[#14213d] text-white">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
            <Link
              href="/"
              aria-label={`Return to the home page from ${meta.label} variable operationalization`}
              className="inline-flex rounded-full transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Badge className="border-white/20 bg-white/8 text-white">
                Variable operationalization / {meta.label}
              </Badge>
            </Link>
            <div className="mt-7 grid items-end gap-8 lg:grid-cols-[1fr_0.75fr]">
              <h1 className="max-w-4xl text-[clamp(3.4rem,7vw,6.8rem)] leading-[0.9] font-medium tracking-[-0.05em]">
                {meta.label} variable operationalization
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/72 lg:pb-2">
                {meta.description} Filter the tables in this theme by paper or outcome table.
              </p>
            </div>
          </div>
        </section>
        <OutcomeBrowser category={category} />
      </main>
      <SiteFooter />
    </div>
  );
}
