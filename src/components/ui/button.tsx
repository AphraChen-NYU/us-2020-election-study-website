import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#14213d] px-5 py-3 text-white hover:bg-[#0b162d]",
        accent: "bg-[#147d79] px-5 py-3 text-white hover:bg-[#0e615e]",
        outline: "border border-[#14213d]/25 bg-transparent px-5 py-3 text-[#14213d] hover:bg-[#14213d]/5",
        ghost: "px-3 py-2 text-[#14213d] hover:bg-[#14213d]/7",
      },
      size: {
        default: "min-h-11",
        sm: "min-h-9 px-4 py-2 text-xs",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
