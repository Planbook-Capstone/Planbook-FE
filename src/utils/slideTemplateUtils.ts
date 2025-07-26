import { toast } from "sonner";
import {
  useUpdateSlideTemplateTextBlocksService,
  useCreateSlideTemplateService,
} from "@/services/slideTemplateServices";

/**
 * Utility function để tạo template mới từ slide editor với full data
 * Sử dụng khi user save từ slide editor (mode create)
 */
export const createSlideTemplateFromEditor = async (
  name: string,
  description: string,
  imageBlocks: Record<string, string>,
  textBlocks: Record<string, any>
) => {
  try {
    // Gọi API để tạo template với full data
    const createMutation = useCreateSlideTemplateService();

    await createMutation.mutateAsync({
      name,
      description,
      imageBlocks,
      textBlocks,
    });

    toast.success("Template đã được tạo thành công!");

    // Redirect về trang danh sách templates
    window.location.href = "/staff/slide-templates";

    return true;
  } catch (error: any) {
    console.error("Error creating slide template:", error);
    toast.error(
      error.response?.data?.message || "Có lỗi xảy ra khi tạo template!"
    );
    return false;
  }
};

/**
 * Utility function để update textBlocks cho template đã tồn tại
 * Sử dụng khi user save từ slide editor (mode edit)
 */
export const saveSlideTemplateTextBlocks = async (
  templateId: string,
  textBlocks: Record<string, any>
) => {
  try {
    // Gọi API để update textBlocks
    const updateMutation = useUpdateSlideTemplateTextBlocksService();

    await updateMutation.mutateAsync({
      id: templateId,
      textBlocks,
    });

    toast.success("Template đã được lưu thành công!");

    // Redirect về trang danh sách templates
    window.location.href = "/staff/slide-templates";

    return true;
  } catch (error: any) {
    console.error("Error saving slide template:", error);
    toast.error(
      error.response?.data?.message || "Có lỗi xảy ra khi lưu template!"
    );
    return false;
  }
};

/**
 * Hook để sử dụng trong React component cho cả create và update
 */
export const useSaveSlideTemplate = () => {
  const createMutation = useCreateSlideTemplateService();
  const updateMutation = useUpdateSlideTemplateTextBlocksService();

  const createTemplate = async (
    name: string,
    description: string,
    imageBlocks: Record<string, string>,
    textBlocks: Record<string, any>
  ) => {
    try {
      await createMutation.mutateAsync({
        name,
        description,
        imageBlocks,
        textBlocks,
      });

      toast.success("Template đã được tạo thành công!");

      // Redirect về trang danh sách templates
      setTimeout(() => {
        window.location.href = "/staff/slide-templates";
      }, 1000);

      return true;
    } catch (error: any) {
      console.error("Error creating slide template:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo template!"
      );
      return false;
    }
  };

  const updateTemplate = async (
    templateId: string,
    textBlocks: Record<string, any>
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: templateId,
        textBlocks,
      });

      toast.success("Template đã được cập nhật thành công!");

      // Redirect về trang danh sách templates
      setTimeout(() => {
        window.location.href = "/staff/slide-templates";
      }, 1000);

      return true;
    } catch (error: any) {
      console.error("Error updating slide template:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật template!"
      );
      return false;
    }
  };

  return {
    createTemplate,
    updateTemplate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isLoading: createMutation.isPending || updateMutation.isPending,
  };
};

/**
 * Helper function để convert slide editor data thành textBlocks format
 */
export const convertSlideEditorToTextBlocks = (
  slideEditorData: any
): Record<string, any> => {
  // Implement logic để convert từ slide editor format sang textBlocks format
  // Ví dụ:
  const textBlocks: Record<string, any> = {};

  if (slideEditorData.slides) {
    slideEditorData.slides.forEach((slide: any, index: number) => {
      if (slide.elements) {
        slide.elements.forEach((element: any, elementIndex: number) => {
          if (element.type === "text") {
            const key = `slide_${index}_text_${elementIndex}`;
            textBlocks[key] = {
              text: element.content,
              style: element.style,
              position: element.position,
            };
          }
        });
      }
    });
  }

  return textBlocks;
};

/**
 * Helper function để extract template data từ URL params
 */
export const getTemplateDataFromUrl = (): {
  mode: "create" | "edit";
  templateId?: string;
  name?: string;
  description?: string;
  imageBlocks?: Record<string, string>;
} | null => {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") as "create" | "edit";

  if (mode === "create") {
    // Mode create: lấy temp data từ URL
    const name = urlParams.get("name");
    const description = urlParams.get("description");
    const imageBlocksStr = urlParams.get("imageBlocks");

    let imageBlocks: Record<string, string> = {};
    if (imageBlocksStr) {
      try {
        imageBlocks = JSON.parse(imageBlocksStr);
      } catch (error) {
        console.error("Error parsing imageBlocks from URL:", error);
      }
    }

    return {
      mode: "create",
      name: name || undefined,
      description: description || undefined,
      imageBlocks:
        Object.keys(imageBlocks).length > 0 ? imageBlocks : undefined,
    };
  } else if (mode === "edit") {
    // Mode edit: lấy template ID
    const templateId = urlParams.get("template");
    return {
      mode: "edit",
      templateId: templateId || undefined,
    };
  }

  // Fallback: check old format với template ID
  const templateId = urlParams.get("template");
  if (templateId) {
    return {
      mode: "edit",
      templateId,
    };
  }

  return null;
};

/**
 * Helper function để extract template ID từ URL params (backward compatibility)
 */
export const getTemplateIdFromUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("template");
};
