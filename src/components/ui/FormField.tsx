import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  children,
  error,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col justify-end gap-1 w-full", className)}>
      {label && (
        <Label className="text-xs font-questrial pl-2" htmlFor={htmlFor}>
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
