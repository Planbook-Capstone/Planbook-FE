import ChatScreenTemplate from "@/components/templates/chat-screen";

export default function Page() {
  const messages = [
    {
      from: "user",
      content:
        "Dựa theo tài liệu hãy giúp tôi tạo ra đề cương giữa kì II theo chuẩn của Bộ Giáo Dục",
    },
    {
      from: "bot",
      content:
        "Vâng, tôi sẽ đọc tài liệu để soạn ra đề cương cho bạn, vui lòng chờ trong ít phút...",
    },
  ];

  const tags = [
    "Giáo án",
    "Kế hoạch giảng dạy",
    "Slide bài giảng",
    "Đề cương thi",
  ];

  const results = [
    {
      name: "Đề cương thi giữa kì II",
      type: "DOC",
    },
    {
      name: "Đề cương hoá học",
      type: "PDF",
    },
  ];

  const documents = [
    {
      type: "PDF",
      name: "Chương 3: Hoá hữu cơ",
      description: "Nghiên cứu các yếu tố ảnh hưởng...",
    },
    {
      type: "DOC",
      name: "Chương 4: Kim loại",
      description: "Tổng hợp kiến thức phản ứng hoá học...",
    },
  ];

  return (
    <div className="h-screen">
      <ChatScreenTemplate
        messages={messages}
        tags={tags}
        results={results}
        documents={documents}
      />
    </div>
  );
}
