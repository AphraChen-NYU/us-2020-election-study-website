import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/12 bg-[#0b162d] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
        <div>
          <p className="font-editorial text-2xl">U.S. 2020 Facebook and Instagram Election Study</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
            A research hub bringing together study publications, research themes, and detailed documentation of how key variables were operationalized.
          </p>
        </div>
        <div className="grid content-start gap-3 text-sm">
          <Link
            href="/related-papers"
            className="rounded-sm font-semibold text-white transition-colors hover:text-[#8ed3cc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ed3cc]"
          >
            Browse study publications
          </Link>
          <Link
            href="/variable-operationalization"
            className="rounded-sm font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ed3cc]"
          >
            Explore variable operationalization
          </Link>
          <Link
            href="/placeholder-1"
            className="rounded-sm font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ed3cc]"
          >
            Placeholder 1
          </Link>
          <Link
            href="/placeholder-2"
            className="rounded-sm font-semibold text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ed3cc]"
          >
            Placeholder 2
          </Link>
        </div>
      </div>
    </footer>
  );
}
