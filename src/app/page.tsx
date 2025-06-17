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

export default function Home() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";
  const { data: bookTypesResponse, isLoading } = useBookTypesService();
  const bookTypes =
    bookTypesResponse?.data?.content.sort((a: any, b: any) =>
      a.priority > b.priority ? 1 : -1
    ) || [];

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
      <Banner />

      <section className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5">
        {bookTypes?.map((feature: any) => (
          <CardFeature
            key={feature.id}
            icon={feature.icon}
            title={feature.name}
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
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 7 }).map((_, index) => (
            <HistoryCard key={index} className={getRandomColorClass()} />
          ))}
        </section>
      )}
    </MainLayout>
  );
}
