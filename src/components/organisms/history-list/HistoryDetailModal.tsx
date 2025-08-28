import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryItem } from "./columns";
import { useLessonsByIdsService } from "@/services/lessonServices";
import { useSlideTemplateByIdService } from "@/services/slideTemplateServices";
import { useIsMobile } from "@/hooks/use-mobile";
import { SlidePreviewModal } from "@/components/ui/SlidePreviewToolLog";
import { getDifficultyText } from "@/constants";
import { GridSkeleton } from "@/components/molecules/grid-skeleton";

// Component để hiển thị ma trận cho EXAM_CREATOR
const ExamCreatorMatrix = ({ matrix }: { matrix: any[] }) => {
  // Lấy tất cả lesson IDs từ matrix
  const lessonIds = matrix.map((item) => item.lessonId).filter(Boolean);

  // Gọi API để lấy thông tin lessons
  const lessonQueries = useLessonsByIdsService(lessonIds);

  // Tạo map lesson ID -> lesson name
  const lessonMap = lessonQueries
    .filter((query: any) => query.data)
    .reduce((acc: any, query: any) => {
      const lesson = query.data?.data;
      if (lesson) {
        acc[lesson.id] = lesson.name;
      }
      return acc;
    }, {});

  // Tạo cấu trúc parts từ matrix đầu tiên để làm header
  const templateParts = matrix.length > 0 ? matrix[0].parts : [];
  const colors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-purple-50",
    "bg-yellow-50",
    "bg-cyan-50",
    "bg-pink-50",
  ];
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center rounded-md border">
        <thead className="font-calsans text-base">
          <tr>
            <th className="border px-2 py-3 align-middle" rowSpan={2}>
              <span className="font-normal">Bài học</span>
            </th>
            {templateParts.map((part: any, idx: number) => (
              <th
                key={idx}
                className={`border px-2 py-3 align-middle ${
                  colors[idx % colors.length]
                }`}
                colSpan={3}
              >
                <span className="font-normal">Phần {part.part}</span>
              </th>
            ))}
            <th className="border px-2 py-3 align-middle" rowSpan={2}>
              <span className="font-normal">Tổng số câu</span>
            </th>
          </tr>
          <tr>
            {templateParts.map((_: any, idx: number) => (
              <React.Fragment key={`${idx}-levels`}>
                <th className="border px-2 py-2">
                  <span className="font-normal ">NB</span>
                </th>
                <th className="border px-2 py-2">
                  <span className="font-normal ">TH</span>
                </th>
                <th className="border px-2 py-2">
                  <span className="font-normal ">VD</span>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((item, index) => (
            <tr key={index} className="font-questrial">
              <td className="border px-2 py-1 min-w-[160px] text-left">
                <div className="font-medium">
                  {lessonMap[item.lessonId] || `Lesson ID: ${item.lessonId}`}
                </div>
              </td>
              {item.parts.map((part: any, partIndex: number) => (
                <React.Fragment key={partIndex}>
                  <td className="border px-2 py-1">
                    {part.objectives?.KNOWLEDGE || part?.objectives?.Biết || 0}
                  </td>
                  <td className="border px-2 py-1">
                    {part.objectives?.COMPREHENSION ||
                      part?.objectives?.Hiểu ||
                      0}
                  </td>
                  <td className="border px-2 py-1">
                    {part.objectives?.APPLICATION ||
                      part?.objectives?.Vận_dụng ||
                      0}
                  </td>
                </React.Fragment>
              ))}
              <td className="border px-2 py-1 font-medium">
                {item.totalQuestions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component để hiển thị nodes cho LESSON_PLAN
const LessonPlanNodes = ({ nodes }: { nodes: any }) => {
  const renderNode = (node: any, level = 0) => {
    const indent = level * 16;

    // Determine styling based on node type and level
    let titleClass = "font-medium";
    let containerClass = "py-2";

    if (node.type === "SUBSECTION") {
      if (level === 0) {
        titleClass = "text-lg font-bold text-black";
        containerClass = "py-3 border-b border-gray-200";
      } else if (level === 1) {
        titleClass = "text-base font-semibold text-black";
        containerClass = "py-2";
      } else {
        titleClass = "text-sm font-medium text-black";
        containerClass = "py-1";
      }
    } else if (node.type === "LIST_ITEM") {
      titleClass = "text-sm font-medium text-gray-800";
      containerClass = "py-1";
    }

    return (
      <div
        key={node.id || Math.random()}
        style={{ marginLeft: `${indent}px` }}
        className={`${containerClass}`}
      >
        <div className={titleClass}>
          {node.title || node.name || "Untitled Node"}
        </div>
        {node.content && (
          <div className="text-sm text-gray-600 mt-1 pl-4">
            {node.content.includes("<") && node.content.includes(">") ? (
              <div dangerouslySetInnerHTML={{ __html: node.content }} />
            ) : (
              <span className="whitespace-pre-wrap">{node.content}</span>
            )}
          </div>
        )}
        {node.children && node.children.length > 0 && (
          <div className="mt-2">
            {node.children
              .sort(
                (a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0)
              )
              .map((child: any) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Xử lý nodes - bỏ phần "merged" section và chỉ lấy children
  const processNodes = (nodeData: any) => {
    if (Array.isArray(nodeData)) {
      // Nếu là array, filter bỏ merged section và lấy children của các node khác
      return nodeData
        .filter((node) => node.id !== "merged")
        .flatMap((node) => node.children || [node]);
    } else if (nodeData && typeof nodeData === "object") {
      // Nếu là object, kiểm tra xem có phải merged section không
      if (nodeData.id === "merged" && nodeData.type === "SUBSECTION") {
        // Lấy children của merged section (đây là các node thực sự)
        return nodeData.children || [];
      }
      // Nếu không phải merged, trả về chính nó
      return [nodeData];
    }
    return [];
  };

  const processedNodes = processNodes(nodes);

  if (processedNodes.length === 0) {
    return <div>Không có dữ liệu nodes</div>;
  }

  return (
    <div className="space-y-2">
      {processedNodes
        .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
        .map((node: any) => renderNode(node))}
    </div>
  );
};

// Component để hiển thị output cho LESSON_PLAN (dạng document)
const LessonPlanOutput = ({ output }: { output: any }) => {
  // Xử lý output - bỏ phần "merged" section và chỉ lấy children
  const processOutputNodes = (nodeData: any) => {
    if (Array.isArray(nodeData)) {
      // Nếu là array, filter bỏ merged section và lấy children của các node khác
      return nodeData
        .filter((node) => node.id !== "merged")
        .flatMap((node) => node.children || [node]);
    } else if (nodeData && typeof nodeData === "object") {
      // Nếu là object, kiểm tra xem có phải merged section không
      if (nodeData.id === "merged" && nodeData.type === "SUBSECTION") {
        // Lấy children của merged section (đây là các node thực sự)
        return nodeData.children || [];
      }
      // Nếu không phải merged, trả về chính nó
      return [nodeData];
    }
    return [];
  };

  const processedOutput = processOutputNodes(output);

  if (!processedOutput || processedOutput.length === 0) {
    return (
      <pre className="text-sm whitespace-pre-wrap break-words">
        {JSON.stringify(output, null, 2)}
      </pre>
    );
  }

  const renderPreviewNode = (node: any, depth = 0): React.ReactNode => {
    const marginLeft = depth * 16;

    switch (node.type) {
      case "SECTION":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-6"
          >
            {node.title && (
              <h2 className="text-lg font-bold text-black mb-3 border-b border-gray-300 pb-1">
                {node.title}
              </h2>
            )}
            {node.content && (
              <div className="text-sm text-gray-700 mb-3">
                <div dangerouslySetInnerHTML={{ __html: node.content }} />
              </div>
            )}
            {node.children && node.children.length > 0 && (
              <div className="ml-4">
                {node.children
                  .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                  .map((child: any) => renderPreviewNode(child, depth + 1))}
              </div>
            )}
          </div>
        );

      case "SUBSECTION":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-4"
          >
            {node.title && (
              <h3 className="text-base font-semibold text-black mb-2">
                {node.title}
              </h3>
            )}
            {node.content && (
              <div className="text-sm text-gray-700 mb-2">
                <div dangerouslySetInnerHTML={{ __html: node.content }} />
              </div>
            )}
            {node.children && node.children.length > 0 && (
              <div className="ml-4">
                {node.children
                  .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                  .map((child: any) => renderPreviewNode(child, depth + 1))}
              </div>
            )}
          </div>
        );

      case "LIST_ITEM":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-2 flex flex-col"
          >
            <div className="flex flex-col items-start gap-1 w-full">
              <span className="text-black font-medium text-sm">
                {node.title || "Item"}
              </span>
              <div className="text-gray-700 text-sm pl-4">
                {node.content ? (
                  <div dangerouslySetInnerHTML={{ __html: node.content }} />
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
            {node.children && node.children.length > 0 && (
              <div className="ml-4 mt-1">
                {node.children
                  .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                  .map((child: any) => renderPreviewNode(child, depth + 1))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-2"
          >
            {node.title && (
              <div className="font-medium text-sm text-black">{node.title}</div>
            )}
            {node.content && (
              <div className="text-sm text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: node.content }} />
              </div>
            )}
            {node.children && node.children.length > 0 && (
              <div className="ml-4 mt-1">
                {node.children
                  .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                  .map((child: any) => renderPreviewNode(child, depth + 1))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* <div className="text-sm bg-blue-50 p-3 rounded">
        <strong>Số phần:</strong> {processedOutput.length}
      </div> */}
      <div className="max-h-96 overflow-y-auto bg-white border rounded p-4">
        <div className="space-y-4">
          {processedOutput
            .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
            .map((node: any) => renderPreviewNode(node, 0))}
        </div>
      </div>
    </div>
  );
};

// Component để hiển thị input cho SLIDE_GENERATOR
const SlideGeneratorInput = ({ input }: { input: any }) => {
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] =
    useState<number>(0);

  // Lấy slideTemplateId từ input
  const slideTemplateId =
    input[0]?.slideTemplateId || input?.data[0]?.slideTemplateId;

  // Gọi API để lấy template data
  const { data: selectedTemplate, isLoading: isLoadingTemplate } =
    useSlideTemplateByIdService(slideTemplateId, {
      enabled: !!slideTemplateId, // Chỉ gọi API khi có slideTemplateId
    });

  // Kiểm tra xem có thể hiển thị slide preview không
  const canShowSlidePreview = () => {
    // Kiểm tra nếu input chính là dữ liệu slide (như dữ liệu bạn cung cấp)
    if (
      input &&
      typeof input === "object" &&
      Object.keys(input).some(
        (key) =>
          input[key] && input[key].slideData && input[key].slideData.elements
      )
    ) {
      return true;
    }

    // Kiểm tra nếu input.data có slides
    if (input?.data?.slides && Array.isArray(input.data.slides)) {
      return true;
    }

    return false;
  };

  // Chuẩn bị dữ liệu cho SlidePreview
  const prepareSlideData = () => {
    // Nếu input chính là dữ liệu slide
    if (
      input &&
      typeof input === "object" &&
      Object.keys(input).some(
        (key) =>
          input[key] && input[key].slideData && input[key].slideData.elements
      )
    ) {
      const slides = Object.values(input).map((slideObj: any) => ({
        id: slideObj.id,
        title: slideObj.title || slideObj.slideData?.title,
        elements: slideObj.slideData?.elements || [],
        background: slideObj.slideData?.background,
        isVisible: slideObj.slideData?.isVisible !== false,
      }));

      return { slides };
    }

    // Nếu input.data có slides
    if (input?.data?.slides) {
      return { slides: input.data.slides };
    }

    return null;
  };

  const slideData = prepareSlideData();

  return (
    <div className="space-y-4">
      {/* <pre className="text-sm whitespace-pre-wrap break-words">
        {JSON.stringify(input, null, 2)}
      </pre> */}

      {/* Slide Template Preview từ API */}
      {slideTemplateId && selectedTemplate?.data && (
        <div>
          <div className="bg-gray-50 border rounded p-3">
            {isLoadingTemplate ? (
              <div>
                <GridSkeleton
                  count={1}
                  height={340}
                  cols="grid-cols-1 lg:grid-cols-1"
                />
              </div>
            ) : (
              <>
                <div className="mb-2 text-sm text-gray-600">
                  <strong>Template:</strong> {selectedTemplate.data.name}
                </div>
                <div className="mb-3 text-sm text-gray-600">
                  <strong>Số slide:</strong>{" "}
                  {Object.keys(selectedTemplate.data.imageBlocks || {})
                    .length || 1}
                </div>

                {/* Main Slide Display */}
                <div className="mb-4">
                  <div className="w-full aspect-[16/9] bg-white rounded border overflow-hidden">
                    {selectedTemplate.data.imageBlocks &&
                    Object.values(selectedTemplate.data.imageBlocks)[
                      selectedThumbnailIndex
                    ] ? (
                      <img
                        src={
                          Object.values(selectedTemplate.data.imageBlocks)[
                            selectedThumbnailIndex
                          ] as string
                        }
                        alt={`Slide ${selectedThumbnailIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">
                          Slide {selectedThumbnailIndex + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Slide Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {Object.entries(selectedTemplate.data.imageBlocks || {}).map(
                    ([key, imageUrl], index) => (
                      <div
                        key={key}
                        onClick={() => setSelectedThumbnailIndex(index)}
                        className={`flex-shrink-0 w-20 h-12 bg-white rounded border-2 overflow-hidden cursor-pointer transition-all hover:border-blue-400 ${
                          selectedThumbnailIndex === index
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200"
                        }`}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl as string}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              {index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                  {/* Show at least one thumbnail if no imageBlocks */}
                  {(!selectedTemplate.data.imageBlocks ||
                    Object.keys(selectedTemplate.data.imageBlocks).length ===
                      0) && (
                    <div className="flex-shrink-0 w-20 h-12 bg-white rounded border border-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-400">1</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Fallback: Slide Preview từ input data */}
      {!slideTemplateId && canShowSlidePreview() && slideData && (
        <div>
          <h5 className="font-medium mb-3">Preview Template Slides:</h5>
          <div className="bg-gray-50 border rounded p-3">
            <div className="mb-2 text-sm text-gray-600">
              <strong>Số slide:</strong> {slideData.slides.length}
            </div>
            <SlidePreviewModal data={slideData} />
          </div>
        </div>
      )}



      {/* Raw data fallback */}
      {!canShowSlidePreview() &&
        !input.data &&
        !input.user_config &&
        !input.lesson_id && (
          <div>
            <h5 className="font-medium mb-3">Dữ liệu thô:</h5>
            <pre className="text-sm whitespace-pre-wrap break-words bg-gray-50 p-3 rounded">
              {JSON.stringify(input, null, 2)}
            </pre>
          </div>
        )}
    </div>
  );
};

// Component để hiển thị output cho SLIDE_GENERATOR
const SlideGeneratorOutput = ({ output }: { output: any }) => {
  if (!output || !output.slides) {
    return (
      <pre className="text-sm whitespace-pre-wrap break-words">
        {JSON.stringify(output, null, 2)}
      </pre>
    );
  }

  // Debug: Check slide structure - kiểm tra cả slide.elements và slide.slideData.elements
  const slides = output.slides || [];
  const hasElements = slides.some((slide: any) => {
    // Kiểm tra elements ở cả 2 vị trí có thể có
    const directElements = slide.elements && slide.elements.length > 0;
    const slideDataElements =
      slide.slideData?.elements && slide.slideData.elements.length > 0;
    return directElements || slideDataElements;
  });

  // Chuẩn bị dữ liệu cho SlidePreview - chuyển đổi slideData.elements thành slide.elements
  const normalizedOutput = {
    ...output,
    slides: slides.map((slide: any) => {
      // Nếu slide có slideData.elements, copy nó lên slide.elements
      if (
        slide.slideData?.elements &&
        (!slide.elements || slide.elements.length === 0)
      ) {
        return {
          ...slide,
          elements: slide.slideData.elements,
          background: slide.slideData?.background || slide.background,
          title: slide.slideData?.title || slide.title,
        };
      }
      return slide;
    }),
  };

  return (
    <div className="space-y-4">
      <div className="text-sm bg-blue-50 p-3 rounded space-y-1">
        <div>
          <strong>Tổng số slide:</strong> {slides.length}
        </div>
        <div>
          <strong>Slides có nội dung:</strong>{" "}
          {
            slides.filter((slide: any) => {
              const directElements =
                slide.elements && slide.elements.length > 0;
              const slideDataElements =
                slide.slideData?.elements &&
                slide.slideData.elements.length > 0;
              return directElements || slideDataElements;
            }).length
          }
        </div>
        {!hasElements && (
          <div className="text-orange-600 text-xs">
            ⚠️ Các slide chưa có elements hoặc đang được tạo
          </div>
        )}
      </div>

      {hasElements ? (
        <div className="max-h-96 overflow-y-auto">
          <SlidePreviewModal data={normalizedOutput} />
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto bg-gray-50 border rounded p-4">
          <div className="space-y-4">
            {slides.map((slide: any, index: number) => (
              <div
                key={slide.id || index}
                className="border rounded p-3 bg-white"
              >
                <div className="font-medium text-sm mb-2">
                  Slide {index + 1}:{" "}
                  {slide.title || slide.slideData?.title || "Untitled"}
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <strong>ID:</strong> {slide.id || "N/A"}
                  </div>
                  <div>
                    <strong>Background:</strong>{" "}
                    {slide.slideData?.background || slide.background || "N/A"}
                  </div>
                  <div>
                    <strong>Elements:</strong>{" "}
                    {slide.slideData?.elements?.length ||
                      slide.elements?.length ||
                      0}
                  </div>
                  {/* Hiển thị elements từ slideData hoặc trực tiếp */}
                  {((slide.slideData?.elements &&
                    slide.slideData.elements.length > 0) ||
                    (slide.elements && slide.elements.length > 0)) && (
                    <div className="mt-2">
                      <strong>Elements:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {(
                          slide.slideData?.elements ||
                          slide.elements ||
                          []
                        ).map((element: any, idx: number) => (
                          <li key={idx} className="text-xs">
                            {element.type}:{" "}
                            {element.text?.["0"] ||
                              element.text ||
                              element.content ||
                              "No content"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component để hiển thị input cho MANUAL_EXAM_CREATOR
const ManualExamCreatorInput = ({ input }: { input: any }) => {
  return (
    <div className="space-y-4">
      {/* Thông tin cơ bản */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-blue-50 p-3 rounded">
        <div>
          <strong>Tên đề:</strong> {input.examTitle}
        </div>
        <div>
          <strong>Lớp:</strong> {input.grade}
        </div>
        <div>
          <strong>Môn:</strong> {input.subject}
        </div>
        <div>
          <strong>Thời gian:</strong> {input.duration} phút
        </div>
        <div>
          <strong>Trường:</strong> {input.school}
        </div>
        <div>
          <strong>Số đề:</strong> {input.numberOfExams}
        </div>
        {input.bookType && (
          <div>
            <strong>Loại sách:</strong> {input.bookType}
          </div>
        )}
      </div>

      {/* Ma trận cấu hình - format mới */}
      {input.matrixConfig && (
        <div>
          <h5 className="font-medium mb-3">Ma trận cấu hình:</h5>
          <div className="overflow-x-auto">
            {(() => {
              // Lấy danh sách các phần từ matrixConfig
              const parts = Object.keys(input.matrixConfig);
              const partColors = ["bg-amber-50", "bg-green-50", "bg-sky-50"];

              return (
                <table className="w-full text-center rounded-md border mb-4">
                  <thead className="font-calsans text-base">
                    <tr>
                      {parts.map((partKey, index) => (
                        <th
                          key={partKey}
                          className={`border px-2 py-4 align-middle ${
                            partColors[index] || "bg-gray-50"
                          }`}
                          colSpan={3}
                        >
                          <span className="font-normal">{partKey}</span>
                        </th>
                      ))}
                      <th className="border px-2 py-4 align-middle" rowSpan={2}>
                        <span className="font-normal">Tổng</span>
                      </th>
                    </tr>
                    <tr>
                      {parts.map((partKey) => (
                        <React.Fragment key={`${partKey}-levels`}>
                          <th className="border px-2 py-2">
                            <span className="font-normal">NB</span>
                          </th>
                          <th className="border px-2 py-2">
                            <span className="font-normal">TH</span>
                          </th>
                          <th className="border px-2 py-2">
                            <span className="font-normal">VD</span>
                          </th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-questrial">
                      {parts.map((partKey) => (
                        <React.Fragment key={`${partKey}-data`}>
                          <td className="border px-2 py-1">
                            {input.matrixConfig[partKey]?.nb || 0}
                          </td>
                          <td className="border px-2 py-1">
                            {input.matrixConfig[partKey]?.th || 0}
                          </td>
                          <td className="border px-2 py-1">
                            {input.matrixConfig[partKey]?.vd || 0}
                          </td>
                        </React.Fragment>
                      ))}
                      {/* Tổng */}
                      <td className="border px-2 py-1 font-medium">
                        {Object.values(input.matrixConfig).reduce(
                          (total: number, config: any) =>
                            total +
                            (config.nb || 0) +
                            (config.th || 0) +
                            (config.vd || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      )}

      {/* Thông tin đề thi cá nhân */}
      {input.personalExams && input.personalExams.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">
            Đề thi cá nhân ({input.personalExams.length}):
          </h5>
          <div className="space-y-2">
            {input.personalExams.map((exam: any, index: number) => (
              <div key={index} className="border rounded p-3 bg-gray-50">
                <div className="text-sm">
                  <strong>Đề {index + 1}:</strong> Source Exam ID{" "}
                  {exam.sourceExamId}
                </div>
                {exam.contentJson?.parts && (
                  <div className="text-xs text-gray-600 mt-1">
                    Số phần: {exam.contentJson.parts.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component để hiển thị output cho MANUAL_EXAM_CREATOR
const ManualExamCreatorOutput = ({ output }: { output: any }) => {
  return (
    <div className="space-y-4">
      {/* Thông tin tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-green-50 p-3 rounded">
        <div>
          <strong>Số đề đã tạo:</strong> {output.numberOfExams}
        </div>
        {output.bookType && (
          <div>
            <strong>Loại sách:</strong> {output.bookType}
          </div>
        )}
        <div>
          <strong>Thời gian:</strong> {output.duration} phút
        </div>
        <div>
          <strong>Lớp:</strong> {output.grade}
        </div>
      </div>

      {/* Danh sách đề thi đã tạo */}
      {output.personalExams && output.personalExams.length > 0 && (
        <div>
          <h5 className="font-medium mb-3">Đề thi đã tạo:</h5>
          <div className="space-y-4">
            {output.personalExams.map((exam: any, examIndex: number) => (
              <div key={examIndex} className="border rounded-lg p-4">
                <h6 className="font-medium mb-3">Đề thi {examIndex + 1}</h6>

                {exam.contentJson?.parts?.map(
                  (part: any, partIndex: number) => (
                    <div key={partIndex} className="mb-4">
                      <h6 className="font-medium text-sm mb-2">
                        {part.part}: {part.title}
                      </h6>

                      {part.questions && part.questions.length > 0 ? (
                        <div className="space-y-2">
                          {part.questions
                            .slice(0, 3)
                            .map((question: any, qIndex: number) => (
                              <div
                                key={qIndex}
                                className="border-l-4 border-blue-200 pl-3 text-sm"
                              >
                                <div className="font-medium">
                                  Câu {question.questionNumber}:{" "}
                                  {question.question}
                                </div>
                                {question.options && (
                                  <div className="mt-1 text-xs text-gray-600">
                                    Đáp án: {question.answer} | Độ khó:{" "}
                                    {getDifficultyText(
                                      question.difficultyLevel
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          {part.questions.length > 3 && (
                            <div className="text-xs text-gray-500 pl-3">
                              ... và {part.questions.length - 3} câu hỏi khác
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          Không có câu hỏi
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component để hiển thị output cho EXAM_CREATOR
const ExamCreatorOutput = ({ output }: { output: any }) => {
  if (!output.exam_data || !output.exam_data.parts) {
    return (
      <pre className="text-sm whitespace-pre-wrap break-words">
        {JSON.stringify(output, null, 2)}
      </pre>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-blue-50 p-3 rounded">
        {/* <div><strong>Exam ID:</strong> {output.exam_id}</div> */}
        <div>
          <strong>Tổng câu hỏi:</strong> {output.statistics?.total_questions}
        </div>
        <div>
          <strong>Thời gian tạo:</strong>{" "}
          {output.statistics?.generation_time?.toFixed(2)}s
        </div>
        <div>
          <strong>Bài học sử dụng:</strong> {output.statistics?.lessons_used}
        </div>
      </div>

      {output.exam_data.parts.map((part: any, index: number) => (
        <div key={index} className="border rounded-lg p-4">
          <h5 className="font-medium mb-3">
            {part.part}: {part.title}
          </h5>
          {part.questions && part.questions.length > 0 ? (
            <div className="space-y-3">
              {part.questions.map((question: any, qIndex: number) => (
                <div key={qIndex} className="border-l-4 border-blue-200 pl-4">
                  <div className="font-medium text-sm">
                    Câu {question.questionNumber}: {question.question}
                  </div>
                  {question.options && (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-2 rounded ${
                            question.answer === key
                              ? "bg-green-100"
                              : "bg-gray-50"
                          }`}
                        >
                          <strong>{key}:</strong> {value as string}
                        </div>
                      ))}
                    </div>
                  )}
                  {question.statements && (
                    <div className="mt-2 space-y-1 text-sm">
                      {Object.entries(question.statements).map(
                        ([key, stmt]: [string, any]) => (
                          <div
                            key={key}
                            className={`p-2 rounded ${
                              stmt.answer ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            <strong>{key}:</strong> {stmt.text} (
                            {stmt.answer ? "Đúng" : "Sai"})
                          </div>
                        )
                      )}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-600">
                    <strong>Độ khó:</strong>{" "}
                    {getDifficultyText(question.difficultyLevel)} |{" "}
                    <strong>Đáp án:</strong> {question.answer}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Không có câu hỏi trong phần này
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItem: HistoryItem | null;
}

export default function HistoryDetailModal({
  isOpen,
  onClose,
  historyItem,
}: HistoryDetailModalProps) {
  const isMobile = useIsMobile();

  if (!historyItem) return null;

  const renderContent = () => (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="border-b pb-4">
        <h3 className="font-calsans text-lg mb-2">
          Mã lịch sử: {historyItem.id}
        </h3>
        <p className="text-sm text-gray-600">
          Cập nhật lần cuối:{" "}
          {new Date(historyItem.updatedAt).toLocaleString("vi-VN")}
        </p>
        <p className="text-sm text-gray-600">
          Token sử dụng: {historyItem.tokenUsed}
        </p>
      </div>

      {/* Tabs for Input/Output */}
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Dữ liệu đầu vào</TabsTrigger>
          <TabsTrigger value="output">Dữ liệu đầu ra</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-4">
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-medium mb-2">Dữ liệu đầu vào:</h4>
            {historyItem.input ? (
              <div>
                {historyItem.code === "EXAM_CREATOR" &&
                historyItem.input.matrix ? (
                  <div>
                    <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Tên đề:</strong> {historyItem.input.examTitle}
                      </div>
                      <div>
                        <strong>Khối:</strong> {historyItem.input.grade}
                      </div>
                      {/* <div><strong>Môn:</strong> {historyItem.input.subject}</div> */}
                      <div>
                        <strong>Thời gian:</strong> {historyItem.input.duration}{" "}
                        phút
                      </div>
                      <div>
                        <strong>Tổng câu:</strong>{" "}
                        {historyItem.input.totalCount}
                      </div>
                    </div>
                    <h5 className="font-medium mb-3">Ma trận đề thi:</h5>
                    <ExamCreatorMatrix matrix={historyItem.input.matrix} />
                  </div>
                ) : historyItem.code === "MANUAL_EXAM_CREATOR" ? (
                  <ManualExamCreatorInput input={historyItem.input} />
                ) : historyItem.code === "LESSON_PLAN" &&
                  (historyItem.input.children || historyItem.input.id) ? (
                  <div>
                    <LessonPlanNodes
                      nodes={historyItem.input || [historyItem.input]}
                    />
                  </div>
                ) : historyItem.code === "SLIDE_GENERATOR" ? (
                  <SlideGeneratorInput input={historyItem.input} />
                ) : (
                  <div>
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {JSON.stringify(historyItem.input, null, 2)}
                    </pre>
                    {/* Debug info cho matrix data */}
                    {(historyItem.code === "EXAM_CREATOR" ||
                      historyItem.code === "MANUAL_EXAM_CREATOR") && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <h6 className="font-medium text-yellow-800 mb-2">
                          Debug Matrix Data:
                        </h6>
                        <div className="text-xs text-yellow-700">
                          <div>
                            <strong>Matrix keys:</strong>{" "}
                            {historyItem.input.matrix
                              ? Object.keys(historyItem.input.matrix).join(", ")
                              : "No matrix"}
                          </div>
                          <div>
                            <strong>MatrixConfig keys:</strong>{" "}
                            {historyItem.input.matrixConfig
                              ? Object.keys(
                                  historyItem.input.matrixConfig
                                ).join(", ")
                              : "No matrixConfig"}
                          </div>
                          {historyItem.input.matrix &&
                            historyItem.input.matrix.length > 0 && (
                              <div>
                                <strong>First matrix item:</strong>{" "}
                                {JSON.stringify(
                                  historyItem.input.matrix[0],
                                  null,
                                  2
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>Không có dữ liệu input</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="output" className="mt-4">
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-medium mb-2">Dữ liệu đầu ra:</h4>
            {historyItem.output ? (
              <div>
                {historyItem.code === "EXAM_CREATOR" ? (
                  <ExamCreatorOutput output={historyItem.output} />
                ) : historyItem.code === "MANUAL_EXAM_CREATOR" ? (
                  <ManualExamCreatorOutput output={historyItem.output} />
                ) : historyItem.code === "LESSON_PLAN" ? (
                  <LessonPlanOutput output={historyItem.output} />
                ) : historyItem.code === "SLIDE_GENERATOR" ? (
                  <SlideGeneratorOutput output={historyItem.output} />
                ) : (
                  <pre className="text-sm whitespace-pre-wrap break-words">
                    {JSON.stringify(historyItem.output, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div>Không có dữ liệu output</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Chi tiết lịch sử</SheetTitle>
          </SheetHeader>
          {renderContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết lịch sử"
      size="xl"
      className="max-w-4xl"
    >
      {renderContent()}
    </Modal>
  );
}
