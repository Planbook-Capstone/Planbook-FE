"use client";
import ChatPanel, { Message } from "@/components/organisms/chat-panel";
import DocumentSource, {
  Document,
} from "@/components/organisms/document-source";
import ResultPanel, { Result } from "@/components/organisms/result-panel";

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
  return (
    <div className="flex h-full">
      <DocumentSource documents={documents} />
      <ChatPanel
        messages={messages}
        tags={tags}
        inputValue={inputValue}
        onInputChange={onInputChange}
      />
      <ResultPanel results={results} onDelete={onDelete} />
    </div>
  );
}
