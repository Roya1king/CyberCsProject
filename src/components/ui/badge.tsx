import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Define variants for the badge (default, secondary, destructive, outline)
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600/20 text-blue-400 hover:bg-blue-600/30",
        secondary:
          "border-transparent bg-gray-700 text-gray-300 hover:bg-gray-600",
        destructive:
          "border-transparent bg-red-600/20 text-red-400 hover:bg-red-600/30",
        success:
          "border-transparent bg-green-600/20 text-green-400 hover:bg-green-600/30",
        outline:
          "text-gray-300 border border-gray-600 hover:bg-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
