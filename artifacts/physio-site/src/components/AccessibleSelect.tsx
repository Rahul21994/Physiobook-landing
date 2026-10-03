import * as React from "react";
import { cn } from "@/lib/utils";

export interface AccessibleSelectOption {
  value: string;
  label: string;
  testId?: string;
}

export interface AccessibleSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder: string;
  options: AccessibleSelectOption[];
}

export const AccessibleSelect = React.forwardRef<
  HTMLSelectElement,
  AccessibleSelectProps
>(({ className, placeholder, options, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
      className,
    )}
    {...props}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value} data-testid={option.testId}>
        {option.label}
      </option>
    ))}
  </select>
));

AccessibleSelect.displayName = "AccessibleSelect";
