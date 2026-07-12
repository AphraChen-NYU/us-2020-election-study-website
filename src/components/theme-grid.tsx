import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryMeta, outcomeCategories } from "@/data/outcome-measures";

const themeNumbers = ["01", "02", "03", "04"];

interface ThemeGridProps {
  className?: string;
}

export function ThemeGrid({ className = "" }: ThemeGridProps) {
  return (
    <div className={`grid border-t border-l border-[#14213d]/14 md:grid-cols-2 ${className}`}>
      {outcomeCategories.map((category, index) => (
        <Link
          href={`/variable-operationalization/${category}`}
          key={category}
          className="group flex min-h-[300px] flex-col border-r border-b border-[#14213d]/14 bg-[#f7f4ed] p-7 transition-colors hover:bg-[#fffdf8] focus-visible:z-10 sm:min-h-[340px] sm:p-10 lg:min-h-[390px]"
          aria-label={`View ${categoryMeta[category].label} variable operationalization tables`}
        >
          <div className="flex items-start justify-between gap-6">
            <span className="font-editorial text-5xl text-[#147d79] sm:text-6xl">{themeNumbers[index]}</span>
            <ArrowRight aria-hidden="true" className="mt-1 size-7 text-[#14213d]/35 transition-all group-hover:translate-x-1 group-hover:text-[#147d79]" />
          </div>
          <div className="mt-auto pt-16">
            <h2 className="text-5xl tracking-[-0.035em] sm:text-6xl">{categoryMeta[category].label}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#52606d] sm:text-xl">
              {categoryMeta[category].description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
