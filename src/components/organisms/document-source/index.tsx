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
    <aside className="w-full max-w-xs border-r px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">Nguồn tài liệu</h2>
      <div className="space-y-3">
        {documents.map((doc, idx) => (
          <DocumentItem key={idx} {...doc} />
        ))}
        <button
          onClick={onAdd}
          className="w-full border border-dashed rounded-md py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          + Thêm tài liệu
        </button>
      </div>
    </aside>
  );
}
