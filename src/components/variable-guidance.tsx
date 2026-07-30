import Link from "next/link";

interface VariableGuidanceProps {
  kind: "scope" | "variableNames";
  className?: string;
}

export function VariableGuidance({ kind, className = "" }: VariableGuidanceProps) {
  const isScope = kind === "scope";

  if (isScope) {
    return (
      <aside
        aria-label="Variable scope guidance"
        data-variable-guidance={kind}
        className={`relative py-2 pl-6 ${className}`}
      >
        <span aria-hidden="true" className="absolute top-2 left-0 h-12 w-1 rounded-full bg-[#b94f35]" />
        <p className="max-w-6xl text-[0.95rem] leading-7 text-[#35435b] sm:text-base sm:leading-8">
          The variable descriptions below are for common measures used across the papers. For variables that were used
          primarily in only one study (e.g. emotional state - Allcott et al., forthcoming; deceptive online networks -
          Appel et al., 2026; diffusion and ideological segregation - González-Bailón et al., 2023, 2024), please see the{" "}
          <Link
            href="/related-papers"
            className="font-semibold text-[#147d79] underline decoration-[#147d79]/35 underline-offset-4 transition-colors hover:text-[#0f625f] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
          >
            individual papers
          </Link>
          .
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Variable-name note"
      data-variable-guidance={kind}
      className={`grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 border-t border-[#14213d]/14 pt-5 sm:gap-6 sm:pt-6 ${className}`}
    >
      <p className="font-editorial text-xl leading-7 text-[#147d79] sm:text-2xl sm:leading-8">Note:</p>
      <p className="max-w-5xl text-[0.95rem] leading-7 text-[#35435b] sm:text-base sm:leading-8">
        When variable names are included in the variable details on this website, these refer to the variable names as
        included in the supplemental appendices of the papers.
      </p>
    </aside>
  );
}
