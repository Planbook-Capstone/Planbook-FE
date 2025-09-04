"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SlideEditorLayout from "@/components/ui/slide-editor/SlideEditorLayout";
import { useCreateSlideTemplateService } from "@/services/slideTemplateServices";
import { useCreateMaterialService } from "@/services/materialServices";
import { toast } from "sonner";
import { useSlideTemplateContext } from "@/contexts/SlideTemplateContext";
import { convertGoogleSlideJsonToEditor } from "@/utils/googleSlidesConverter";
import sampleData from "@/data/sample-presentation.json";
import html2canvas from "html2canvas";

export default function CreateSlideTemplatePage() {
  const router = useRouter();
  const createMutation = useCreateSlideTemplateService();
  const createMaterialMutation = useCreateMaterialService();
  const { tempData, clearTempData } = useSlideTemplateContext();
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Check temp data từ Context
  useEffect(() => {
    if (!tempData) {
      // Nếu không có data, redirect về trang danh sách
      toast.error("Không tìm thấy dữ liệu template!");
      router.push("/staff/slide-templates");
      return;
    }
  }, [tempData, router]);

  // Function tạo placeholder images
  const createPlaceholderImages = (slides: any[]): Record<string, string> => {
    const imageBlocks: Record<string, string> = {};
    console.log("🎨 Creating placeholder images for", slides.length, "slides");

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];

      // Tạo canvas placeholder
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 960;
      canvas.height = 540;

      if (ctx) {
        // Background
        const bgColor = slide.background || "#ffffff";
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 960, 540);

        // Text placeholder
        ctx.fillStyle = "#666666";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Slide ${i + 1}`, 480, 270);

        // Border
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 960, 540);

        const slideKey = `slide_${i + 1}`;
        imageBlocks[slideKey] = canvas.toDataURL("image/png", 0.9);

        console.log(`🎨 Created placeholder for slide ${i + 1}`);
      }
    }

    return imageBlocks;
  };

  // Fallback function để capture từ main canvas
  const captureFromMainCanvas = async (
    slides: any[]
  ): Promise<Record<string, string>> => {
    const imageBlocks: Record<string, string> = {};
    console.log("🔄 Using fallback: capturing from main canvas");

    try {
      // Tìm main canvas
      const mainCanvas = document.querySelector("canvas") as HTMLCanvasElement;
      if (!mainCanvas) {
        console.error("❌ Main canvas not found");
        return imageBlocks;
      }

      console.log("✅ Found main canvas:", mainCanvas);

      // Capture canvas hiện tại (slide đang active)
      const canvasDataUrl = mainCanvas.toDataURL("image/png", 0.9);

      // Tạo key cho slide hiện tại (giả sử là slide đầu tiên)
      const slideKey = `slide_1`;
      imageBlocks[slideKey] = canvasDataUrl;

      console.log(
        `✅ Captured main canvas, base64 length: ${canvasDataUrl.length}`
      );
    } catch (error) {
      console.error("❌ Error capturing from main canvas:", error);
    }

    return imageBlocks;
  };

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
        // Extract gradient info (simplified parsing)
        const gradientMatch = background.match(/linear-gradient\(([^)]+)\)/);
        if (gradientMatch) {
          const gradientInfo = gradientMatch[1];
          const parts = gradientInfo.split(",").map((s) => s.trim());

          // Default direction
          let angle = 0;
          let colorStops = parts;

          // Check if first part is angle
          if (parts[0].includes("deg")) {
            angle = parseFloat(parts[0]);
            colorStops = parts.slice(1);
          }

          // Create gradient
          const gradient = ctx.createLinearGradient(0, 0, width, height);

          colorStops.forEach((stop, index) => {
            const position = index / (colorStops.length - 1);
            gradient.addColorStop(position, stop.trim());
          });

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
        } else {
          // Fallback to white
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
              // Draw image to cover entire background
              ctx.drawImage(img, 0, 0, width, height);
              resolve();
            } catch (error) {
              console.error("Error drawing background image:", error);
              // Fallback to white
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, width, height);
              resolve();
            }
          };
          img.onerror = () => {
            console.error("Error loading background image:", imageUrl);
            // Fallback to white
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            resolve();
          };

          img.crossOrigin = "anonymous";
          img.src = imageUrl;
        });
      } else {
        // Fallback to white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      // Default white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
  };

  // Helper function để render slides manually với positioning chính xác
  const renderSlidesManually = async (
    slides: any[]
  ): Promise<Record<string, string>> => {
    const imageBlocks: Record<string, string> = {};
    console.log(
      "🎯 Starting manual slide render with",
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

        // Kích thước canvas chuẩn 16:9 với scale cao để tăng độ rõ
        const scale = 3; // Tăng độ phân giải gấp 3 lần
        const canvasWidth = 960 * scale;
        const canvasHeight = 540 * scale;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Scale context để render với độ phân giải cao
        ctx?.scale(scale, scale);

        if (!ctx) {
          console.error(`❌ Cannot get canvas context for slide ${i + 1}`);
          continue;
        }

        // Render background
        const background = slide.background || "#ffffff";
        await renderBackground(ctx, background, 960, 540); // Sử dụng kích thước gốc vì đã scale
        console.log(`🎨 Set background ${background} for slide ${i + 1}`);

        // Render elements theo đúng thứ tự zIndex
        const elements = (slide.elements || []).sort(
          (a: any, b: any) => (a.zIndex || 0) - (b.zIndex || 0)
        );

        for (const element of elements) {
          console.log(`🔧 Rendering element:`, element.type, element);

          if (element.type === "text") {
            // Render text với positioning chính xác
            const style = element.style || {};
            const fontSize = style.fontSize || 16;
            const fontFamily = style.fontFamily || "Arial, sans-serif";
            const color = style.color || "#000000";
            const textAlign = style.textAlign || "left";
            const bold = style.bold ? "bold" : "normal";
            const italic = style.italic ? "italic" : "normal";

            // Set font với weight và style
            ctx.font = `${italic} ${bold} ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = textAlign as CanvasTextAlign;

            // Text positioning - quan trọng!
            const text = element.text || "";
            const x = element.x || 0;
            const y = element.y || 0;
            const width = element.width || 200;

            // Tính toán baseline đúng
            let textX = x;
            let textY = y + fontSize; // Baseline offset

            // Adjust X position based on alignment
            if (textAlign === "center") {
              textX = x + width / 2;
            } else if (textAlign === "right") {
              textX = x + width;
            }

            // Handle multiline text
            const lines = text.split("\n");
            const lineHeight = fontSize * 1.2;

            lines.forEach((line: string, index: number) => {
              const currentY = textY + index * lineHeight;
              ctx.fillText(line, textX, currentY);
            });
          } else if (element.type === "image" && element.src) {
            // Render image với positioning chính xác
            await new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                try {
                  const x = element.x || 0;
                  const y = element.y || 0;
                  const width = element.width || 100;
                  const height = element.height || 100;

                  ctx.drawImage(img, x, y, width, height);
                  resolve();
                } catch (error) {
                  console.error("Error drawing image:", error);
                  resolve();
                }
              };
              img.onerror = () => {
                console.error("Error loading image:", element.src);
                resolve();
              };

              img.crossOrigin = "anonymous";
              img.src = element.src;
            });
          } else if (element.type === "shape") {
            // Render shape với positioning chính xác
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
          }
        }

        // Convert to base64 và upload lên API
        const slideImageBase64 = canvas.toDataURL("image/png", 0.9);
        const slideKey = `slide_${i + 1}`;

        try {
          // Convert base64 to blob
          const response = await fetch(slideImageBase64);
          const blob = await response.blob();

          // Create file from blob
          const file = new File(
            [blob],
            `imageBlock_slide_${i + 1}_${tempData?.name || "template"}.png`,
            {
              type: "image/png",
            }
          );

          // Upload to API
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "metadataJson",
            JSON.stringify({
              type: "slide-image",
              name: `imageBlock_slide_${i + 1}_${tempData?.name || "template"}`,
              description: `Slide ${i + 1} image for template ${
                tempData?.name || "template"
              }`,
              url: "null", // Will be set by backend after file upload
              tagIds: 9,
            })
          );

          const uploadResult = await createMaterialMutation.mutateAsync(
            formData
          );
          const imageUrl = uploadResult?.data?.data?.url;

          if (imageUrl) {
            imageBlocks[slideKey] = imageUrl;
            console.log(`✅ Uploaded slide ${i + 1} to API, URL:`, imageUrl);
          } else {
            // Fallback to base64 if upload fails
            imageBlocks[slideKey] = slideImageBase64;
            console.log(
              `⚠️ Upload failed for slide ${i + 1}, using base64 fallback`
            );
          }
        } catch (uploadError) {
          console.error(`❌ Error uploading slide ${i + 1}:`, uploadError);
          // Fallback to base64 if upload fails
          imageBlocks[slideKey] = slideImageBase64;
          console.log(`⚠️ Using base64 fallback for slide ${i + 1}`);
        }
      }
    } catch (error) {
      console.error("❌ Error in renderSlidesManually:", error);
    }

    console.log("🎯 Final imageBlocks:", Object.keys(imageBlocks));
    return imageBlocks;
  };

  // Helper function để capture screenshot từ slide preview thumbnails
  const captureSlideScreenshots = async (
    slides: any[]
  ): Promise<Record<string, string>> => {
    const imageBlocks: Record<string, string> = {};

    console.log(
      "🎯 Starting captureSlideScreenshots with slides:",
      slides.length
    );

    try {
      // Đợi một chút để đảm bảo DOM đã render xong
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Debug: Log tất cả các elements có thể liên quan
      const allDivs = document.querySelectorAll("div");

      // Tìm HorizontalSlidePanel
      const horizontalPanel = document.querySelector('[class*="w-full h-40"]');

      // Tìm slide container
      const slideContainer = document.querySelector(
        '[class*="flex gap-2 h-full"]'
      );
      console.log("🔍 Slide container found:", slideContainer);

      // Tìm các slide elements
      const slideElements = document.querySelectorAll(
        '[class*="group relative flex-shrink-0"]'
      );
      console.log(`🔍 Slide elements found: ${slideElements.length}`);

      // Tìm preview elements với nhiều cách khác nhau
      const method1 = document.querySelectorAll('[style*="width: 88px"]');
      const method2 = document.querySelectorAll('[style*="height: 50px"]');
      const method3 = document.querySelectorAll(
        ".relative.border.border-gray-200.rounded.overflow-hidden"
      );
      const method4 = document.querySelectorAll(
        '[class*="relative border border-gray-200 rounded overflow-hidden"]'
      );

      // Log chi tiết các elements tìm được
      if (slideElements.length > 0) {
        slideElements.forEach((el, i) => {
          console.log(`🔍 Slide element ${i}:`, el);
          const previewInside = el.querySelector('div[style*="width"]');
          console.log(`🔍 Preview inside slide ${i}:`, previewInside);
        });
      }

      // Chọn method tốt nhất
      let elementsToCapture: NodeListOf<Element> | null = null;

      if (method3.length > 0) {
        elementsToCapture = method3;
        console.log("✅ Using method 3 (class selector)");
      } else if (method4.length > 0) {
        elementsToCapture = method4;
        console.log("✅ Using method 4 (class contains)");
      } else if (method1.length > 0) {
        elementsToCapture = method1;
        console.log("✅ Using method 1 (width selector)");
      } else {
        console.error("❌ No slide preview elements found with any method");
        console.log("🔄 Trying fallback: capture from main canvas");

        // Sử dụng placeholder images luôn
        console.log("🔄 Creating placeholder images...");
        return createPlaceholderImages(slides);
      }

      // Sử dụng cách render lại thay vì capture preview
      console.log("🔄 Using manual render method instead");
      return await renderSlidesManually(slides);
    } catch (error) {
      console.error("❌ Error in captureSlideScreenshots:", error);
    }

    console.log("🎯 Final imageBlocks:", Object.keys(imageBlocks));
    return imageBlocks;
  };

  // Handle save từ slide editor
  const handleSave = async (slides: any[], textBlocks: string) => {
    if (!tempData) {
      toast.error("Không tìm thấy dữ liệu template!");
      return;
    }

    try {
      setIsLoading(true);

      // Parse textBlocks JSON string
      let parsedTextBlocks = {};
      try {
        parsedTextBlocks = JSON.parse(textBlocks);
      } catch (error) {
        console.error("Error parsing textBlocks:", error);
      }

      // Capture screenshots của từng slide
      const extractedImageBlocks = await captureSlideScreenshots(slides);

      // Prepare full data để POST API
      const fullData = {
        name: tempData.name,
        description: tempData.description,
        imageBlocks: extractedImageBlocks,
        textBlocks: parsedTextBlocks,
      };

      // POST API tạo template
      await createMutation.mutateAsync(fullData);

      toast.success("Template đã được tạo thành công!");

      // Clear temp data và redirect về trang danh sách
      clearTempData();
      router.push("/staff/slide-templates");
    } catch (error: any) {
      console.error("Error creating slide template:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo template!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel - clear temp data và quay về trang danh sách
  const handleCancel = () => {
    clearTempData();
    router.push("/staff/slide-templates");
  };

  //Test
  const handleLoadSampleData = async () => {
    setIsLoading(true);
    try {
      // Convert Google Slides JSON to editor format
      const convertedData = convertGoogleSlideJsonToEditor(sampleData);

      // Transform to match SlideEditorLayout expected format
      const editorSlides = convertedData.slides.map((slide: any) => ({
        id: slide.id,
        elements: slide.elements.map((element: any) => {
          // Debug logging for problematic coordinates
          if (
            element.x < 0 ||
            element.y < 0 ||
            element.x > 960 ||
            element.y > 540
          ) {
            console.warn(`🚨 Problematic element after conversion:`, {
              id: element.id,
              type: element.type,
              coordinates: { x: element.x, y: element.y },
              size: { width: element.width, height: element.height },
              text: element.text?.slice(0, 50) + "...",
            });
          }

          return {
            id: element.id,
            type: element.type,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            text: element.text || "",
            style: element.style || {},
            // Add any additional properties needed
          };
        }),
      }));

      setSlides(editorSlides);
      setHasLoadedData(true);

      console.log("✅ Loaded sample data:", convertedData);
      console.log("📊 Slides:", editorSlides.length);
      console.log(
        "📄 Elements total:",
        editorSlides.reduce(
          (total: number, slide: any) => total + slide.elements.length,
          0
        )
      );
    } catch (error) {
      console.error("❌ Failed to load sample data:", error);
      alert("Failed to load sample data. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tempData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-questrial">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Slide Editor */}

      <div className="flex-1">
        <SlideEditorLayout
          templateData={tempData}
          initialSlides={slides}
          onSave={handleSave}
          onCancel={handleCancel}
          onLoadSampleData={handleLoadSampleData}
        />
      </div>
    </div>
  );
}
