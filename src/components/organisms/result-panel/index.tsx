"use client";
import ResultItem from "@/components/molecules/result-item";

export interface Result {
  name: string;
  type: string;
}

interface ResultPanelProps {
  results: Result[];
  onDelete?: () => void;
}

export default function ResultPanel({ results, onDelete }: ResultPanelProps) {
  return (
    <aside className="w-full max-w-xs border-l px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">Kết quả</h2>
      <div className="space-y-3">
        {results.map((result, idx) => (
          <ResultItem key={idx} {...result} />
        ))}
      </div>
    </aside>
  );
}
