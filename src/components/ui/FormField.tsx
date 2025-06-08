import { Label } from "@/components/ui/label";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
};

export function FormField({ label, htmlFor, children, error }: FormFieldProps) {
  return (
    <div className="flex flex-col justify-end gap-1 w-full">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
