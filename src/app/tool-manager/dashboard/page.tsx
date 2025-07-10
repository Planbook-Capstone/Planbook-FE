"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import {
  ExternalToolConfig,
  mockExternalToolConfigs,
  mockRevenueData,
} from "@/data/tools";
import { Plus, Eye, Edit, Trash2, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import {
  useExternalToolsService,
  useCreateExternalToolService,
  useUpdateExternalToolService,
  useDeleteExternalToolService,
} from "@/services/externalToolsServices";

// Mock current user (tool-manager)
const CURRENT_USER_ID = "uuid-4"; // Phạm Thị Tool Manager

export default function ToolManagerDashboardPage() {
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

  // Revenue data for current user's tools
  const userRevenueData = useMemo(() => {
    const userToolIds = tools.map((tool) => tool.id);
    return mockRevenueData.filter((revenue) =>
      userToolIds.includes(revenue.toolId)
    );
  }, [tools]);

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return userRevenueData.reduce((sum, record) => sum + record.amount, 0);
  }, [userRevenueData]);

  // Calculate monthly revenue for current month
  const currentMonthRevenue = useMemo(() => {
    const currentMonth = "2025-05"; // Mock current month
    return userRevenueData
      .filter((record) => record.month === currentMonth)
      .reduce((sum, record) => sum + record.amount, 0);
  }, [userRevenueData]);

  // Prepare chart data
  const monthlyChartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    userRevenueData.forEach((record) => {
      monthlyData[record.month] =
        (monthlyData[record.month] || 0) + record.amount;
    });

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month: month.replace("2025-", "T"),
        amount,
        formattedAmount: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          notation: "compact",
        }).format(amount),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [userRevenueData]);

  const toolRevenueData = useMemo(() => {
    const toolData: Record<string, number> = {};
    userRevenueData.forEach((record) => {
      const tool = tools.find((t) => t.id === record.toolId);
      if (tool) {
        toolData[tool.name] = (toolData[tool.name] || 0) + record.amount;
      }
    });

    return Object.entries(toolData).map(([name, amount]) => ({
      name,
      amount,
      formattedAmount: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        notation: "compact",
      }).format(amount),
    }));
  }, [userRevenueData, tools]);

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

    if (formData.inputJson.trim() && !validateJson(formData.inputJson)) {
      errors.inputJson = "Input JSON không đúng định dạng";
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
      inputJson: formData.inputJson.trim(),
    };

    console.log("🚀 Creating tool:", newTool);

    createToolMutation.mutate(newTool, {
      onSuccess: (response) => {
        console.log("Tool created successfully:", response);
        setIsCreateModalOpen(false);
        resetForm();
      },
      onError: (error) => {
        console.error("Error creating tool:", error);
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
      inputJson: formData.inputJson.trim(),
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
      inputJson: (tool as any).inputJson || "",
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
    });
    setFormErrors({});
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
  };

  // Table columns definition
  const columns: ColumnDef<ExternalToolConfig>[] = [
    {
      accessorKey: "name",
      header: "Tên API",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 font-questrial">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "apiUrl",
      header: "API URL",
      cell: ({ row }) => (
        <div className="text-gray-600 font-questrial text-sm max-w-xs truncate">
          {row.getValue("apiUrl")}
        </div>
      ),
    },
    {
      accessorKey: "clientId",
      header: "Client ID",
      cell: ({ row }) => (
        <div className="text-gray-600 font-questrial text-sm">
          {row.getValue("clientId")}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => (
        <div className="text-gray-600 font-questrial text-sm max-w-xs truncate">
          {row.getValue("description") || "Không có mô tả"}
        </div>
      ),
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTool(tool)}
              className="p-2 hover:bg-red-50 hover:text-red-600"
              title="Xóa"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white">
      {/* Main Content */}
      <div className="w-full">
        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card đầu với background image */}
          <div
            className="rounded-lg border border-gray-200 p-6 relative overflow-hidden"
            style={{
              backgroundImage: "url('/images/background/abstract-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10">
              <h3 className="text-lg font-calsans text-white mb-2">
                Tổng doanh thu
              </h3>
              <p className="text-3xl font-calsans text-white">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>

          {/* Card thứ 2 - background trắng */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div>
              <h3 className="text-lg font-calsans text-gray-900 mb-2">
                Doanh thu tháng này
              </h3>
              <p className="text-3xl font-calsans text-gray-900">
                {formatCurrency(currentMonthRevenue)}
              </p>
            </div>
          </div>

          {/* Card thứ 3 - background trắng */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div>
              <h3 className="text-lg font-calsans text-gray-900 mb-2">
                Số API đang hoạt động
              </h3>
              <p className="text-3xl font-calsans text-gray-900">
                {tools.length}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Line Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-calsans text-gray-900 mb-4">
              Doanh thu theo tháng
            </h2>
            <div className="h-64">
              {totalRevenue === 0 || monthlyChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="font-questrial text-lg">
                      Chưa có dữ liệu doanh thu
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Doanh thu sẽ hiển thị khi có giao dịch
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyChartData}
                    margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis width={100} />
                    <Tooltip
                      formatter={(value: any) => [
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(value),
                        "Doanh thu",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Tool Revenue Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-calsans text-gray-900 mb-4">
              Doanh thu theo API
            </h2>
            <div className="h-64">
              {totalRevenue === 0 || toolRevenueData.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="font-questrial text-lg">
                      Chưa có dữ liệu doanh thu
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Doanh thu sẽ hiển thị khi có giao dịch
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={toolRevenueData}
                    margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis width={100} />
                    <Tooltip
                      formatter={(value: any) => [
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(value),
                        "Doanh thu",
                      ]}
                    />
                    <Bar dataKey="amount" fill="#330BA2" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* API Tools Table */}
        <div className="bg-white rounded-lg border-gray-200">
          <div className=" border-gray-200 flex justify-between">
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
      </div>

      {/* Create Tool Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo API mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="md:col-span-2">
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
              </div>
              <div className="md:col-span-2">
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
              </div>
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
                    rows={3}
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
                    rows={3}
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
        <DialogContent className="max-w-lg">
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
                {selectedTool.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mô tả
                    </label>
                    <p className="font-questrial text-gray-900">
                      {selectedTool.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-calsans">Chỉnh sửa API</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="md:col-span-2">
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
              </div>
              <div className="md:col-span-2">
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
              </div>
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
                    rows={3}
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
                    rows={3}
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
