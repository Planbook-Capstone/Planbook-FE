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
    <aside className="w-full max-w-xs border-r border-t border-l px-6 py-6 rounded-t-2xl">
      <h2 className="text-xl font-calsans mb-4">Kết quả</h2>
      <div className="space-y-3">
        {results.map((result, idx) => (
          <ResultItem key={idx} {...result} />
        ))}
      </div>
    </aside>
  );
}
