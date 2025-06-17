"use client";

import ChatPanel, { Message } from "@/components/organisms/chat-panel";
import DocumentSource, {
  Document,
} from "@/components/organisms/document-source";
import ResultPanel, { Result } from "@/components/organisms/result-panel";
import { useState } from "react";

interface ChatScreenTemplateProps {
  messages: Message[];
  tags: string[];
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onDelete?: () => void;
  results: Result[];
  documents: Document[];
}

export default function ChatScreenTemplate({
  messages,
  tags,
  results,
  documents,
  inputValue,
  onInputChange,
  onDelete,
}: ChatScreenTemplateProps) {
  const [activeTab, setActiveTab] = useState<"document" | "chat" | "result">(
    "chat"
  );

  return (
    <div className="h-full w-full flex flex-col md:flex-row px-2 md:px-8 pt-2 gap-3">
      <div className="flex md:hidden justify-around border-b">
        <button
          onClick={() => setActiveTab("document")}
          className={`py-2 px-4 text-sm font-questrial cursor-pointer ${
            activeTab === "document"
              ? "border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          Tài liệu
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`py-2 px-4 text-sm font-questrial cursor-pointer ${
            activeTab === "chat" ? "border-b-2 border-black" : "text-gray-500"
          }`}
        >
          Trò chuyện
        </button>
        <button
          onClick={() => setActiveTab("result")}
          className={`py-2 px-4 text-sm font-questrial cursor-pointer ${
            activeTab === "result" ? "border-b-2 border-black" : "text-gray-500"
          }`}
        >
          Kết quả
        </button>
      </div>

      <div className="hidden md:block w-2/5 h-full">
        <DocumentSource documents={documents} />
      </div>
      <div className="hidden md:block w-full h-full">
        <ChatPanel
          messages={messages}
          tags={tags}
          inputValue={inputValue}
          onInputChange={onInputChange}
        />
      </div>
      <div className="hidden md:block w-2/5 h-full">
        <ResultPanel results={results} onDelete={onDelete} />
      </div>

      <div className="md:hidden w-full h-full">
        {activeTab === "document" && <DocumentSource documents={documents} />}
        {activeTab === "chat" && (
          <ChatPanel
            messages={messages}
            tags={tags}
            inputValue={inputValue}
            onInputChange={onInputChange}
          />
        )}
        {activeTab === "result" && (
          <ResultPanel results={results} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
}
