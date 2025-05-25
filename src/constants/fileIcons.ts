export type FileType =
  | "PDF"
  | "DOC"
  | "DOCX"
  | "XLS"
  | "XLSX"
  | "PPT"
  | "PPTX"
  | "TXT"
  | "CSV";

export const FILE_ICONS: Partial<Record<FileType, string>> = {
  PDF: "/images/files/PDF.svg",
  DOC: "/images/files/DOC.svg",
  DOCX: "/images/files/DOC.svg",
};
