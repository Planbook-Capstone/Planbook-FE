"use client";
import DocumentItem from "@/components/molecules/document-item";
import CreateConfigurationModal from "@/components/organisms/create-configuration-modal";
import DeleteConfirmDialog from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfigurationFormData } from "@/schemas/configuration.schema";
import {
  useDeletePdfWithQuery,
  useGetAllGuides,
  useQuickTextBookAnalysisService,
} from "@/services/textbookServices";

import {
  BrainCircuit,
  Download,
  Eye,
  Globe,
  ImageIcon,
  Plus,
  Upload,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const AdminConfigurationPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [starters, setStarters] = useState(["", "", "", ""]);
  const [capabilities, setCapabilities] = useState({
    web: true,
    dalle: true,
    code: false,
  });

  type CapabilityKey = "web" | "dalle" | "code";

  const toggleCapability = (key: CapabilityKey) => {
    setCapabilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { data: guides, isLoading: isGuidesLoading } = useGetAllGuides();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState<any>(null);
  const { mutate: deletePdf, isPending: isDeleting } = useDeletePdfWithQuery();
  const { mutate: importConfiguration, isPending: isImporting } =
    useQuickTextBookAnalysisService();
  const handleCreateConfiguration = (data: ConfigurationFormData) => {
    console.log("Creating configuration:", data);

    // Tạo FormData cho import configuration
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("isImportGuide", "true");

    // Gọi service import configuration
    importConfiguration(formData, {
      onSuccess: (response) => {
        console.log("✅ Configuration Import Response:", response);

        toast.success("Import hướng dẫn thành công!");

        // Đóng modal sau khi thành công
        setIsCreateModalOpen(false);
      },
      onError: (error) => {
        console.error("❌ Configuration Import Error:", error);

        toast.error(
          error?.response?.data?.message ||
            "Import hướng dẫn thất bại. Vui lòng thử lại!"
        );
      },
    });
  };

  // Hàm xử lý download file
  const handleDownloadFile = async (guide: any) => {
    try {
      if (!guide?.file_url) {
        toast.error("Không tìm thấy đường dẫn file để tải xuống");
        return;
      }

      toast.info("Đang chuẩn bị tải xuống...");

      // Tạo tên file từ collection_name hoặc sử dụng tên mặc định
      const fileName = guide?.collection_name
        ? `${guide.collection_name.replace(/[^a-zA-Z0-9\s]/g, "_")}.pdf`
        : `guide_${guide.id}.pdf`;

      // Kiểm tra nếu file_url là đường dẫn tuyệt đối hay tương đối
      let downloadUrl = guide.file_url;

      // Nếu là đường dẫn tương đối, thêm base URL của API
      if (!downloadUrl.startsWith("http")) {
        // Giả sử API base URL cho file downloads
        downloadUrl = `${
          process.env.NEXT_PUBLIC_SECONDARY_API_URL || "http://localhost:8000"
        }${downloadUrl}`;
      }

      try {
        // Thử fetch file trước để kiểm tra
        const response = await fetch(downloadUrl, {
          method: "GET",
          headers: {
            Accept: "application/pdf,application/octet-stream,*/*",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Tạo blob từ response
        const blob = await response.blob();

        // Tạo URL object từ blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Tạo link download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;

        // Thêm vào DOM, click và xóa
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup blob URL
        window.URL.revokeObjectURL(blobUrl);

        toast.success("Tải xuống thành công!");
      } catch (fetchError) {
        console.warn("Fetch failed, trying direct download:", fetchError);

        // Fallback: thử download trực tiếp
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Đang tải xuống file...");
      }
    } catch (error) {
      console.error("❌ Download Error:", error);
      toast.error("Có lỗi xảy ra khi tải xuống file. Vui lòng thử lại!");
    }
  };

  // Hàm xử lý xem trước file
  const handlePreviewFile = (guide: any) => {
    try {
      if (!guide?.file_url) {
        toast.error("Không tìm thấy đường dẫn file để xem trước");
        return;
      }

      // Tạo URL cho Google Docs viewer
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
        guide.file_url
      )}&embedded=true`;
      setPreviewFileUrl(viewerUrl);
      setIsPreviewModalOpen(true);
    } catch (error) {
      console.error("❌ Preview Error:", error);
      toast.error("Có lỗi xảy ra khi xem trước file");
    }
  };

  // Hàm xử lý click vào item guide
  const handleGuideClick = (guide: any) => {
    setSelectedGuide(guide);
    setIsDetailModalOpen(true);
  };

  // Hàm xử lý xóa guide
  const handleRemoveGuide = (guide: any) => {
    setGuideToDelete(guide);
    setShowDeleteModal(true);
  };

  // Hàm xác nhận xóa
  const handleConfirmDelete = () => {
    if (!guideToDelete?.book_id || isDeleting) return;

    deletePdf(guideToDelete.book_id, {
      onSuccess: () => {
        toast.success("Xóa hướng dẫn thành công!");
        setShowDeleteModal(false);
        setGuideToDelete(null);
        // Refetch guides list sẽ tự động được gọi bởi react-query
      },
      onError: (error: any) => {
        console.error("Delete guide failed:", error);
        toast.error(
          error?.response?.data?.message ||
            "Xóa hướng dẫn thất bại. Vui lòng thử lại!"
        );
      },
    });
  };

  // Hàm hủy xóa
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setGuideToDelete(null);
  };

  return (
    <div className="mx-auto p-6 space-y-6 font-questrial">
      <div className="flex justify-between items-center">
        <h1 className="font-calsans text-base">Danh sách hướng dẫn</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 float-end"
        >
          <Plus className="w-4 h-4" />
          Tạo hướng dẫn
        </Button>
      </div>

      {isGuidesLoading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(7)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-[200px] w-full rounded-md bg-neutral-300"
              />
            ))}
          </div>
        </>
      )}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-5">
        {guides?.data?.guides?.map((guide: any) => (
          <DocumentItem
            onClick={() => handleGuideClick(guide)}
            key={guide.book_id}
            type="DOCX"
            name={
              guide?.collection_name?.length > 20
                ? guide.collection_name.substring(0, 20) + "..."
                : guide?.collection_name
            }
            description={`Ngày tạo: ${
              guide?.uploaded_at
                ? new Date(guide.uploaded_at).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"
            }`}
            onRemove={() => handleRemoveGuide(guide)}
          />
        ))}
      </div>
      <CreateConfigurationModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateConfiguration}
        isLoading={isImporting}
      />

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90vw] h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Xem trước tài liệu</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={previewFileUrl}
                className="w-full h-full border rounded"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] max-w-[90vw] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Chi tiết hướng dẫn</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={"/images/files/DOC.svg"}
                  alt="Document icon"
                  className="w-12 h-12"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">
                    {selectedGuide?.collection_name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Ngày tạo:{" "}
                    {selectedGuide?.uploaded_at
                      ? new Date(selectedGuide.uploaded_at).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    handlePreviewFile(selectedGuide);
                    setIsDetailModalOpen(false);
                  }}
                  className="flex items-center gap-2 flex-1"
                >
                  <Eye className="w-4 h-4" />
                  Xem trước
                </Button>
                <Button
                  onClick={() => handleDownloadFile(selectedGuide)}
                  className="flex items-center gap-2 flex-1"
                >
                  <Download className="w-4 h-4" />
                  Tải xuống
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa hướng dẫn"
        itemName={guideToDelete?.collection_name}
        isLoading={isDeleting}
      />

      {/* <div className="flex justify-between items-center">
        <Button variant="outline">Tạo mới</Button>
        <Button variant="default">Cấu hình</Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1">Tên</label>
          <Input value={name} onChange={(e: any) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">Mô tả</label>
          <Input
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Hướng dẫn</label>
          <Input
            value={instructions}
            onChange={(e: any) => setInstructions(e.target.value)}
            asTextarea={true}
          />
        </div>

        <div>
          <label className="block mb-2">Mở dầu cuộc hội thoại</label>
          <div className="space-y-2">
            {starters.map((s, i) => (
              <div className="w-full flex gap-2">
                <Input
                  key={i}
                  value={s}
                  onChange={(e: any) => {
                    const copy = [...starters];
                    copy[i] = e.target.value;
                    setStarters(copy);
                  }}
                />
                <Button className="h-full bg-white border text-neutral-600 hover:bg-neutral-100">
                  <X />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Tài nguyên</label>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload files
          </Button>
        </div>

        <div>
          <label className="block mb-2">Khả năng</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={capabilities.web}
                onCheckedChange={() => toggleCapability("web")}
              />
              <Globe className="w-4 h-4" /> Tìm kiếm mở rộng
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={capabilities.dalle}
                onCheckedChange={() => toggleCapability("dalle")}
              />
              <ImageIcon className="w-4 h-4" /> DALL·E tạo hình ảnh
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={capabilities.code}
                onCheckedChange={() => toggleCapability("code")}
              />
              <BrainCircuit className="w-4 h-4" /> Tích hợp thông dịch mã
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-2">Hành động</label>
          <Button variant="outline">Thêm hành động</Button>
        </div>
      </div> */}
    </div>
  );
};

export default AdminConfigurationPage;
