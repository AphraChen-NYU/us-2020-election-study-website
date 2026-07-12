import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#147d79]/25 bg-[#147d79]/8 px-2.5 py-1 text-xs font-semibold tracking-wide text-[#0e615e]",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
