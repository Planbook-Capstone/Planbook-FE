"use client";

import { cn } from "@/lib/utils";

interface FeatureHighlightsProps {
  className?: string;
}

export const FeatureHighlights = ({ className }: FeatureHighlightsProps) => {
  const features = [
    {
      title: "Trực quan.",
      description:
        "Giao diện thân thiện được thiết kế thân thiện, dễ thao tác, cá nhân hoá không gian làm việc với nhiều lựa chọn đa dạng.",
    },
    {
      title: "Linh hoạt.",
      description:
        "Hỗ trợ nhiều công cụ phục vụ tác vụ hành chính cho giáo viên THPT. Cải thiện hiệu suất, tiết kiệm thời gian.",
    },
    {
      title: "Trí tuệ nhân tạo.",
      description:
        "Ứng dụng trí tuệ nhân tạo (AI), hỗ trợ tự động hoá trong từng tác vụ.",
    },
  ];

  return (
    <section className={cn("px-4 md:px-6 lg:px-8", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left max-w-[1340px] mx-auto">
        {features.map((feature, index) => (
          <div key={index}>
            <h3 className="font-calsans text-lg mb-2">{feature.title}</h3>
            <p className="text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
