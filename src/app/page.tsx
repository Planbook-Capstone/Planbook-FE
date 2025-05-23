import Link from "next/link";

import MainLayout from "@/components/layout/MainLayout";
import Banner from "@/components/organisms/banner";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Dữ liệu tính năng AI
  const aiFeatures = [
    {
      id: 1,
      title: "Lập kế hoạch thông minh",
      description:
        "AI phân tích sở thích của bạn để tạo lịch trình chuyến đi phù hợp nhất",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Gợi ý cá nhân hóa",
      description:
        "AI học từ lựa chọn trước đây để đề xuất điểm đến và trải nghiệm phù hợp",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Phân tích đánh giá",
      description:
        "AI xử lý hàng nghìn đánh giá để đưa ra thông tin chính xác về điểm đến",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      ),
    },
  ];

  // Dữ liệu điểm đến được AI khuyên dùng
  const aiRecommendedDestinations = [
    {
      id: 1,
      name: "Kyoto",
      country: "Nhật Bản",
      description:
        "Được AI đề xuất cho người yêu thích văn hóa truyền thống và nghệ thuật",
      matchScore: 97,
      imageUrl: "/images/kyoto.jpg", // Thay bằng đường dẫn thực tế
    },
    {
      id: 2,
      name: "Barcelona",
      country: "Tây Ban Nha",
      description:
        "Phù hợp với các nhà thám hiểm đô thị thích kiến trúc và ẩm thực",
      matchScore: 95,
      imageUrl: "/images/barcelona.jpg", // Thay bằng đường dẫn thực tế
    },
    {
      id: 3,
      name: "Bali",
      country: "Indonesia",
      description:
        "Điểm đến cân bằng giữa thư giãn và phiêu lưu cho người thích khám phá",
      matchScore: 94,
      imageUrl: "/images/bali.jpg", // Thay bằng đường dẫn thực tế
    },
    {
      id: 4,
      name: "Cape Town",
      country: "Nam Phi",
      description:
        "Sự kết hợp hoàn hảo của phong cảnh thiên nhiên và văn hóa đô thị sôi động",
      matchScore: 92,
      imageUrl: "/images/capetown.jpg", // Thay bằng đường dẫn thực tế
    },
  ];

  return (
    <MainLayout>
      <Banner />
      <div className="m-5" />
      <Banner
        backgroundImage="/images/background/bgDocument.png"
        sideImage="/images/documentBanner.png"
        title="Tài liệu cộng đồng"
        subtitle="Lưu tài liệu cá nhân theo cách của bạn"
        width="w-full"
        heightBanner="h-[255px]"
      />
    </MainLayout>
  );
}
