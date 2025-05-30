"use client";

import Link from "next/link";

import MainLayout from "@/components/layout/MainLayout";
import Banner from "@/components/organisms/banner";
import CardFeature from "@/components/organisms/card-feature";
import {
  ExamIcon,
  FormIcon,
  HistoryIcon,
  LessonPlanIcon,
  PenIcon,
  SlideIcon,
} from "@/constants/icon";
import ItemSection from "@/components/organisms/item-section";
import HistoryCard from "@/components/organisms/history-card";
import HistoryList from "@/components/organisms/history-list";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";
  // Dữ liệu tính năng AI
  const aiFeatures = [
    {
      id: 1,
      title: "Điền biểu mẫu",
      description: "Điền biểu mẫu chuẩn hoá theo Bộ Giáo Dục",
      href: "test",
      icon: FormIcon,
    },
    {
      id: 2,
      title: "Tạo đề thi",
      description:
        "AI học từ lựa chọn trước đây để đề xuất điểm đến và trải nghiệm phù hợp",
      href: "test",
      icon: ExamIcon,
    },
    {
      id: 3,
      title: "Slide bài giảng",
      description:
        "AI xử lý hàng nghìn đánh giá để đưa ra thông tin chính xác về điểm đến",
      href: "test",
      icon: SlideIcon,
    },
    {
      id: 4,
      title: "Giáo án",
      description:
        "AI xử lý hàng nghìn đánh giá để đưa ra thông tin chính xác về điểm đến",
      href: "lesson",
      icon: LessonPlanIcon,
    },
    {
      id: 5,
      title: "Chấm điểm tự động",
      description:
        "AI xử lý hàng nghìn đánh giá để đưa ra thông tin chính xác về điểm đến",
      href: "test",
      icon: PenIcon,
    },
  ];

  // Dữ liệu điểm đến được AI khuyên dùng
  const aiRecommendedDestinations = [
    {
      id: 1,
      name: "Kyoto",
      description:
        "Được AI đề xuất cho người yêu thích văn hóa truyền thống và nghệ thuật",
      matchScore: 97,
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

      <section className="grid grid-cols-5 gap-5">
        {aiFeatures?.map((feature) => (
          <CardFeature
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            href={feature.href}
          />
        ))}
      </section>

      <ItemSection
        title={
          <>
            {HistoryIcon}
            Lịch sử
          </>
        }
      />
      {view === "list" ? (
        <HistoryList />
      ) : (
        <section className="grid grid-cols-4 gap-5">
          {Array.from({ length: 7 }).map((_, index) => (
            <HistoryCard key={index} />
          ))}
        </section>
      )}

      {/* <Banner
        backgroundImage="/images/background/bgDocument.png"
        sideImage="/images/banner/bannerDocument.svg"
        title="Tài liệu cộng đồng"
        subtitle="Lưu tài liệu cá nhân theo cách của bạn"
        width="w-full"
        heightBanner="h-[220px]"
      /> */}
    </MainLayout>
  );
}
