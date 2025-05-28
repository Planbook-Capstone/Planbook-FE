"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

const answerOptionVariants = cva(
  "flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer text-sm",
  {
    variants: {
      selected: {
        true: "border-black bg-gray-50",
        false: "hover:bg-gray-50",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

interface AnswerOptionProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof answerOptionVariants> {
  label: string;
  multiple?: boolean;
}

export default function AnswerOption({
  label,
  selected,
  multiple = false,
  className,
  ...props
}: AnswerOptionProps) {
  return (
    <label className={cn(answerOptionVariants({ selected, className }))}>
      <input
        type={multiple ? "checkbox" : "radio"}
        className="form-radio"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
