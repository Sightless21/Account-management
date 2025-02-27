import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import type { LucideIcon } from "lucide-react"

interface InputAddonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string
  suffix?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  rightIconText?: string
  containerClassName?: string
  prefixClassName?: string
  suffixClassName?: string
  iconClassName?: string
}

const InputAddon = React.forwardRef<HTMLInputElement, InputAddonProps>(
  (
    {
      className,
      prefix,
      suffix,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      rightIconText,
      containerClassName,
      prefixClassName,
      suffixClassName,
      iconClassName,
      type,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("flex items-center rounded-lg border border-input bg-background", containerClassName)}>
        {/* Left Icon */}
        {LeftIcon && (
          <div className={cn(" flex flex-row text-sm border-r px-3 py-2 text-muted-foreground/80", "bg-muted/50", iconClassName)}>
            <LeftIcon className="h-4 w-4" /> <p className="ml-2">{rightIconText}</p>
          </div>
        )}

        {/* Prefix Text */}
        {prefix && (
          <div
            className={cn(
              "border-r px-3 py-2 text-sm text-muted-foreground/80",
              "select-none bg-muted/50",
              prefixClassName,
            )}
          >
            {prefix}
          </div>
        )}

        {/* Input */}
        <Input
          autoComplete={"off"}
          type={type}
          className={cn(
            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            (LeftIcon || prefix) && "rounded-l-none",
            (RightIcon || suffix) && "rounded-r-none",
            className,
          )}
          ref={ref}
          {...props}
        />

        {/* Suffix Text */}
        {suffix && (
          <div
            className={cn(
              "border-l px-3 py-2 text-sm text-muted-foreground/80",
              "select-none bg-muted/50",
              suffixClassName,
            )}
          >
            {suffix}
          </div>
        )}

        {/* Right Icon */}
        {RightIcon && (
          <div className={cn("border-l px-3 py-2 text-muted-foreground/80", "bg-muted/50", iconClassName)}>
            <RightIcon className="h-4 w-4" />
          </div>
        )}
      </div>
    )
  },
)
InputAddon.displayName = "InputAddon"

export { InputAddon }

