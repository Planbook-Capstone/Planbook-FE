"use client";

import ChatBox from "@/components/organisms/chat-box";

// Mock function to simulate AI response
export const mockAIResponse = async (message: string): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // Simple mock responses
  const responses = [
    "Cảm ơn bạn đã hỏi! Tôi sẽ giúp bạn giải đáp vấn đề này.",
    "Đây là một câu hỏi thú vị. Hãy để tôi suy nghĩ một chút...",
    "Tôi hiểu vấn đề của bạn. Đây là gợi ý của tôi:",
    "Dựa trên thông tin bạn cung cấp, tôi nghĩ rằng...",
    "Đó là một ý tưởng hay! Bạn có thể thử cách này:",
  ];

  // More specific responses based on keywords
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("giáo án") || lowerMessage.includes("bài học")) {
    return "Tôi có thể giúp bạn tạo giáo án chi tiết. Bạn muốn tạo giáo án cho môn học nào và lớp nào?";
  }

  if (lowerMessage.includes("học sinh") || lowerMessage.includes("lớp học")) {
    return "Về quản lý lớp học và học sinh, tôi có thể đưa ra những gợi ý phù hợp với từng độ tuổi và môn học.";
  }

  if (lowerMessage.includes("đánh giá") || lowerMessage.includes("kiểm tra")) {
    return "Tôi có thể hỗ trợ bạn tạo các câu hỏi đánh giá, thiết kế bài kiểm tra phù hợp với mục tiêu học tập.";
  }

  if (lowerMessage.includes("xin chào") || lowerMessage.includes("hello")) {
    return "Xin chào! Rất vui được hỗ trợ bạn. Bạn cần giúp đỡ gì về việc giảng dạy và tạo giáo án?";
  }

  // Random response for other messages
  return (
    responses[Math.floor(Math.random() * responses.length)] +
    " " +
    `Bạn vừa nói: "${message}". Tôi sẽ cố gắng hỗ trợ bạn tốt nhất có thể!`
  );
};

export default function ChatBoxDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-calsans text-gray-900 mb-8">
          Demo ChatBox Component
        </h1>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-calsans text-gray-800 mb-4">
            Hướng dẫn sử dụng
          </h2>
          <div className="space-y-3 text-gray-600 font-questrial">
            <p>• ChatBox sẽ xuất hiện ở góc màn hình (có thể thay đổi)</p>
            <p>• Click vào icon để mở/đóng chat</p>
            <p>• Hover vào button chat để hiện settings thay đổi vị trí</p>
            <p>• Badge hiển thị số tin nhắn chưa đọc</p>
            <p>• Icon đóng sẽ hiển thị dấu X</p>
            <p>• Vị trí được lưu vào localStorage</p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-calsans text-blue-900 mb-2">
              Thử các câu hỏi:
            </h3>
            <ul className="text-sm text-blue-800 font-questrial space-y-1">
              <li>• "Giúp tôi tạo giáo án môn Toán lớp 5"</li>
              <li>• "Làm thế nào để quản lý lớp học hiệu quả?"</li>
              <li>• "Tạo câu hỏi đánh giá cho bài học"</li>
              <li>• "Xin chào, bạn có thể giúp gì?"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ChatBox Component */}
      <ChatBox
        position="bottom-left"
        size="md"
        variant="default"
        title="PlanBook AI Assistant"
        placeholder="Nhập câu hỏi của bạn..."
        showBadge={true}
      />
    </div>
  );
}
