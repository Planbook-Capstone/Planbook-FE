"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SlideEditorLayout from "@/components/ui/slide-editor/SlideEditorLayout";
import {
  useSlideTemplateByIdService,
  useUpdateSlideTemplateService,
} from "@/services/slideTemplateServices";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";

export default function EditSlideTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params?.id as string;

  const { data: template, isLoading: isLoadingTemplate } =
    useSlideTemplateByIdService(templateId);
  const updateMutation = useUpdateSlideTemplateService();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  // Helper function để convert blob URL thành base64
  const convertBlobToBase64 = (blobUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      fetch(blobUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  // Helper function để process background và convert blob thành base64
  const processSlideBackground = async (
    background: string
  ): Promise<string> => {
    if (background.startsWith("url(blob:")) {
      console.log("🔄 Converting blob background to base64:", background);
      try {
        // Extract blob URL from url(blob:...)
        const blobUrlMatch = background.match(/url\(blob:([^)]+)\)/);
        if (blobUrlMatch) {
          const blobUrl = `blob:${blobUrlMatch[1]}`;
          const base64 = await convertBlobToBase64(blobUrl);
          const newBackground = `url('${base64}')`;
          console.log("✅ Converted blob to base64 background");
          return newBackground;
        }
      } catch (error) {
        console.error("❌ Error converting blob to base64:", error);
        return "#ffffff"; // Fallback to white
      }
    }
    return background; // Return as-is for non-blob backgrounds
  };

  // Debug useEffect để kiểm tra data loading
  useEffect(() => {
    console.log("🔍 Edit Template Debug:");
    console.log("🔍 Template ID:", templateId);
    console.log("🔍 Is Loading:", isLoadingTemplate);
    console.log("🔍 Template Response:", template);

    if (template?.data) {
      console.log("🔍 Template Data:", template.data);
      console.log("🔍 Template TextBlocks:", template.data.textBlocks);
      console.log(
        "🔍 Template ImageBlocks:",
        Object.keys(template.data.imageBlocks || {})
      );
    }
  }, [templateId, isLoadingTemplate, template]);

  // Helper function để render background (solid color, gradient, hoặc image)
  const renderBackground = async (
    ctx: CanvasRenderingContext2D,
    background: string,
    width: number,
    height: number
  ): Promise<void> => {
    if (background.startsWith("#")) {
      // Solid color
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
    } else if (background.startsWith("linear-gradient")) {
      // Linear gradient - parse và tạo gradient
      try {
        const gradientMatch = background.match(/linear-gradient\(([^)]+)\)/);
        if (gradientMatch) {
          const gradientInfo = gradientMatch[1];
          const parts = gradientInfo.split(",").map((s) => s.trim());

          let colorStops = parts;
          if (parts[0].includes("deg")) {
            colorStops = parts.slice(1);
          }

          const gradient = ctx.createLinearGradient(0, 0, width, height);
          colorStops.forEach((stop, index) => {
            const position = index / (colorStops.length - 1);
            gradient.addColorStop(position, stop.trim());
          });

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }
      } catch (error) {
        console.error("Error parsing gradient:", error);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
    } else if (background.startsWith("url(")) {
      // Background image
      const imageUrlMatch = background.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (imageUrlMatch) {
        const imageUrl = imageUrlMatch[1];

        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            try {
              ctx.drawImage(img, 0, 0, width, height);
              resolve();
            } catch (error) {
              console.error("Error drawing background image:", error);
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, width, height);
              resolve();
            }
          };
          img.onerror = () => {
            console.error("Error loading background image:", imageUrl);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            resolve();
          };

          img.crossOrigin = "anonymous";
          img.src = imageUrl;
        });
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
  };

  // Helper function để capture updated imageBlocks từ slides
  const captureUpdatedImageBlocks = async (
    slides: any[]
  ): Promise<Record<string, string>> => {
    const imageBlocks: Record<string, string> = {};
    console.log(
      "🎯 Capturing updated imageBlocks for",
      slides.length,
      "slides"
    );

    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        console.log(`📸 Processing slide ${i + 1}:`, slide);

        // Tạo canvas với kích thước chuẩn và độ phân giải cao
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const scale = 3;
        const canvasWidth = 960 * scale;
        const canvasHeight = 540 * scale;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx?.scale(scale, scale);

        if (!ctx) {
          console.error(`❌ Cannot get canvas context for slide ${i + 1}`);
          continue;
        }

        // Process và render background (convert blob to base64 if needed)
        const originalBackground = slide.background || "#ffffff";
        const processedBackground = await processSlideBackground(
          originalBackground
        );
        await renderBackground(ctx, processedBackground, 960, 540);

        // Update slide background với processed version để lưu vào textBlocks
        slide.background = processedBackground;

        // Render elements theo đúng thứ tự zIndex
        const elements = (slide.elements || []).sort(
          (a: any, b: any) => (a.zIndex || 0) - (b.zIndex || 0)
        );

        // Process all elements sequentially để đảm bảo async operations hoàn thành
        for (const element of elements) {
          console.log(`🔧 Processing element:`, element.type, element.id);

          if (element.type === "text") {
            // Render text
            const style = element.style || {};
            const fontSize = style.fontSize || 16;
            const fontFamily = style.fontFamily || "Arial, sans-serif";
            const color = style.color || "#000000";
            const textAlign = style.textAlign || "left";
            const bold = style.bold ? "bold" : "normal";
            const italic = style.italic ? "italic" : "normal";

            ctx.font = `${italic} ${bold} ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = textAlign as CanvasTextAlign;

            const text = element.text || "";
            const x = element.x || 0;
            const y = element.y || 0;
            const width = element.width || 200;

            let textX = x;
            let textY = y + fontSize;

            if (textAlign === "center") {
              textX = x + width / 2;
            } else if (textAlign === "right") {
              textX = x + width;
            }

            const lines = text.split("\n");
            const lineHeight = fontSize * 1.2;

            lines.forEach((line: string, index: number) => {
              const currentY = textY + index * lineHeight;
              ctx.fillText(line, textX, currentY);
            });

            console.log(`✅ Rendered text element: ${element.id}`);
          } else if (element.type === "image" && element.src) {
            console.log(`🖼️ Processing image element: ${element.id}`);

            // Process image src (convert blob to base64 if needed)
            let imageSrc = element.src;
            if (imageSrc.startsWith("blob:")) {
              console.log(
                "🔄 Converting blob image to base64:",
                imageSrc.substring(0, 50) + "..."
              );
              try {
                imageSrc = await convertBlobToBase64(imageSrc);
                element.src = imageSrc; // Update element với base64
                console.log(
                  "✅ Converted blob image to base64, length:",
                  imageSrc.length
                );
              } catch (error) {
                console.error("❌ Error converting blob image:", error);
                // Keep original src if conversion fails
              }
            }

            // Render image và đợi cho đến khi hoàn thành
            await new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                try {
                  const x = element.x || 0;
                  const y = element.y || 0;
                  const width = element.width || 100;
                  const height = element.height || 100;

                  ctx.drawImage(img, x, y, width, height);
                  console.log(`✅ Rendered image element: ${element.id}`);
                  resolve();
                } catch (error) {
                  console.error("❌ Error drawing image:", error);
                  resolve();
                }
              };
              img.onerror = () => {
                console.error(
                  "❌ Error loading image:",
                  imageSrc.substring(0, 50) + "..."
                );
                resolve();
              };

              img.crossOrigin = "anonymous";
              img.src = imageSrc;
            });
          } else if (element.type === "shape") {
            // Render shape
            const x = element.x || 0;
            const y = element.y || 0;
            const width = element.width || 100;
            const height = element.height || 100;
            const fill = element.fill || "#cccccc";
            const stroke = element.stroke || "#000000";
            const strokeWidth = element.strokeWidth || 1;

            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;

            if (element.shapeType === "rectangle") {
              ctx.fillRect(x, y, width, height);
              if (stroke && strokeWidth > 0) {
                ctx.strokeRect(x, y, width, height);
              }
            } else if (element.shapeType === "circle") {
              const centerX = x + width / 2;
              const centerY = y + height / 2;
              const radius = Math.min(width, height) / 2;

              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
              ctx.fill();
              if (stroke && strokeWidth > 0) {
                ctx.stroke();
              }
            }

            console.log(`✅ Rendered shape element: ${element.id}`);
          }
        }

        console.log(`🎨 Finished processing all elements for slide ${i + 1}`);

        // Đợi một chút để đảm bảo tất cả rendering hoàn thành
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Convert to base64
        const slideImageBase64 = canvas.toDataURL("image/png", 0.9);
        const slideKey = `slide_${i + 1}`;
        imageBlocks[slideKey] = slideImageBase64;

        console.log(
          `✅ Captured slide ${i + 1}, base64 length:`,
          slideImageBase64.length
        );
        console.log(
          `📊 Slide ${i + 1} final background:`,
          slide.background?.substring(0, 50) + "..."
        );
        console.log(
          `📊 Slide ${i + 1} elements count:`,
          slide.elements?.length || 0
        );
      }
    } catch (error) {
      console.error("❌ Error in captureUpdatedImageBlocks:", error);
    }

    console.log("🎯 Capture process completed!");
    console.log("🎯 Final updated imageBlocks keys:", Object.keys(imageBlocks));
    console.log("🎯 Total slides processed:", Object.keys(imageBlocks).length);

    // Đợi thêm một chút để đảm bảo tất cả async operations hoàn thành
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log(
      "🎯 Returning imageBlocks with",
      Object.keys(imageBlocks).length,
      "slides"
    );
    return imageBlocks;
  };

  // Handle save từ slide editor
  const handleSave = async (slides: any[], textBlocks: string) => {
    if (!template?.data) {
      toast.error("Không tìm thấy template!");
      return;
    }

    try {
      setIsLoading(true);

      // Show loading toast để user biết đang process
      toast.loading("Đang xử lý và lưu template...", { id: "saving-template" });

      console.log("🚀 Starting template update...");
      console.log("🚀 Slides data:", slides);
      console.log("🚀 Number of slides:", slides.length);

      // Parse textBlocks JSON string
      let parsedTextBlocks = {};
      try {
        parsedTextBlocks = JSON.parse(textBlocks);
      } catch (error) {
        console.error("Error parsing textBlocks:", error);
      }

      console.log("🔄 Processing slides before capture...");

      // Process slides để convert blob URLs thành base64 TRƯỚC KHI capture
      const processedSlides = await Promise.all(
        slides.map(async (slide: any, index: number) => {
          console.log(
            `🔄 Processing slide ${index + 1} background:`,
            slide.background?.substring(0, 50) + "..."
          );

          // Process background
          const processedBackground = await processSlideBackground(
            slide.background || "#ffffff"
          );

          // Process elements
          const processedElements = await Promise.all(
            (slide.elements || []).map(async (element: any) => {
              if (
                element.type === "image" &&
                element.src?.startsWith("blob:")
              ) {
                console.log(
                  `🔄 Converting blob image in slide ${index + 1}:`,
                  element.id
                );
                try {
                  const base64Src = await convertBlobToBase64(element.src);
                  return { ...element, src: base64Src };
                } catch (error) {
                  console.error("❌ Error converting blob image:", error);
                  return element;
                }
              }
              return element;
            })
          );

          return {
            ...slide,
            background: processedBackground,
            elements: processedElements,
          };
        })
      );

      console.log("✅ All slides processed, starting capture...");

      // Capture updated imageBlocks từ processed slides
      const updatedImageBlocks = await captureUpdatedImageBlocks(
        processedSlides
      );

      // Prepare data để PUT API
      const updateData = {
        name: template.data.name,
        description: template.data.description,
        imageBlocks: updatedImageBlocks, // ✅ Sử dụng imageBlocks mới từ editor
        textBlocks: parsedTextBlocks,
      };

      console.log("🚀 Update data:", updateData);
      console.log(
        "🚀 Updated imageBlocks keys:",
        Object.keys(updatedImageBlocks)
      );
      console.log("🚀 Starting API update...");

      // PUT API update template và đợi hoàn thành
      await updateMutation.mutateAsync({
        id: templateId,
        data: updateData,
      });

      console.log("✅ API update completed successfully!");

      // Dismiss loading toast và show success
      toast.dismiss("saving-template");
      toast.success("Template đã được cập nhật thành công!");

      // Đợi thêm một chút để đảm bảo UI stable trước khi redirect
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect về trang danh sách
      console.log("🔄 Redirecting to templates list...");
      router.push("/staff/slide-templates");
    } catch (error: any) {
      console.error("Error updating slide template:", error);

      // Dismiss loading toast và show error
      toast.dismiss("saving-template");
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật template!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function để convert template data thành slide editor format
  const convertTemplateToSlideEditor = (
    textBlocks: any = {},
    imageBlocks: Record<string, string> = {}
  ) => {
    console.log("🔄 Converting template to slide editor format");
    console.log("🔄 TextBlocks:", textBlocks);
    console.log("🔄 ImageBlocks:", Object.keys(imageBlocks));

    let slides: any[] = [];

    // Check if textBlocks has slides array (new format)
    if (textBlocks.slides && Array.isArray(textBlocks.slides)) {
      console.log("🔄 Using new textBlocks format with slides array");
      slides = textBlocks.slides.map((slide: any, index: number) => ({
        id: slide.id || `slide_${index + 1}`,
        background: slide.background || "#ffffff",
        elements: slide.elements || [],
      }));
    } else {
      console.log("🔄 Using legacy textBlocks format");
      // Legacy format - convert from key-value pairs
      Object.entries(textBlocks).forEach(([key, value]) => {
        const match = key.match(/slide_(\d+)_text_(\d+)/);
        if (match) {
          const slideIndex = parseInt(match[1]) - 1;
          const elementIndex = parseInt(match[2]) - 1;

          if (!slides[slideIndex]) {
            slides[slideIndex] = {
              id: `slide_${slideIndex + 1}`,
              background: "#ffffff",
              elements: [],
            };
          }

          slides[slideIndex].elements.push({
            id: `element_text_${elementIndex + 1}`,
            type: "text",
            text: (value as any).text || "",
            style: (value as any).style || {},
            x: (value as any).position?.x || 50,
            y: (value as any).position?.y || 50,
            width: (value as any).position?.width || 200,
            height: (value as any).position?.height || 50,
            zIndex: elementIndex,
          });
        }
      });
    }

    // Nếu không có slides từ textBlocks, tạo từ imageBlocks
    if (slides.length === 0) {
      Object.entries(imageBlocks).forEach(([key, imageUrl]) => {
        const match = key.match(/slide_(\d+)/);
        if (match) {
          const slideIndex = parseInt(match[1]) - 1;

          if (!slides[slideIndex]) {
            slides[slideIndex] = {
              id: `slide_${slideIndex + 1}`,
              background: "#ffffff",
              elements: [],
            };
          }

          slides[slideIndex].originalImage = imageUrl;
        }
      });
    }

    // Nếu vẫn không có slides nào, tạo ít nhất 1 slide trống
    if (slides.length === 0) {
      slides.push({
        id: "slide_1",
        background: "#ffffff",
        elements: [],
      });
    }

    console.log("🔄 Converted slides:", slides);
    return { slides };
  };

  // Handle cancel - quay về trang danh sách
  const handleCancel = () => {
    router.push("/staff/slide-templates");
  };

  // Early returns với debug info
  if (!templateId) {
    console.error("❌ No template ID provided");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-questrial mb-4">
            ID template không hợp lệ!
          </p>
          <button
            onClick={() => router.push("/staff/slide-templates")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-questrial"
          >
            Quay về danh sách
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingTemplate) {
    console.log("⏳ Loading template...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!template?.data) {
    console.error("❌ Template not found for ID:", templateId);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-questrial mb-4">
            Không tìm thấy template với ID: {templateId}
          </p>
          <button
            onClick={() => router.push("/staff/slide-templates")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-questrial"
          >
            Quay về danh sách
          </button>
        </div>
      </div>
    );
  }

  // Convert template data thành format cho slide editor
  console.log("🔄 Converting template data...");
  const initialSlideData = convertTemplateToSlideEditor(
    template.data.textBlocks || {},
    template.data.imageBlocks || {}
  );
  console.log("🔄 Initial slide data:", initialSlideData);

  return (
    <div className="h-screen flex flex-col relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-questrial">
                Đang xử lý và lưu template...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-calsans text-gray-900">
              Chỉnh sửa Template: {template.data.name}
            </h1>
            {template.data.description && (
              <p className="text-sm text-gray-600 font-questrial mt-1">
                {template.data.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 font-questrial"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                // Trigger save từ slide editor
                // SlideEditorLayout sẽ cần expose save function
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-questrial flex items-center gap-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isLoading ? "Đang lưu..." : "Lưu Template"}
            </button>
          </div>
        </div>
      </div> */}

      {/* Slide Editor */}
      <div
        className={`flex-1 ${
          isLoading ? "pointer-events-none opacity-75" : ""
        }`}
      >
        <SlideEditorLayout
          initialSlides={initialSlideData.slides}
          templateData={{
            name: template.data.name,
            description: template.data.description,
          }}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
