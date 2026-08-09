import Link from "next/link";
import { ArrowRight, BookOpenText, ExternalLink, LibraryBig, SearchCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { categoryMeta, outcomeCategories } from "@/data/outcome-measures";
import { cn } from "@/lib/utils";

const themeNumbers = ["01", "02", "03", "04"];

function ResourceSectionHeader({
  eyebrow,
  heading,
  introduction,
  href,
  linkLabel,
}: {
  eyebrow: string;
  heading: string;
  introduction: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div
      className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0"
      data-editorial-resource-header
    >
      <div className="lg:pr-10 xl:pr-12">
        <p className="text-xs font-bold tracking-[0.18em] text-[#b94f35] uppercase">{eyebrow}</p>
        <h2 className="mt-4 max-w-2xl text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
          {heading}
        </h2>
      </div>
      <div className="max-w-2xl self-end lg:border-l lg:border-[#14213d]/14 lg:pl-10 xl:pl-12">
        <p className="text-lg leading-8 text-[#52606d]">{introduction}</p>
        {href && linkLabel ? (
          <Link href={href} className={cn(buttonVariants(), "group mt-6")}>
            {linkLabel}
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function EditorialResourceSection({
  id,
  eyebrow,
  heading,
  introduction,
  href,
  linkLabel,
  shaded = false,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  introduction: string;
  href: string;
  linkLabel: string;
  shaded?: boolean;
}) {
  return (
    <section
      id={id}
      data-home-resource-section={id}
      data-compact-resource-section
      className={cn(
        "relative scroll-mt-20 overflow-hidden border-b border-[#14213d]/12",
        shaded && "bg-[#fffdf8]",
      )}
    >
      <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <ResourceSectionHeader
          eyebrow={eyebrow}
          heading={heading}
          introduction={introduction}
          href={href}
          linkLabel={linkLabel}
        />
      </div>
    </section>
  );
}

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
                This research hub brings together materials from a collaboration between independent academics and Meta researchers. Explore the study’s publications, linked datasets, and structured documentation of how key variables were operationalized across its papers.
              </p>
              <div className="mt-9 flex flex-wrap gap-3" data-hero-actions>
                <a href="#about" className={buttonVariants({ variant: "accent" })}>
                  About the study
                </a>
                <Link
                  href="/related-papers"
                  className={cn(buttonVariants({ variant: "outline" }), "group border-white/35 text-white hover:bg-white/10")}
                >
                  <BookOpenText aria-hidden="true" className="size-4" />
                  View study publications
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/datasets"
                  className={cn(buttonVariants({ variant: "outline" }), "group border-white/35 text-white hover:bg-white/10")}
                >
                  <LibraryBig aria-hidden="true" className="size-4" />
                  Browse study datasets
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/variable-operationalization"
                  className={cn(buttonVariants({ variant: "outline" }), "group border-white/35 text-white hover:bg-white/10")}
                >
                  <SearchCheck aria-hidden="true" className="size-4" />
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
                This research hub provides libraries of study publications and linked datasets alongside a searchable variable operationalization guide, making it easier to trace research questions, measures, methods, and supporting materials without drawing conclusions beyond the underlying research.
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
                <a
                  href="https://medium.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-[#14213d]/14 bg-white p-5 transition-colors hover:border-[#147d79]/45"
                >
                  <ExternalLink aria-hidden="true" className="size-5 text-[#b94f35]" />
                  <span className="mt-8 flex items-center justify-between gap-3 font-semibold">
                    Project overview <ExternalLink aria-hidden="true" className="size-4 text-[#52606d]" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <EditorialResourceSection
          id="study-publications"
          eyebrow="Publication library"
          heading="Study Publications"
          introduction="Browse all peer-reviewed and forthcoming papers from the U.S. 2020 Facebook and Instagram Election Study. View complete author lists, abstracts, publication links, and formatted citations for each paper."
          href="/related-papers"
          linkLabel="Browse study publications"
        />

        <EditorialResourceSection
          id="study-datasets"
          eyebrow="Dataset library"
          heading="Study Datasets"
          introduction="Explore SOMAR replication datasets linked to each study publication. Review concise dataset summaries, open source records, and access complete citation information."
          href="/datasets"
          linkLabel="Explore study datasets"
          shaded
        />

        <section
          id="variable-operationalization"
          data-home-resource-section="variable-operationalization"
          data-compact-resource-section
          className="relative scroll-mt-20 overflow-hidden border-b border-[#14213d]/12"
        >
          <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-8 md:py-20 lg:px-12">
            <ResourceSectionHeader
              eyebrow="Variable Library"
              heading="Four lenses on the Study - Variable Operationalization"
              introduction="The variable operationalization library organizes measures by the central questions they help researchers examine, while preserving the paper-level detail needed to compare operational choices."
            />

            <div
              className="mt-12 grid border-t border-[#14213d]/14 md:grid-cols-2 xl:grid-cols-4"
              data-variable-theme-grid
              data-variable-theme-layout="responsive-row"
            >
              {outcomeCategories.map((category, index) => (
                <Link
                  href={`/variable-operationalization/${category}`}
                  key={category}
                  className="group border-b border-[#14213d]/14 py-8 transition-colors hover:bg-white/45 md:odd:border-r md:odd:pr-8 md:even:pl-8 xl:px-6 xl:odd:pr-6 xl:even:pl-6 xl:first:pl-0 xl:last:pr-0 xl:[&:not(:last-child)]:border-r"
                  aria-label={`Explore ${categoryMeta[category].label} variable operationalization tables`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-editorial text-3xl text-[#147d79]">{themeNumbers[index]}</span>
                    <ArrowRight aria-hidden="true" className="mt-1 size-5 text-[#14213d]/35 transition-transform group-hover:translate-x-1 group-hover:text-[#147d79]" />
                  </div>
                  <h3 className="mt-8 text-3xl tracking-[-0.025em] md:text-4xl xl:text-3xl">
                    {categoryMeta[category].label}
                  </h3>
                  <p className="mt-2 max-w-md leading-6 text-[#52606d]">{categoryMeta[category].description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="explore-resources"
          data-home-resource-section="explore-resources"
          className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12"
          aria-label="Explore study resources"
        >
          <div className="overflow-hidden rounded-[2rem] bg-[#14213d] px-7 py-12 text-white sm:px-12 md:py-14">
            <div className="grid gap-6 border-b border-white/15 pb-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-[#8ed3cc] uppercase">Research hub</p>
                <h2 className="mt-4 max-w-xl text-5xl leading-none tracking-[-0.035em] sm:text-6xl">
                  Explore the study
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/70">
                Move between the study publications, linked SOMAR datasets, and detailed variable operationalization documentation.
              </p>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-3" data-resource-destination-tiles>
              <Link
                href="/related-papers"
                className="group flex min-h-64 flex-col rounded-2xl border-t-[3px] border-[#14213d] bg-white p-6 text-[#14213d] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ed3cc]"
              >
                <BookOpenText aria-hidden="true" className="size-6 text-[#14213d]" />
                <h3 className="mt-10 text-3xl tracking-[-0.025em]">Study Publications</h3>
                <p className="mt-3 leading-7 text-[#52606d]">Review paper details, abstracts, publication links, and citations.</p>
                <span className="mt-auto flex items-center justify-between pt-8 text-sm font-bold">
                  View publications
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/datasets"
                className="group flex min-h-64 flex-col rounded-2xl border-t-[3px] border-[#b94f35] bg-white p-6 text-[#14213d] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f18b6f]"
              >
                <LibraryBig aria-hidden="true" className="size-6 text-[#b94f35]" />
                <h3 className="mt-10 text-3xl tracking-[-0.025em]">Study Datasets</h3>
                <p className="mt-3 leading-7 text-[#52606d]">Browse linked SOMAR records, summaries, source links, and citations.</p>
                <span className="mt-auto flex items-center justify-between pt-8 text-sm font-bold">
                  View datasets
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/variable-operationalization"
                className="group flex min-h-64 flex-col rounded-2xl border-t-[3px] border-[#147d79] bg-white p-6 text-[#14213d] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ed3cc]"
              >
                <SearchCheck aria-hidden="true" className="size-6 text-[#147d79]" />
                <h3 className="mt-10 text-3xl tracking-[-0.025em]">Variable Operationalization</h3>
                <p className="mt-3 leading-7 text-[#52606d]">Search measures by theme, paper, or outcome while preserving methodological detail.</p>
                <span className="mt-auto flex items-center justify-between pt-8 text-sm font-bold">
                  Open the library
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
