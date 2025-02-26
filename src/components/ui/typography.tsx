import * as React from "react"
import { cn } from "@/lib/utils"

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {

  as?: "h1" | "h2" | "h3" | "h4" | "p" 
}

const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
    {...props}
  />
))
H1.displayName = "H1"

const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)}
    {...props}
  />
))
H2.displayName = "H2"

const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
))
H3.displayName = "H3"

const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(({ className, ...props }, ref) => (
  <h4 ref={ref} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props} />
))
H4.displayName = "H4"

const P = React.forwardRef<HTMLParagraphElement, TypographyProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
))
P.displayName = "P"

const BlockQuote = React.forwardRef<HTMLQuoteElement, React.BlockquoteHTMLAttributes<HTMLQuoteElement>>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn("mt-6 border-l-2 border-border pl-6 italic text-muted-foreground", className)}
    {...props}
  />
))
BlockQuote.displayName = "BlockQuote"

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
  ),
)
List.displayName = "List"

const InlineCode = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm", className)}
    {...props}
  />
))
InlineCode.displayName = "InlineCode"

const Lead = React.forwardRef<HTMLParagraphElement, TypographyProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xl text-muted-foreground", className)} {...props} />
))
Lead.displayName = "Lead"

const Large = React.forwardRef<HTMLDivElement, TypographyProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
Large.displayName = "Large"

const Small = React.forwardRef<HTMLElement, TypographyProps>(({ className, ...props }, ref) => (
  <small ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />
))
Small.displayName = "Small"

const Muted = React.forwardRef<HTMLParagraphElement, TypographyProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
Muted.displayName = "Muted"

export { H1, H2, H3, H4, P, BlockQuote, List, InlineCode, Lead, Large, Small, Muted }