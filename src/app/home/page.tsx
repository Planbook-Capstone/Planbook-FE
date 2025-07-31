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
import { useBookTypesService } from "@/services/bookTypeServices";
import BannerOverlay from "@/components/organisms/banner/BannerWithOverlay";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";
  const { data: bookTypes } = useBookTypesService();

  const { displayName } = useAuth();

  const getRandomColorClass = () => {
    const colorClasses = [
      "text-teal-300",
      "text-gray-600",
      "text-green-300",
      "text-blue-500",
      "text-gray-600",
      "text-violet-400",
      "text-cyan-300",
      "text-gray-600",
      "text-gray-600",
      "text-rose-700",
      "text-pink-600",
      "text-gray-600",
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
  };

  return (
    <MainLayout>
      {/* <Banner /> */}
      <BannerOverlay
        imageSrc="/images/background/abstract-bg.svg"
        videoSrc="https://res.cloudinary.com/dpo0ad3aq/video/upload/Scene_03_-_4K_3840x2160_h0awgk.mp4"
        title={"Chào mừng " + displayName || "Chào mừng Người dùng ẩn danh"}
        onSearch={(query) => console.log("Searching for:", query)}
        height="h-80"
        grid={10}
        mouse={0.1}
        strength={0.15}
        relaxation={0.9}
        className="mb-8"
      />

      <section className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5">
        {bookTypes?.data?.content
          ?.sort((a: any, b: any) => a.priority - b.priority)
          ?.map((feature: any) => (
            <CardFeature
              id={feature.id}
              key={feature.id}
              icon={feature.icon}
              title={feature.name}
              description={feature.description}
              href={feature.href}
            />
          ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <SpotlightCard
          className="!p-0 !bg-transparent !border-0 w-full aspect-[4/3] rounded-lg overflow-hidden"
          spotlightColor="rgba(59, 130, 246, 0.3)"
        >
          <img
            src="/images/background/LessonPlanCreation.svg"
            className="w-full h-full object-cover"
          />
        </SpotlightCard>
        <SpotlightCard
          className="!p-0 !bg-transparent !border-0 w-full aspect-[4/3] rounded-lg overflow-hidden"
          spotlightColor="rgba(34, 197, 94, 0.3)"
        >
          <img
            src="/images/background/ExamCreation.svg"
            className="w-full h-full object-cover"
          />
        </SpotlightCard>
        <SpotlightCard
          className="!p-0 !bg-transparent !border-0 w-full aspect-[4/3] rounded-lg overflow-hidden"
          spotlightColor="rgba(168, 85, 247, 0.3)"
        >
          <img
            src="/images/background/SlideCreation.svg"
            className="w-full h-full object-cover"
          />
        </SpotlightCard>
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
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 7 }).map((_, index) => (
            <HistoryCard key={index} className={getRandomColorClass()} />
          ))}
        </section>
      )}
    </MainLayout>
  );
}
