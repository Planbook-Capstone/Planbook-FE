"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/organisms/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/textarea";
import { ExternalToolConfig, mockExternalToolConfigs } from "@/data/tools";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import {
  useExternalToolsService,
  useCreateExternalToolService,
  useUpdateExternalToolService,
  useDeleteExternalToolService,
} from "@/services/externalToolsServices";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock current user (tool-manager)
const CURRENT_USER_ID = "uuid-4"; // Phạm Thị Tool Manager

interface APIToolsTableProps {
  className?: string;
}

export default function APIToolsTable({ className }: APIToolsTableProps) {
  // API calls with number parameters (not strings)
  const {
    data: externalToolsData,
    isLoading: isLoadingTools,
    error: apiError,
  } = useExternalToolsService(
    {
      retry: 1, // Only retry once
      staleTime: 0, // Don't use stale data
    },
    {
      offset: 1, // Number instead of string
      pageSize: 10, // Number instead of string
      sortBy: "createdAt",
      sortDirection: "desc",
    }
  );
  const createToolMutation = useCreateExternalToolService();
  const updateToolMutation = useUpdateExternalToolService();
  const deleteToolMutation = useDeleteExternalToolService();

  // State management
  const [tools, setTools] = useState<ExternalToolConfig[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ExternalToolConfig | null>(
    null
  );

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: "",
    apiUrl: "",
    tokenUrl: "",
    clientId: "",
    clientSecret: "",
    description: "",
    tokenCostPerQuery: 0,
    inputJson: "",
    href: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Set tools data from API with error handling
  useEffect(() => {
    if (externalToolsData?.data?.content) {
      // API returns data.content array, not data directly
      const apiTools = externalToolsData.data.content;

      setTools(apiTools);
    } else if (apiError) {
      // Fallback to mock data if API fails
      setTools(
        mockExternalToolConfigs.filter(
          (tool) => tool.ownerId === CURRENT_USER_ID
        )
      );
    } else if (!isLoadingTools) {
      // Fallback to mock data if no data
      setTools(
        mockExternalToolConfigs.filter(
          (tool) => tool.ownerId === CURRENT_USER_ID
        )
      );
    }
  }, [externalToolsData, apiError, isLoadingTools]);

  // Validation functions
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) return true; // Optional field
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Tên API là bắt buộc";
    }

    if (!formData.apiUrl.trim()) {
      errors.apiUrl = "API URL là bắt buộc";
    } else if (!validateUrl(formData.apiUrl)) {
      errors.apiUrl = "API URL không đúng định dạng";
    }

    if (!formData.tokenUrl.trim()) {
      errors.tokenUrl = "Token URL là bắt buộc";
    } else if (!validateUrl(formData.tokenUrl)) {
      errors.tokenUrl = "Token URL không đúng định dạng";
    }

    if (!formData.clientId.trim()) {
      errors.clientId = "Client ID là bắt buộc";
    }

    if (!formData.clientSecret.trim()) {
      errors.clientSecret = "Client Secret là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleCreateTool = () => {
    if (!validateForm()) return;

    const newTool = {
      name: formData.name.trim(),
      apiUrl: formData.apiUrl.trim(),
      tokenUrl: formData.tokenUrl.trim(),
      clientId: formData.clientId.trim(),
      clientSecret: formData.clientSecret.trim(),
      description: formData.description.trim(),
      tokenCostPerQuery: formData.tokenCostPerQuery,
      inputJson: JSON.parse(formData.inputJson.trim()),
      href: formData.href.trim(),
    };

    console.log("🚀 Creating tool:", newTool);

    createToolMutation.mutate(newTool, {
      onSuccess: (response) => {
        toast.success(
          "Đã đăng kí tool thành công vui lòng đợi Admin chấp nhận"
        );
        setIsCreateModalOpen(false);
        resetForm();
      },
      onError: (error: any) => {
        console.error("Error creating tool:", error?.response.data);
        toast.error("Có lỗi xảy ra vui lòng thử lại");
      },
    });
  };

  const handleEditTool = () => {
    if (!validateForm() || !selectedTool) return;

    const updatedTool = {
      name: formData.name.trim(),
      apiUrl: formData.apiUrl.trim(),
      tokenUrl: formData.tokenUrl.trim(),
      clientId: formData.clientId.trim(),
      clientSecret: formData.clientSecret.trim(),
      description: formData.description.trim(),
      tokenCostPerQuery: formData.tokenCostPerQuery,
      inputJson: JSON.parse(formData.inputJson.trim()),
      href: formData.href.trim(),
    };

    console.log("Updating tool:", updatedTool);

    updateToolMutation.mutate(
      { id: selectedTool.id!, data: updatedTool },
      {
        onSuccess: (response) => {
          console.log("Tool updated successfully:", response);
          setIsEditModalOpen(false);
          setSelectedTool(null);
          resetForm();
        },
        onError: (error) => {
          console.error("Error updating tool:", error);
        },
      }
    );
  };

  const handleViewTool = (tool: ExternalToolConfig) => {
    setSelectedTool(tool);
    setIsViewModalOpen(true);
  };

  const openEditModal = (tool: ExternalToolConfig) => {
    setSelectedTool(tool);
    setFormData({
      name: tool.name,
      apiUrl: tool.apiUrl,
      tokenUrl: tool.tokenUrl,
      clientId: tool.clientId,
      clientSecret: tool.clientSecret,
      description: tool.description || "",
      tokenCostPerQuery: (tool as any).tokenCostPerQuery || 0,
      inputJson: JSON.stringify((tool as any).inputJson) || "",
      href: (tool as any).href || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteTool = (tool: ExternalToolConfig) => {
    if (confirm(`Bạn có chắc chắn muốn xóa API "${tool.name}"?`)) {
      deleteToolMutation.mutate(tool.id!);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      apiUrl: "",
      tokenUrl: "",
      clientId: "",
      clientSecret: "",
      description: "",
      tokenCostPerQuery: 0,
      inputJson: "",
      href: "",
    });
    setFormErrors({});
  };

  // Table columns definition
  const columns: ColumnDef<ExternalToolConfig>[] = [
    {
      accessorKey: "name",
      header: "Tên API",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div
            className="font-medium text-gray-900 font-questrial max-w-xs truncate cursor-pointer hover:text-blue-600"
            title={name}
          >
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: "apiUrl",
      header: "API URL",
      cell: ({ row }) => {
        const apiUrl = row.getValue("apiUrl") as string;
        return (
          <div
            className="text-gray-600 font-questrial text-sm max-w-xs truncate cursor-pointer hover:text-blue-600"
            title={apiUrl}
          >
            {apiUrl}
          </div>
        );
      },
    },
    {
      accessorKey: "clientId",
      header: "Client ID",
      cell: ({ row }) => (
        <div className="text-gray-600 font-questrial text-sm">
          ••••••••••••••••
        </div>
      ),
    },
    {
      accessorKey: "clientSecret",
      header: "Client Secret",
      cell: ({ row }) => {
        const clientSecret = row.getValue("clientSecret") as string;
        const [isVisible, setIsVisible] = React.useState(false);
        const [copied, setCopied] = React.useState(false);

        const handleClick = async () => {
          if (isVisible) {
            // Copy to clipboard
            try {
              await navigator.clipboard.writeText(clientSecret);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch (err) {
              console.error("Failed to copy: ", err);
            }
          } else {
            setIsVisible(true);
            // Hide again after 5 seconds
            setTimeout(() => setIsVisible(false), 5000);
          }
        };

        return (
          <div
            className="text-gray-600 font-questrial text-sm cursor-pointer hover:text-blue-600 max-w-xs truncate select-none"
            onClick={handleClick}
            title={
              copied ? "Đã copy!" : isVisible ? "Click để copy" : "Click để xem"
            }
          >
            {copied
              ? "✓ Đã copy!"
              : isVisible
              ? clientSecret
              : "••••••••••••••••"}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => {
        const description =
          (row.getValue("description") as string) || "Không có mô tả";
        return (
          <div
            className="text-gray-600 font-questrial text-sm max-w-xs truncate cursor-pointer hover:text-blue-600"
            title={description}
          >
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.getValue("status") as string) || "Không có status";
        return (
          <div>
            <Badge variant={status == "ACTIVE" ? "success" : "warning"}>
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const tool = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewTool(tool)}
              className="p-2 hover:bg-blue-50 hover:text-blue-600"
              title="Xem chi tiết"
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(tool)}
              className="p-2 hover:bg-green-50 hover:text-green-600"
              title="Chỉnh sửa"
            >
              <Edit size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={`bg-white ${className}`}>
      {/* API Tools Table */}
      <div className="bg-white rounded-lg border-gray-200">
        <div className="border-gray-200 flex justify-between mb-6">
          <h2 className="text-lg font-calsans text-gray-900">
            Danh sách API ({tools.length})
          </h2>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Tạo API mới
          </Button>
        </div>

        <div className="py-6">
          <DataTable columns={columns} data={tools} />
        </div>
      </div>

      {/* Create Tool Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo API mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Tên API" htmlFor="name" error={formErrors.name}>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên API"
                />
              </FormField>

              <FormField
                label="Token Cost Per Query"
                htmlFor="tokenCostPerQuery"
              >
                <Input
                  id="tokenCostPerQuery"
                  type="number"
                  value={formData.tokenCostPerQuery}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tokenCostPerQuery: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="8"
                />
              </FormField>

              <FormField
                label="Client ID"
                htmlFor="clientId"
                error={formErrors.clientId}
              >
                <Input
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientId: e.target.value,
                    }))
                  }
                  placeholder="Nhập Client ID"
                />
              </FormField>

              <FormField
                label="Client Secret"
                htmlFor="clientSecret"
                error={formErrors.clientSecret}
              >
                <Input
                  id="clientSecret"
                  type="password"
                  value={formData.clientSecret}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientSecret: e.target.value,
                    }))
                  }
                  placeholder="Nhập Client Secret"
                />
              </FormField>

              <FormField
                label="Token URL"
                htmlFor="tokenUrl"
                error={formErrors.tokenUrl}
              >
                <Input
                  id="tokenUrl"
                  value={formData.tokenUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tokenUrl: e.target.value,
                    }))
                  }
                  placeholder="https://api.example.com/token"
                />
              </FormField>

              <FormField
                label="API URL"
                htmlFor="apiUrl"
                error={formErrors.apiUrl}
              >
                <Input
                  id="apiUrl"
                  value={formData.apiUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, apiUrl: e.target.value }))
                  }
                  placeholder="https://api.example.com"
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField
                  label="Input JSON"
                  htmlFor="inputJson"
                  error={formErrors.inputJson}
                >
                  <Textarea
                    id="inputJson"
                    value={formData.inputJson}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        inputJson: e.target.value,
                      }))
                    }
                    placeholder='{"className": "SE1705"}'
                    rows={2}
                    className="resize-y"
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Mô tả" htmlFor="description">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Mô tả về API này..."
                    rows={2}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateTool}>Tạo mới</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Tool Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="!max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-calsans">Chi tiết API</DialogTitle>
          </DialogHeader>
          {selectedTool && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tên API
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedTool.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    API URL
                  </label>
                  <p className="font-questrial text-gray-900 break-all">
                    {selectedTool.apiUrl}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Token URL
                  </label>
                  <p className="font-questrial text-gray-900 break-all">
                    {selectedTool.tokenUrl}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Client ID
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedTool.clientId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Client Secret
                  </label>
                  <p className="font-questrial text-gray-900">
                    ••••••••••••••••
                  </p>
                </div>
                {(selectedTool as any).href && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Href
                    </label>
                    <p className="font-questrial text-gray-900 break-all">
                      {(selectedTool as any).href}
                    </p>
                  </div>
                )}
                {selectedTool.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 ">
                      Mô tả
                    </label>
                    <p className="font-questrial text-gray-900 line-clamp-3 max-w-[500px]">
                      {selectedTool.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Tool Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-calsans">Chỉnh sửa API</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Tên API"
                htmlFor="edit-name"
                error={formErrors.name}
              >
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên API"
                />
              </FormField>

              <FormField
                label="Token Cost Per Query"
                htmlFor="edit-tokenCostPerQuery"
              >
                <Input
                  id="edit-tokenCostPerQuery"
                  type="number"
                  value={formData.tokenCostPerQuery}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tokenCostPerQuery: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="8"
                />
              </FormField>

              <FormField
                label="Client ID"
                htmlFor="edit-clientId"
                error={formErrors.clientId}
              >
                <Input
                  id="edit-clientId"
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientId: e.target.value,
                    }))
                  }
                  placeholder="Nhập Client ID"
                />
              </FormField>

              <FormField
                label="Client Secret"
                htmlFor="edit-clientSecret"
                error={formErrors.clientSecret}
              >
                <Input
                  id="edit-clientSecret"
                  type="password"
                  value={formData.clientSecret}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientSecret: e.target.value,
                    }))
                  }
                  placeholder="Nhập Client Secret mới"
                />
              </FormField>

              <FormField
                label="Token URL"
                htmlFor="edit-tokenUrl"
                error={formErrors.tokenUrl}
              >
                <Input
                  id="edit-tokenUrl"
                  value={formData.tokenUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tokenUrl: e.target.value,
                    }))
                  }
                  placeholder="https://api.example.com/token"
                />
              </FormField>

              <FormField
                label="API URL"
                htmlFor="edit-apiUrl"
                error={formErrors.apiUrl}
              >
                <Input
                  id="edit-apiUrl"
                  value={formData.apiUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, apiUrl: e.target.value }))
                  }
                  placeholder="https://api.example.com"
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField
                  label="Input JSON"
                  htmlFor="edit-inputJson"
                  error={formErrors.inputJson}
                >
                  <Textarea
                    id="edit-inputJson"
                    value={formData.inputJson}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        inputJson: e.target.value,
                      }))
                    }
                    placeholder='{"className": "SE1705"}'
                    rows={2}
                    className="resize-y"
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Mô tả" htmlFor="edit-description">
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Mô tả về API này..."
                    rows={2}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedTool(null);
                  resetForm();
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleEditTool}>Cập nhật</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
