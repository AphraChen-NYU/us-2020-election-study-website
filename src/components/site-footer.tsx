import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/12 bg-[#0b162d] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
        <div>
          <p className="font-editorial text-2xl">U.S. 2020 Facebook and Instagram Election Study</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
            A local research interface for exploring how variables were operationalized across the study’s papers.
          </p>
        </div>
        <div className="grid content-start gap-3 text-sm">
          <Link href="/variable-operationalization" className="font-semibold text-white hover:text-[#8ed3cc]">
            Explore variable operationalization
          </Link>
          <Link href="/placeholder-1" className="text-white/70 hover:text-white">
            Placeholder 1
          </Link>
          <Link href="/placeholder-2" className="text-white/70 hover:text-white">
            Placeholder 2
          </Link>
          <a
            href="https://www.icpsr.umich.edu/sites/icpsr/news/data-from-u-s-2020-presidential-election-facebook-and-instagram-study-now-available-at-icpsr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white"
          >
            ICPSR study overview <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
