"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/related-papers", label: "Study Publications" },
  { href: "/variable-operationalization", label: "Variable Operationalization" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#14213d]/10 bg-[#f7f4ed]/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 md:px-5 lg:px-8 xl:px-12">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="U.S. 2020 Election Study home"
        >
          <span aria-hidden="true" className="grid size-9 grid-cols-2 gap-1 rounded-md bg-[#14213d] p-1.5">
            <span className="rounded-[1px] bg-[#f7f4ed]" />
            <span className="rounded-[1px] bg-[#147d79]" />
            <span className="rounded-[1px] bg-[#b94f35]" />
            <span className="rounded-[1px] bg-[#f7f4ed]" />
          </span>
          <span className="max-w-[220px] text-sm font-semibold leading-tight tracking-[-0.01em] text-[#14213d] sm:text-base md:hidden xl:block">
            U.S. 2020 Election Study
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden min-w-0 items-center gap-0.5 md:flex xl:gap-1">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-2.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors lg:px-3 lg:text-[0.8rem] xl:px-4 xl:py-2.5 xl:text-sm",
                  active ? "bg-[#14213d] text-white" : "text-[#52606d] hover:bg-[#14213d]/6 hover:text-[#14213d]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-[#14213d]/20 text-[#14213d] md:hidden"
        >
          {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#14213d]/10 px-5 py-4 md:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-1">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-semibold",
                    active ? "bg-[#14213d] text-white" : "text-[#52606d] hover:bg-[#14213d]/6",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
