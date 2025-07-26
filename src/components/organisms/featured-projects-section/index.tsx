"use client";

import { FeaturedProjectCard } from "@/components/molecules/featured-project-card";

export const FeaturedProjectsSection = () => {
  const projects = [
    {
      title: "Tự động hóa soạn giáo án bằng AI",
      subtitle: "Trợ lý giáo án Planbook",
      description:
        "Giáo viên chỉ cần nhập tên bài học, hệ thống sẽ gợi ý mục tiêu, tiến trình giảng dạy và đề xuất hoạt động phù hợp theo chương trình.",
      image: "/images/background/bg_01.svg",
      stats: [
        { value: "127%", label: "Nhanh hơn khi soạn giáo án" },
        { value: "4,000+", label: "Giáo án đã tạo bằng AI" },
      ],
      tags: ["127%", "Nhanh hơn", "4,000+", "Giáo án đã tạo"],
    },
    {
      title: "Tạo slide bài giảng tự động từ giáo án",
      subtitle: "Tạo Slide thông minh",
      description:
        "Chuyển đổi giáo án thành slide trình chiếu chỉ với một cú nhấp chuột. Hỗ trợ tùy chỉnh, thêm hình ảnh và trình chiếu trực tiếp.",
      image: "/images/background/bg_02.svg",
      stats: [
        { value: "75%", label: "Tiết kiệm thời gian" },
        { value: "100%", label: "Tùy chỉnh linh hoạt" },
      ],
      tags: ["75%", "Tiết kiệm thời gian", "100%", "Tùy chỉnh linh hoạt"],
    },
    {
      title: "Tạo slide bài giảng tự động từ giáo án",
      subtitle: "Tạo Slide thông minh",
      description:
        "Chuyển đổi giáo án thành slide trình chiếu chỉ với một cú nhấp chuột. Hỗ trợ tùy chỉnh, thêm hình ảnh và trình chiếu trực tiếp.",
      image: "/images/background/bg_03.svg",
      stats: [
        { value: "75%", label: "Tiết kiệm thời gian" },
        { value: "100%", label: "Tùy chỉnh linh hoạt" },
      ],
      tags: ["75%", "Tiết kiệm thời gian", "100%", "Tùy chỉnh linh hoạt"],
    },
  ];

  return (
    <section className="py-16 px-4 xl:[200px] md:px-[75px]">
      <div className="mx-auto space-y-3">
        <div className="lg:hidden mb-12 lg:mb-2 lg:pr-4 pr-0 lg:col-span-1 flex flex-col justify-end">
          <h2 className="text-4xl md:text-5xl font-calsans text-gray-900 mb-4">
            Nổi bật
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Khám phá những đột phá mới nhất của chúng tôi trong lĩnh vực công
            nghệ giáo dục và giải pháp học tập ứng dụng AI.
          </p>
        </div>
        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <FeaturedProjectCard
            title={projects[0].title}
            image={projects[0].image}
            tags={projects[0].tags}
            className={"lg:col-span-1 text-white"}
          />

          <FeaturedProjectCard
            title={projects[1].title}
            image={projects[1].image}
            tags={projects[1].tags}
            tagsPosition="top"
            className={"lg:col-span-1 "}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
          {/* Section Header */}
          <div className="lg:flex mb-12 lg:mb-2 lg:pr-4 pr-0 lg:col-span-1 hidden flex-col justify-end">
            <h2 className="text-5xl md:text-6xl font-calsans text-gray-900 mb-4">
              Nổi bật
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              Khám phá những đột phá mới nhất của chúng tôi trong lĩnh vực công
              nghệ giáo dục và giải pháp học tập ứng dụng AI.
            </p>
          </div>
          <FeaturedProjectCard
            title={projects[2].title}
            image={projects[2].image}
            tags={projects[2].tags}
            tagClassName="bg-neutral-800 text-white"
            className={"lg:col-span-3 text-white border"}
          />
        </div>
      </div>
    </section>
  );
};
