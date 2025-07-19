"use client";

import { FeaturedProjectCard } from "@/components/molecules/featured-project-card";

export const FeaturedProjectsSection = () => {
  const projects = [
    {
      title: "Tự động hóa soạn giáo án bằng AI",
      subtitle: "Trợ lý giáo án Planbook",
      description:
        "Giáo viên chỉ cần nhập tên bài học, hệ thống sẽ gợi ý mục tiêu, tiến trình giảng dạy và đề xuất hoạt động phù hợp theo chương trình.",
      image: "/images/projects/planbook-lesson.jpg",
      stats: [
        { value: "127%", label: "Nhanh hơn khi soạn giáo án" },
        { value: "4,000+", label: "Giáo án đã tạo bằng AI" },
      ],
      tags: ["Next.js", "AI", "Giáo dục", "Soạn giáo án"],
    },
    {
      title: "Tạo slide bài giảng tự động từ giáo án",
      subtitle: "Tạo Slide thông minh",
      description:
        "Chuyển đổi giáo án thành slide trình chiếu chỉ với một cú nhấp chuột. Hỗ trợ tùy chỉnh, thêm hình ảnh và trình chiếu trực tiếp.",
      image: "/images/projects/planbook-slide.jpg",
      stats: [
        { value: "75%", label: "Tiết kiệm thời gian chuẩn bị" },
        { value: "100%", label: "Tùy chỉnh nội dung linh hoạt" },
      ],
      tags: ["React", "Slide", "Giáo án", "Trình chiếu"],
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-calsans text-gray-900 mb-4">
            Featured projects
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Showcasing our latest innovations in educational technology and
            AI-powered learning solutions.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <FeaturedProjectCard
              key={index}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              image={project.image}
              stats={project.stats}
              tags={project.tags}
              className={index === 0 ? "lg:col-span-1" : "lg:col-span-1"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
