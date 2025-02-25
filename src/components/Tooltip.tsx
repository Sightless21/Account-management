import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

// Define the props interface
interface TooltipProps {
  children: ReactNode; // The trigger element to show the tooltip
  content: ReactNode; 
  position?: "top" | "bottom" | "left" | "right";
  delay?: number; // Delay in milliseconds
  className?: string; 
}

const Tooltip = ({ children, content, position = "top", delay = 200, className, ...props}: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={delay}>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={position}
            className={cn(
              "z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95",
              className
            )}
            {...props}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;