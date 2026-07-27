import type { Metadata } from "next";
import { RelatedPapersList } from "@/components/related-papers-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Study Publications",
  description: "Peer-reviewed and forthcoming papers from the U.S. 2020 Facebook and Instagram Election Study.",
};

export default function RelatedPapersPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ed]">
      <SiteHeader />
      <main>
        <section className="matrix-pattern relative overflow-hidden bg-[#14213d] text-white">
          <div aria-hidden="true" className="absolute -top-28 right-0 size-[460px] rounded-full bg-[#147d79]/30 blur-3xl" />
          <div className="relative mx-auto flex min-h-[380px] max-w-[1440px] items-end px-5 py-12 sm:px-8 md:py-16 lg:px-12">
            <div className="max-w-5xl">
              <Badge className="border-white/20 bg-white/8 text-white">Research publications</Badge>
              <h1 className="mt-6 max-w-5xl text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.92] tracking-[-0.045em] text-balance">
                Study publications
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/72">
                Browse publications from the U.S. 2020 Facebook and Instagram Election Study.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
          <div className="mb-8 border-b border-[#14213d]/14 pb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#b94f35] uppercase">Publication library</p>
              <h2 className="mt-3 text-3xl leading-none tracking-[-0.03em] sm:text-4xl">Study papers</h2>
            </div>
          </div>

          <RelatedPapersList />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
