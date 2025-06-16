import * as React from "react";
import { cn } from "@/lib/utils";

type InputBaseProps = {
  className?: string;
  asTextarea?: boolean;
} & (
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
  | React.InputHTMLAttributes<HTMLInputElement>
);

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputBaseProps
>(({ className, asTextarea = false, ...props }, ref) => {
  const commonClass = cn(
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    className
  );

  if (asTextarea) {
    return (
      <textarea
        data-slot="textarea"
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={cn(commonClass, "h-16")}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  return (
    <input
      data-slot="input"
      ref={ref as React.Ref<HTMLInputElement>}
      className={commonClass}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
});

Input.displayName = "Input";

export { Input };
