"use client";

import FallingText from "@/components/ui/FallingText";
import { memo, useEffect, useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "Làm sao để bắt đầu tạo giáo án trên Planbook?",
    answer:
      "Bạn chỉ cần đăng nhập tài khoản giáo viên, chọn mục 'Tạo giáo án', sau đó chọn môn học, khối lớp và mẫu giáo án phù hợp.",
  },
  {
    question: "Planbook hỗ trợ những môn học nào?",
    answer:
      "Hiện tại hệ thống hỗ trợ các môn Toán, Ngữ văn, Vật lí, Hóa học, Sinh học, Lịch sử, Địa lí, GDCD và một số môn chuyên biệt khác cho bậc THPT.",
  },
  {
    question: "Tôi có thể chia sẻ giáo án với đồng nghiệp không?",
    answer:
      "Hoàn toàn có thể. Bạn chỉ cần chọn nút 'Chia sẻ', nhập email hoặc mã tổ bộ môn để gửi lời mời đến đồng nghiệp.",
  },
  {
    question: "Giáo án có được lưu trữ theo năm học không?",
    answer:
      "Có. Mỗi giáo án sẽ được lưu kèm theo năm học và học kỳ tương ứng, giúp bạn dễ dàng tìm kiếm và tái sử dụng.",
  },
  {
    question: "Tôi có thể sử dụng Planbook trên điện thoại không?",
    answer:
      "Có thể. Giao diện của Planbook được tối ưu cho cả máy tính và điện thoại, giúp bạn sử dụng mọi lúc mọi nơi.",
  },
];

const FallingTextContainer = memo(() => {
  const [wordData, setWordData] = useState<
    Array<{ text: string; bgColor: string; textColor: string }>
  >([]);
  const [fallingKey, setFallingKey] = useState(0);

  const fullWordData = [
    { text: "Sáng tạo", bgColor: "#000", textColor: "#fff" },
    { text: "Tối giản", bgColor: "#5E90F1", textColor: "#fff" },
    { text: "Tinh tế", bgColor: "#25BEE5", textColor: "#fff" },
    { text: "Mộng mơ", bgColor: "#7147E4", textColor: "#fff" },
    { text: "Hiện đại", bgColor: "#5CCA6A", textColor: "#fff" },
    { text: "Nổi bật", bgColor: "#2AD6DD", textColor: "#fff" },
    { text: "Năng động", bgColor: "#D5B0F8", textColor: "#fff" },
    { text: "Phóng khoáng", bgColor: "#D950BE", textColor: "#fff" },
    { text: "Cổ điển", bgColor: "#0CB68B", textColor: "#fff" },
  ];

  const getRandomHalf = useMemo(() => {
    return (arr: typeof fullWordData) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.ceil(arr.length / 2));
    };
  }, []);

  // Initialize wordData on first load
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const initialWordData = mobile ? getRandomHalf(fullWordData) : fullWordData;
    setWordData(initialWordData);
  }, []);

  // Handle resize events only
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const checkMobile = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        const newWordData = mobile ? getRandomHalf(fullWordData) : fullWordData;

        setWordData((prevData) => {
          const dataChanged =
            JSON.stringify(prevData) !== JSON.stringify(newWordData);
          if (dataChanged) {
            setFallingKey((prev) => prev + 1);
            return newWordData;
          }
          return prevData;
        });
      }, 150);
    };

    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div
      key={`falling-${fallingKey}`}
      className="absolute inset-0 transition-opacity duration-300 ease-in-out -z-10"
      style={{
        opacity: wordData.length > 0 ? 1 : 0,
      }}
    >
      {wordData.length > 0 && (
        <FallingText
          key={`text-${fallingKey}`}
          wordData={wordData}
          gravity={0.9}
          trigger="auto"
        />
      )}
    </div>
  );
});

FallingTextContainer.displayName = "FallingTextContainer";

export const FAQsSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="px-4 md:px-6 lg:px-8">
      <div className="max-w-[1340px] mx-auto h-auto text-black rounded-2xl border relative overflow-hidden px-16 py-16">
        <FallingTextContainer />
        <div className="grid md:grid-cols-2 gap-10 items-start z-10">
          {/* Left Side */}
          <div>
            <h2 className="text-4xl font-calsans mb-6">Câu hỏi thường gặp</h2>
            <p className="text-muted-foreground mb-8">
              Chúng tôi luôn sẵn sàng hỗ trợ giáo viên trong quá trình sử dụng
              hệ thống Planbook. Dưới đây là những câu hỏi phổ biến.
            </p>
            <div className="flex items-center gap-6">
              <button className="border px-6 py-3 rounded-full font-medium">
                Xem thêm
              </button>
              <a href="/lien-he" className="underline font-medium">
                Liên hệ
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border-b pb-6">
                  <button
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <h3 className="text-xl font-calsans">{faq.question}</h3>
                    {isOpen ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-3 animate-fade-in">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
