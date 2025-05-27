"use client";
import DocumentItem from "@/components/molecules/document-item";

export interface Document {
  type: string;
  name: string;
  description: string;
}

interface DocumentSourceProps {
  documents: Document[];
  onAdd?: () => void;
}

export default function DocumentSource({
  documents,
  onAdd,
}: DocumentSourceProps) {
  return (
    <aside className="w-full max-w-xs border-r border-t border-l px-6 py-6 rounded-t-2xl">
      <h2 className="text-xl font-calsans mb-4">Nguồn tài liệu</h2>
      <div className="space-y-3">
        {documents.map((doc, idx) => (
          <DocumentItem key={idx} {...doc} />
        ))}
        <button
          onClick={onAdd}
          className="w-full border border-dashed rounded-sm py-2 text-base hover:bg-gray-50 text-start pl-4"
        >
          + Thêm tài liệu
        </button>
      </div>
    </aside>
  );
}
