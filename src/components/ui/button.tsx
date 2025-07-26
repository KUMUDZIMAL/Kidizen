import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-kid text-kid-base font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 kid-button",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-kid hover:shadow-kid-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-kid hover:shadow-kid-lg",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-kid hover:shadow-kid-lg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-kid hover:shadow-kid-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Child-friendly variants
        kid: "bg-gradient-to-r from-kid-blue to-kid-purple text-white hover:from-kid-purple hover:to-kid-pink shadow-kid-glow hover:shadow-kid-glow-purple",
        kidPink: "bg-gradient-to-r from-kid-pink to-kid-purple text-white hover:from-kid-purple hover:to-kid-pink shadow-kid-glow-pink hover:shadow-kid-glow-purple",
        kidGreen: "bg-gradient-to-r from-kid-green to-kid-teal text-white hover:from-kid-teal hover:to-kid-green shadow-kid-glow hover:shadow-kid-glow-purple",
        kidYellow: "bg-gradient-to-r from-kid-yellow to-kid-orange text-gray-800 hover:from-kid-orange hover:to-kid-yellow shadow-kid-glow hover:shadow-kid-glow-purple",
        kidOrange: "bg-gradient-to-r from-kid-orange to-kid-yellow text-white hover:from-kid-yellow hover:to-kid-orange shadow-kid-glow hover:shadow-kid-glow-purple",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-kid hover:shadow-kid-lg",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-kid hover:shadow-kid-lg",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-kid px-4 py-2 text-kid-sm",
        lg: "h-14 rounded-kid-lg px-8 py-4 text-kid-lg",
        xl: "h-16 rounded-kid-xl px-10 py-5 text-kid-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
