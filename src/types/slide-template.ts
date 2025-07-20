import { SlideElement } from "@/types";

export interface SlideTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category: "education" | "business" | "presentation" | "other";
  slides: SlideTemplateSlide[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublic: boolean;
  tags: string[];
}

export interface SlideTemplateSlide {
  id: string;
  title: string;
  elements: SlideElement[];
  background?: string;
  isVisible: boolean;
}

export interface SlideTemplateFormData {
  name: string;
  description?: string;
  category: SlideTemplate["category"];
  isPublic: boolean;
  tags: string[];
  slides: SlideTemplateSlide[];
}

export const TEMPLATE_CATEGORIES = [
  { value: "education", label: "Giáo dục" },
  { value: "business", label: "Kinh doanh" },
  { value: "presentation", label: "Thuyết trình" },
  { value: "other", label: "Khác" },
] as const;
