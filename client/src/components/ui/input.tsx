import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-none bg-transparent px-3 py-2 text-base placeholder:text-white/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0 border-b border-white/50 focus-visible:border-b-2 focus-visible:border-white/80",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
