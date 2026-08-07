import Link from "next/link";
import { ArrowRight, BookOpenText, ExternalLink, LibraryBig, SearchCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { categoryMeta, outcomeCategories } from "@/data/outcome-measures";
import { cn } from "@/lib/utils";

const themeNumbers = ["01", "02", "03", "04"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f4ed]">
      <SiteHeader />
      <main>
        <section className="matrix-pattern relative overflow-hidden bg-[#14213d] text-white">
          <div aria-hidden="true" className="absolute -right-28 -top-24 size-[440px] rounded-full bg-[#147d79]/35 blur-3xl" />
          <div className="relative mx-auto flex min-h-[680px] max-w-[1440px] items-end px-5 py-16 sm:px-8 md:py-24 lg:px-12">
            <div className="max-w-5xl">
              <Badge className="border-white/20 bg-white/8 text-white">U.S. 2020 Facebook and Instagram Election Study</Badge>
              <h1 className="mt-8 max-w-4xl text-[clamp(3.4rem,8vw,7.5rem)] leading-[0.88] font-medium tracking-[-0.055em] text-balance">
                Exploring social media and the 2020 U.S. election
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/72 sm:text-xl">
                This research hub brings together materials from a collaboration between independent academics and Meta researchers. Explore the study’s publications and a structured guide to how key variables were operationalized across its papers.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#about" className={buttonVariants({ variant: "accent" })}>
                  About the study
                </a>
                <Link
                  href="/variable-operationalization"
                  className={cn(buttonVariants({ variant: "outline" }), "group border-white/35 text-white hover:bg-white/10")}
                >
                  Explore variable operationalization
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="matrix-pattern-light scroll-mt-20 border-y border-[#14213d]/12 bg-[#fffdf8]">
          <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
            <div>
              <Badge>About the study</Badge>
              <h2 className="mt-5 text-5xl leading-none tracking-[-0.035em] sm:text-6xl">A clearer route into complex research</h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-xl leading-9 text-[#263550]">
                The U.S. 2020 Facebook and Instagram Election Study brought together independent external academics and Meta researchers to examine questions about social media, political attitudes, behavior, and information during the election.
              </p>
              <p className="mt-6 leading-8 text-[#52606d]">
                This research hub provides a library of study publications alongside a searchable variable operationalization guide, making it easier to trace research questions, measures, methods, and supporting materials without drawing conclusions beyond the underlying research.
              </p>
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                <a
                  href="https://www.icpsr.umich.edu/sites/somar/search/studies?start=0&fq=PRINCIPAL_INVESTIGATORS_FACET%3AMeta+%28United+States%29&q="
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-[#14213d]/14 bg-white p-5 transition-colors hover:border-[#147d79]/45"
                >
                  <LibraryBig aria-hidden="true" className="size-5 text-[#147d79]" />
                  <span className="mt-8 flex items-center justify-between gap-3 font-semibold">
                    ICPSR-SOMAR replication data <ExternalLink aria-hidden="true" className="size-4 text-[#52606d]" />
                  </span>
                </a>
                <Link
                  href="/related-papers"
                  className="group rounded-2xl border border-[#14213d]/14 bg-white p-5 transition-colors hover:border-[#147d79]/45"
                >
                  <BookOpenText aria-hidden="true" className="size-5 text-[#b94f35]" />
                  <span className="mt-8 flex items-center justify-between gap-3 font-semibold">
                    Study Publications <ArrowRight aria-hidden="true" className="size-4 text-[#52606d] transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
          <div className="grid gap-8 border-b border-[#14213d]/14 pb-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#b94f35] uppercase">Research themes</p>
              <h2 className="mt-4 max-w-2xl text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                Four lenses on the Study - Variable Operationalization
              </h2>
            </div>
            <p className="max-w-2xl self-end text-lg leading-8 text-[#52606d]">
              The variable operationalization library organizes measures by the central questions they help researchers examine, while preserving the paper-level detail needed to compare operational choices.
            </p>
          </div>

          <div className="mt-4 grid md:grid-cols-2">
            {outcomeCategories.map((category, index) => (
              <Link
                href={`/variable-operationalization/${category}`}
                key={category}
                className="group border-b border-[#14213d]/14 py-10 md:odd:border-r md:odd:pr-10 md:even:pl-10"
                aria-label={`Explore ${categoryMeta[category].label} variable operationalization tables`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-editorial text-3xl text-[#147d79]">{themeNumbers[index]}</span>
                  <ArrowRight aria-hidden="true" className="mt-1 size-5 text-[#14213d]/35 transition-transform group-hover:translate-x-1 group-hover:text-[#147d79]" />
                </div>
                <h3 className="mt-12 text-4xl tracking-[-0.025em]">{categoryMeta[category].label}</h3>
                <p className="mt-3 max-w-md leading-7 text-[#52606d]">{categoryMeta[category].description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12"
          aria-label="Explore study resources"
        >
          <div className="grid gap-5">
            <div className="rounded-[2rem] bg-[#14213d] px-7 py-12 text-white sm:px-12 md:flex md:items-end md:justify-between md:gap-10">
              <div>
                <BookOpenText aria-hidden="true" className="size-7" />
                <h2 className="mt-8 max-w-2xl text-5xl leading-none tracking-[-0.035em]">
                  Explore the study publications
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-white/75">
                  Review paper titles, authors, abstracts, publication links, and citations from the study.
                </p>
              </div>
              <Link
                href="/related-papers"
                className={cn(buttonVariants(), "mt-8 shrink-0 bg-white text-[#14213d] hover:bg-[#f7f4ed] md:mt-0")}
              >
                View study publications
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] bg-[#b94f35] px-7 py-12 text-white sm:px-12 md:flex md:items-end md:justify-between md:gap-10">
              <div>
                <LibraryBig aria-hidden="true" className="size-7" />
                <h2 className="mt-8 max-w-2xl text-5xl leading-none tracking-[-0.035em]">
                  Explore the study datasets
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-white/80">
                  Browse SOMAR datasets linked to each paper, including summaries, source records, and citations.
                </p>
              </div>
              <Link
                href="/datasets"
                className={cn(buttonVariants(), "mt-8 shrink-0 bg-white text-[#14213d] hover:bg-[#f7f4ed] md:mt-0")}
              >
                View study datasets
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] bg-[#147d79] px-7 py-12 text-white sm:px-12 md:flex md:items-end md:justify-between md:gap-10">
              <div>
                <SearchCheck aria-hidden="true" className="size-7" />
                <h2 className="mt-8 max-w-2xl text-5xl leading-none tracking-[-0.035em]">
                  See how every variable was operationalized
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-white/75">
                  Search 24 tables, filter by research theme, and compare papers without losing the methodological detail.
                </p>
              </div>
              <Link
                href="/variable-operationalization"
                className={cn(buttonVariants(), "mt-8 shrink-0 bg-white text-[#14213d] hover:bg-[#f7f4ed] md:mt-0")}
              >
                Open the library
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
