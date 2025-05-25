"use client";
import Tag from "@/components/ui/Tag";

export interface Message {
  from: string;
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  tags: string[];
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export default function ChatPanel({
  messages,
  tags,
  inputValue = "",
  onInputChange,
}: ChatPanelProps) {
  return (
    <main className="flex-1 px-6 py-6 flex flex-col">
      <h2 className="sr-only">Cuộc trò chuyện</h2>

      <div className="flex flex-col gap-3">
        {messages.map((msg, idx) =>
          msg.from === "user" ? (
            <div
              key={idx}
              className="bg-gray-100 rounded-md p-4 text-sm text-gray-700 w-fit"
            >
              {msg.content}
            </div>
          ) : (
            <div
              key={idx}
              className="bg-white border rounded-md shadow-sm p-4 w-fit"
            >
              <strong>🤖 Planbook AI</strong>
              <p className="text-sm mt-1 text-gray-600">{msg.content}</p>
            </div>
          )
        )}
      </div>

      <div className="mt-auto pt-6">
        <input
          placeholder="Bắt đầu nhập..."
          value={inputValue}
          onChange={(e) => onInputChange?.(e.target.value)}
          className="w-full border rounded-md px-4 py-3 text-sm shadow-sm"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      </div>
    </main>
  );
}
