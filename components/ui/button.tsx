import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "beer" | "danger"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-beer text-beer-foreground hover:bg-beer/90 shadow-lg shadow-beer/30": variant === "default",
            "border-2 border-beer bg-transparent text-beer hover:bg-beer/10": variant === "outline",
            "bg-transparent text-foreground hover:bg-muted": variant === "ghost",
            "bg-gradient-to-r from-beer to-amber-500 text-black hover:from-amber-500 hover:to-beer shadow-lg shadow-beer/40": variant === "beer",
            "bg-red-500 text-white hover:bg-red-600": variant === "danger",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-base": size === "md",
            "px-6 py-3 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
