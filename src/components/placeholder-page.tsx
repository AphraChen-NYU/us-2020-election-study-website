import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlaceholderPageProps {
  pageNumber: "01" | "02";
  title: string;
  description: string;
}

export function PlaceholderPage({ pageNumber, title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-[#f7f4ed]">
      <SiteHeader />
      <main className="matrix-pattern-light grid min-h-[calc(100vh-80px)] place-items-center px-5 py-16">
        <section className="w-full max-w-3xl rounded-[2rem] border border-[#14213d]/12 bg-[#fffdf8] p-8 shadow-[0_28px_90px_rgba(20,33,61,0.08)] sm:p-14">
          <Badge>Future section</Badge>
          <p className="mt-10 font-editorial text-[7rem] leading-none text-[#147d79]/18 sm:text-[10rem]">{pageNumber}</p>
          <h1 className="-mt-10 text-6xl tracking-[-0.04em] sm:text-7xl">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#52606d]">{description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
              <ArrowLeft aria-hidden="true" className="size-4" /> Back to home
            </Link>
            <Link href="/variable-operationalization" className={cn(buttonVariants({ variant: "accent" }))}>
              Explore variable operationalization <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
