"use client";

import React from "react";
import { ExamData, LessonPlanData } from "@/store";
import { getLibraryTypeName } from "@/constants";

// Component tạo thumbnail preview nhỏ gọn như Google Drive
export const FileThumbnailPreview: React.FC<{
  file: any;
  width?: number;
  height?: number;
  onDelete?: (fileId: string) => void;
}> = ({ file, width = 200, height = 260, onDelete }) => {
  const renderThumbnailContent = () => {
    if (file.type === "exam") {
      return <ExamThumbnail data={file.data} />;
    } else if (file.type === "lesson-plan") {
      return <LessonPlanThumbnail data={file.data} />;
    } else if (file.type === "slide") {
      return <SlideThumbnail data={file.data} />;
    } else {
      return <GenericThumbnail data={file.data} />;
    }
  };

  return (
    <div
      className="bg-white border border-gray-200  overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={() => onDelete(file.id)}
          className="absolute top-2 right-2 z-10 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          title="Xóa file"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Content Preview */}
      <div className="p-2 h-full overflow-hidden relative">
        <div className="text-[6px] leading-tight text-gray-700 h-full">
          {renderThumbnailContent()}
        </div>

        {/* Hover overlay for better readability */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* File type indicator - moved to avoid conflict with delete button */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            file.type === "exam"
              ? "bg-blue-100 text-blue-800"
              : file.type === "lesson-plan"
              ? "bg-green-100 text-green-800"
              : file.type === "slide"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {getLibraryTypeName(file.data.type)}
        </span>
      </div>
    </div>
  );
};

// Thumbnail cho Exam - hiển thị vài câu hỏi đầu
const ExamThumbnail: React.FC<{ data: ExamData }> = ({ data }) => {
  // Lấy tối đa 2 phần đầu tiên
  const examParts = data.data?.parts?.slice(0, 2) || [];

  const renderPartThumbnail = (part: any, partIndex: number) => {
    // Part 1: hiển thị hết tất cả câu hỏi
    // Part 2+: hiển thị một vài câu đầu nếu còn chỗ
    const questionsToShow =
      partIndex === 0
        ? part?.questions || [] // Part 1: hiển thị hết
        : part?.questions?.slice(0, 2) || []; // Part 2+: chỉ 2 câu đầu

    return (
      <div key={partIndex} className="mb-1">
        {/* Part Title - 6px */}
        <div className="flex justify-start items-end gap-0.5 py-1">
          <h5 className="font-semibold text-[6px] text-blue-700">
            {part.part}
          </h5>
          {part.title && (
            <p className="text-[6px] text-blue-600 ">{part.title}</p>
          )}
        </div>

        {/* Questions Preview */}
        {questionsToShow?.map((question: any, qIndex: number) => (
          <div
            key={qIndex}
            className="mb-0.5 pb-0.5  border-gray-100 last:border-b-0"
          >
            <div className="flex items-start gap-1">
              <div className="flex-1 min-w-0">
                <p className="text-[4px] text-gray-800  mb-0.5">
                  <span className="font-bold">
                    Câu {question.questionNumber}:
                  </span>{" "}
                  {question.question}
                </p>

                {/* Show all options for Part 1, first 2 for other parts */}
                {question.options && (
                  <div className="space-y-0.5 ml-2">
                    {Object.entries(question.options)
                      .slice(0, partIndex === 0 ? undefined : 2) // Part 1: hết, Part 2+: 2 đáp án
                      .map(([key, value]) => (
                        <div key={key} className="flex items-start gap-1">
                          <span className="text-[4px] font-medium text-gray-600">
                            {key}.
                          </span>
                          <span className="text-[4px] text-gray-600 ">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    {/* Chỉ hiển thị "..." cho Part 2+ khi có nhiều hơn 2 đáp án */}
                    {partIndex > 0 &&
                      Object.keys(question.options).length > 2 && (
                        <div className="text-[3px] text-gray-400">...</div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Show more questions indicator chỉ cho Part 2+ */}
        {partIndex > 0 && (part?.questions?.length || 0) > 2 && (
          <div className="text-[3px] text-gray-400 ml-2">
            +{(part?.questions?.length || 0) - 2} câu khác
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {/* Header thông tin đề thi - thu gọn */}
      <div className="flex justify-center gap-10 items-center">
        <div className="text-center">
          <div className="font-black text-[5px] text-nowrap">
            SỞ GIÁO DỤC VÀ ĐÀO TẠO
          </div>
          <div className="font-bold text-[5px] text-center">
            TRƯỜNG THPT ...
          </div>
        </div>
        <div className="text-center">
          <div className="font-black text-[5px] mt-1">ĐỀ THI ....</div>
          <div className="text-[4px] font-black">
            Môn: .........; Lớp: .........
          </div>
          <div className="text-[3px] text-nowrap">Thời gian: ... phút</div>
        </div>
      </div>

      {/* Student Information - thu gọn */}
      <div className="flex justify-between items-end mt-1">
        <div style={{ width: "70%" }}>
          <div className="flex flex-col items-start gap-0.5 text-[3px] font-medium">
            <span>Họ tên: ................</span>
            <span>SBD: ..................</span>
          </div>
        </div>

        <div style={{ width: "28%" }}>
          <div className="border border-black px-0.5 py-0.5 flex items-center justify-center">
            <p className="text-[3px] text-center font-medium">Mã: 001</p>
          </div>
        </div>
      </div>

      {/* Parts Preview */}
      <div className="space-y-0.5">
        {examParts?.map((part, index) => renderPartThumbnail(part, index))}
      </div>

      {/* Show more parts indicator - chỉ khi có Part 3+ */}
      {(data.data?.parts?.length || 0) > 2 && (
        <div className="text-center">
          <span className="text-[3px] text-gray-400">
            +{(data.data?.parts?.length || 0) - 2} phần khác
          </span>
        </div>
      )}
    </div>
  );
};

// Thumbnail cho Lesson Plan - hiển thị cấu trúc đầu
const LessonPlanThumbnail: React.FC<{ data: LessonPlanData }> = ({ data }) => {
  // Lấy dữ liệu từ data.data array thay vì data.children
  const lessonData = data.data || [];

  const renderNodeThumbnail = (node: any, level: number = 0) => {
    const indent = level * 2; // Giảm indent để tiết kiệm không gian

    // Tính toán text size dựa trên level với inline style
    const getTextSize = (baseLevel: number = 0) => {
      const size = Math.max(6 - level - baseLevel, 3);
      return { fontSize: `${size}px` };
    };

    return (
      <div
        key={node.id}
        style={{ marginLeft: `${indent}px` }}
        className="mb-0.5"
      >
        {node.type === "SECTION" && (
          <div>
            <h5 className="font-semibold text-blue-700 " style={getTextSize(0)}>
              {node.title}
            </h5>
            {node.content && (
              <p className="text-gray-600 mt-0.5" style={getTextSize(1)}>
                {node.content}
              </p>
            )}
          </div>
        )}

        {node.type === "SUBSECTION" && (
          <div>
            <h6 className="font-medium text-blue-600 " style={getTextSize(0)}>
              {node.title}
            </h6>
            {node.content && (
              <p className="text-gray-600  mt-0.5" style={getTextSize(1)}>
                {node.content}
              </p>
            )}
          </div>
        )}

        {node.type === "TEXT" && (
          <p className="text-gray-700 " style={getTextSize(0)}>
            {node.content || node.title}
          </p>
        )}

        {node.type === "LIST_ITEM" && (
          <div>
            <div className="flex items-start gap-1">
              <span className="text-blue-500" style={getTextSize(0)}>
                •
              </span>
              <p className="text-gray-700 " style={getTextSize(0)}>
                {node.title}
              </p>
            </div>
            {node.content && (
              <p className="text-gray-700 mt-0.5 pl-2" style={getTextSize(1)}>
                {node.content}
              </p>
            )}
          </div>
        )}

        {/* Show all children */}
        {node.children &&
          node.children.map((child: any) =>
            renderNodeThumbnail(child, level + 1)
          )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {/* Header thông tin bài dạy - thu gọn */}
      <div className="text-center space-y-0.5 mb-1">
        <div className="font-bold text-[5px]">KHUNG KẾ HOẠCH BÀI DẠY</div>
        <div className="text-[4px] text-gray-600 italic">
          (Kèm theo Công văn số 5512/BGDĐT-GDTrH)
        </div>

        {/* Thông tin chung - thu gọn */}
        <div className="space-y-0.5 mt-1">
          <div className="flex justify-between text-[4px]">
            <div>Trường:..........</div>
            <div>GV:............</div>
          </div>

          <div className="text-center space-y-0.5 mt-1">
            <div className="font-bold text-[5px]">
              {data.name || "TÊN BÀI DẠY"}
            </div>
            <div className="text-[4px]">
              Môn học/Hoạt động giáo dục: {data.subject || ".........."}; lớp:{" "}
              {data.grade || "........"}
            </div>
            <div className="text-[4px]">Thời gian thực hiện: (số tiết)</div>
          </div>
        </div>
      </div>

      {/* Nodes Preview - Show all nodes */}
      <div className="space-y-0.5">
        {lessonData.map((node: any) => renderNodeThumbnail(node))}
      </div>
    </div>
  );
};

// Mini slide canvas component for thumbnail (similar to SlidePreview's SlideCanvas)
const MiniSlideCanvas = ({
  slide,
  width = 160,
  height = 90,
}: {
  slide: any;
  width?: number;
  height?: number;
}) => {
  if (!slide) return null;

  const scale = width / 960; // Scale down from canvas size (960px)
  const elements = slide.elements || [];

  // Helper function to get background style
  const getBackgroundStyle = () => {
    if (!slide.background || slide.background === "#ffffff") {
      return { backgroundColor: "#ffffff" };
    }

    if (slide.background.startsWith("#")) {
      return { backgroundColor: slide.background };
    }

    if (slide.background.startsWith("linear-gradient")) {
      return { background: slide.background };
    }

    if (slide.background.startsWith("url(")) {
      return {
        backgroundImage: slide.background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    return { backgroundColor: "#ffffff" };
  };

  return (
    <div
      className="relative border border-gray-200 rounded overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...getBackgroundStyle(),
      }}
    >
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-[4px]">
          Empty
        </div>
      ) : (
        elements.map((element: any) => {
          if (element.type === "text") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                  fontSize:
                    (element.style?.fontSize || element.fontSize || 16) *
                      scale +
                    "px",
                  fontFamily:
                    element.style?.fontFamily || element.fontFamily || "Arial",
                  fontWeight: element.style?.bold
                    ? "bold"
                    : element.fontWeight || "normal",
                  fontStyle: element.style?.italic
                    ? "italic"
                    : element.fontStyle || "normal",
                  textDecoration: element.style?.underline
                    ? "underline"
                    : element.textDecoration || "none",
                  color: element.style?.color || element.color || "#000000",
                  textAlign:
                    element.style?.textAlign || element.textAlign || "left",
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                  textOverflow: "ellipsis",
                  lineHeight: "1.2",
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
                }}
              >
                {element.text || element.content || "Text"}
              </div>
            );
          }

          if (element.type === "image") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
                }}
              >
                <img
                  src={element.src}
                  alt={element.alt || "Image"}
                  className="w-full h-full object-cover rounded"
                  style={{
                    opacity: element.opacity || 1,
                  }}
                />
              </div>
            );
          }

          if (element.type === "shape") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                  backgroundColor: element.fill || element.color || "#cccccc",
                  borderRadius:
                    element.shapeType === "circle" || element.shape === "circle"
                      ? "50%"
                      : element.shapeType === "rounded-rectangle"
                      ? "4px"
                      : "0",
                  border: element.stroke
                    ? `1px solid ${element.stroke}`
                    : "none",
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
                }}
              />
            );
          }

          if (element.type === "video") {
            return (
              <div
                key={element.id}
                className="absolute bg-gray-800 flex items-center justify-center"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
                }}
              >
                <div className="text-white text-[4px]">Video</div>
              </div>
            );
          }

          return null;
        })
      )}
    </div>
  );
};

// Thumbnail cho Slide - hiển thị slide preview giống SlidePreview
const SlideThumbnail: React.FC<{ data: any }> = ({ data }) => {
  // Lấy thông tin slide từ data - tương tự như SlidePreview
  const slideData = data?.data?.data || data?.data || data;
  const slides = slideData?.slides || [];

  if (!slides || slides.length === 0) {
    return (
      <div className="space-y-1">
        <div className="text-center mb-1">
          <h4 className="font-bold text-[6px] text-gray-900">
            {data.name || "Slide Presentation"}
          </h4>
          <p className="text-[4px] text-gray-500">Không có slide</p>
        </div>
      </div>
    );
  }

  // Hiển thị tối đa 2 slide đầu tiên
  const slidesToShow = slides.slice(0, 2);

  return (
    <div className="space-y-1">
      {/* Title */}
      <div className="text-center mb-1">
        <h4 className="font-bold text-[5px] text-gray-900 line-clamp-1">
          {data.name || "Slide Presentation"}
        </h4>
        <p className="text-[4px] text-gray-500">
          {slides.length} slide{slides.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Slide Previews */}
      <div className="space-y-1">
        {slidesToShow.map((slide: any, index: number) => (
          <div key={slide.id || index} className="flex flex-col items-center">
            <MiniSlideCanvas slide={slide} width={160} height={90} />
            {slide.title && (
              <p className="text-[4px] text-gray-600 mt-0.5 text-center line-clamp-1">
                {slide.title}
              </p>
            )}
          </div>
        ))}

        {/* Show more slides indicator */}
        {slides.length > 2 && (
          <div className="text-center">
            <span className="text-[4px] text-gray-400">
              +{slides.length - 2} slide khác
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Thumbnail cho file generic - hiển thị JSON structure
const GenericThumbnail: React.FC<{ data: any }> = ({ data }) => {
  // Tạo preview structure của JSON
  const getPreviewStructure = (
    obj: any,
    maxDepth: number = 2,
    currentDepth: number = 0
  ): string => {
    if (currentDepth >= maxDepth) return "...";

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      const firstItem = getPreviewStructure(obj[0], maxDepth, currentDepth + 1);
      return `[${firstItem}${
        obj.length > 1 ? `, +${obj.length - 1} items` : ""
      }]`;
    }

    if (obj && typeof obj === "object") {
      const keys = Object.keys(obj);
      if (keys.length === 0) return "{}";

      const firstKeys = keys.slice(0, 3);
      const preview = firstKeys
        .map((key) => {
          const value = getPreviewStructure(
            obj[key],
            maxDepth,
            currentDepth + 1
          );
          return `${key}: ${value}`;
        })
        .join("\n");

      return `{\n${preview}${keys.length > 3 ? "\n..." : ""}\n}`;
    }

    if (typeof obj === "string") {
      return obj.length > 20 ? `"${obj.substring(0, 20)}..."` : `"${obj}"`;
    }

    return String(obj);
  };

  const preview = getPreviewStructure(data);

  return (
    <div className="space-y-2">
      {/* Title */}
      <div className="text-center mb-2">
        <h4 className="font-bold text-[6px] text-gray-900">JSON Data</h4>
        <p className="text-[7px] text-gray-500">Generic file content</p>
      </div>

      {/* JSON Preview */}
      <div className="bg-gray-50 p-1 rounded text-[6px] font-mono overflow-hidden">
        <pre className="whitespace-pre-wrap text-[6px] leading-tight text-gray-700">
          {preview}
        </pre>
      </div>
    </div>
  );
};

export default FileThumbnailPreview;
