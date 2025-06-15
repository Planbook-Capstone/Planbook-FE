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
    <main className="flex-1 px-6 py-6 flex flex-col border-r border-t border-l rounded-t-2xl">
      <h2 className="text-lg font-calsans mb-4">Cuộc trò chuyện</h2>

      <div className="flex flex-col gap-4 w-full">
        {messages.map((msg, idx) =>
          msg.from === "user" ? (
            <div className="flex justify-end">
              <div
                key={idx}
                className="bg-gray-100 text-base rounded-md p-4 text-gray-700 w-fit border font-questrial"
              >
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={idx} className="bg-white border rounded-md p-4 w-fit">
              <span className="font-calsans">Planbook AI</span>
              <p className="text-base mt-1 text-gray-600 font-questrial">
                {msg.content}
              </p>
            </div>
          )
        )}
      </div>

      <div className="mt-auto p-4 border rounded-md">
        <input
          placeholder="Bắt đầu nhập..."
          value={inputValue}
          onChange={(e) => onInputChange?.(e.target.value)}
          className="w-full border-none rounded-md text-base focus:outline-none active:border-none font-questrial"
        />
      </div>
    </main>
  );
}
