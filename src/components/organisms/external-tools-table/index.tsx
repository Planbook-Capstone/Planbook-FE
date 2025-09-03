"use client";

import React, { useState } from "react";
import { Table, Space, Modal, message, Tooltip, Select } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { UserWithWalletResponse } from "@/types";
import { useUsersByIdsService } from "@/services/userService";
import { useUpdateExternalToolStatusService } from "@/services/externalToolsServices";

interface ExternalTool {
  id: string;
  name: string;
  apiUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  icon?: string;
  code: string;
  href?: string;
  tokenCostPerQuery: number;
  toolType: string;
  inputJson?: Record<string, any>;
  description?: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "ACTIVE"
    | "INACTIVE"
    | "REJECTED"
    | "CANCELLED"
    | "DELETED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ExternalToolsTableProps {
  tools: ExternalTool[];
  loading?: boolean;
  groupByOwner?: boolean;
  onViewDetails?: (tool: ExternalTool) => void;
  onStatusChange?: (toolId: string, newStatus: string) => void;
}

const ExternalToolsTable: React.FC<ExternalToolsTableProps> = ({
  tools,
  loading = false,
  groupByOwner = false,
  onViewDetails,
  onStatusChange,
}) => {
  const [selectedTool, setSelectedTool] = useState<ExternalTool | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [toolToUpdateStatus, setToolToUpdateStatus] =
    useState<ExternalTool | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState<string>("");

  // Available status options with Badge variants
  const statusOptions = [
    { value: "PENDING", label: "Chờ duyệt", variant: "warning" as const },
    { value: "APPROVED", label: "Đã duyệt", variant: "info" as const },
    { value: "ACTIVE", label: "Hoạt động", variant: "success" as const },
    {
      value: "INACTIVE",
      label: "Không hoạt động",
      variant: "destructive" as const,
    },
    { value: "REJECTED", label: "Bị từ chối", variant: "destructive" as const },
    { value: "CANCELLED", label: "Đã hủy", variant: "secondary" as const },
    { value: "DELETED", label: "Đã xóa", variant: "secondary" as const },
  ];

  // Get unique owner IDs
  const ownerIds = [...new Set(tools.map((tool) => tool.createdBy))];

  // Fetch user data for owners using multi-query hook
  const userQueries = useUsersByIdsService(ownerIds);

  const { mutate: updateToolStatus, isPending: isUpdatingStatus } =
    useUpdateExternalToolStatusService();

  // Create user lookup map from multi-query results
  const userMap = React.useMemo(() => {
    const map: Record<string, UserWithWalletResponse> = {};
    userQueries.forEach((query, index) => {
      if (query.data?.data) {
        const userId = ownerIds[index];
        map[userId] = query.data.data;
      }
    });
    return map;
  }, [userQueries, ownerIds]);

  // Check if any user queries are loading
  const isLoadingUsers = userQueries.some((query) => query.isLoading);

  const getStatusVariant = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.variant || "secondary";
  };

  const getStatusText = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.label || status;
  };

  const handleStatusChange = (tool: ExternalTool) => {
    setToolToUpdateStatus(tool);
    setSelectedNewStatus(tool.status); // Set current status as default
    setStatusModalVisible(true);
  };

  const confirmStatusChange = () => {
    if (!toolToUpdateStatus || !selectedNewStatus) return;

    updateToolStatus(
      { id: toolToUpdateStatus.id, status: selectedNewStatus },
      {
        onSuccess: () => {
          message.success("Cập nhật trạng thái thành công");
          onStatusChange?.(toolToUpdateStatus.id, selectedNewStatus);
          setStatusModalVisible(false);
          setToolToUpdateStatus(null);
          setSelectedNewStatus("");
        },
        onError: () => {
          message.error("Cập nhật trạng thái thất bại");
        },
      }
    );
  };

  const handleViewDetails = (tool: ExternalTool) => {
    setSelectedTool(tool);
    setDetailsModalVisible(true);
    onViewDetails?.(tool);
  };

  const renderUserInfo = (createdBy: string) => {
    const user = userMap[createdBy];
    if (!user) {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              {createdBy.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-calsans">
              User {createdBy.slice(0, 8)}
            </div>
            <div className="text-xs text-gray-500 font-questrial">
              {isLoadingUsers ? "Đang tải..." : "Không tìm thấy"}
            </div>
          </div>
        </div>
      );
    }

    const displayName = user.fullName || user.username || "Không có tên";
    const initials = displayName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div
            className="text-sm font-calsans font-normal truncate"
            title={displayName}
          >
            {displayName}
          </div>
          <div
            className="text-xs text-gray-500 font-questrial truncate"
            title={user.email}
          >
            {user.email}
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: <span className="font-calsans font-normal">Tên công cụ</span>,
      dataIndex: "name",
      key: "name",
      width: 250,
      ellipsis: true,
      render: (text: string, record: ExternalTool) => (
        <div className="min-w-0">
          <div className="font-calsans text-gray-900 truncate" title={text}>
            {text}
          </div>
          {record.description && (
            <div
              className="text-sm text-gray-500 mt-1 font-questrial truncate"
              title={record.description}
            >
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    ...(groupByOwner
      ? []
      : [
          {
            title: <span className="font-calsans font-normal">Người tạo</span>,
            dataIndex: "createdBy",
            key: "createdBy",
            width: 200,
            ellipsis: true,
            render: (createdBy: string) => renderUserInfo(createdBy),
          },
        ]),
    {
      title: <span className="font-calsans font-normal">Trạng thái</span>,
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Badge variant={getStatusVariant(status)} className="font-questrial">
          {getStatusText(status)}
        </Badge>
      ),
    },
    {
      title: <span className="font-calsans font-normal">Ngày tạo</span>,
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => (
        <span className="font-questrial text-gray-600">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: <span className="font-calsans font-normal">Thao tác</span>,
      key: "actions",
      width: 100,
      fixed: "right" as const,
      render: (_: any, record: ExternalTool) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails(record)}
              className="p-2 hover:bg-blue-50 hover:text-blue-600"
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
          <Tooltip
            title={record.status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(record)}
              className="p-2 hover:bg-green-50 hover:text-green-600"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Group tools by owner if needed
  const processedData = React.useMemo(() => {
    if (!groupByOwner) {
      return tools;
    }

    // For grouped view, sort by createdBy to group similar users together
    const sortedTools = [...tools].sort((a, b) =>
      a.createdBy.localeCompare(b.createdBy)
    );
    return sortedTools;
  }, [tools, groupByOwner, userMap]);

  return (
    <>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={processedData}
          loading={loading}
          rowKey="id"
          className="font-questrial"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} công cụ`,
            responsive: true,
          }}
          rowClassName={(record, index) => {
            if (groupByOwner && index > 0) {
              const prevRecord = processedData[index - 1];
              if (prevRecord && record.createdBy !== prevRecord.createdBy) {
                return "border-t-2 border-gray-300";
              }
            }
            return "";
          }}
        />
      </div>

      {/* Details Modal */}
      <Modal
        title={
          <span className="font-calsans font-normal">Chi tiết công cụ</span>
        }
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 600 }}
      >
        {selectedTool && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Tên công cụ
              </label>
              <div className="text-sm font-questrial">{selectedTool.name}</div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Mô tả
              </label>
              <div className="text-sm font-questrial">
                {selectedTool.description || "Không có mô tả"}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Người tạo
              </label>
              {renderUserInfo(selectedTool.createdBy)}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                API URL
              </label>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                {selectedTool.apiUrl}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Token URL
              </label>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                {selectedTool.tokenUrl}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Client ID
              </label>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                {selectedTool.clientId}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Trạng thái
              </label>
              <Badge
                variant={getStatusVariant(selectedTool.status)}
                className="font-questrial"
              >
                {getStatusText(selectedTool.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-calsans">
                  Ngày tạo
                </label>
                <div className="text-sm font-questrial">
                  {new Date(selectedTool.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-calsans">
                  Cập nhật lần cuối
                </label>
                <div className="text-sm font-questrial">
                  {new Date(selectedTool.updatedAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Change Modal */}
      <Modal
        title="Thay đổi trạng thái công cụ"
        open={statusModalVisible}
        onCancel={() => {
          setStatusModalVisible(false);
          setToolToUpdateStatus(null);
          setSelectedNewStatus("");
        }}
        onOk={confirmStatusChange}
        confirmLoading={isUpdatingStatus}
        width="90%"
        style={{ maxWidth: 500 }}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          disabled:
            !selectedNewStatus ||
            selectedNewStatus === toolToUpdateStatus?.status,
        }}
      >
        {toolToUpdateStatus && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Tên công cụ
              </label>
              <div className="text-sm font-questrial">
                {toolToUpdateStatus.name}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Trạng thái hiện tại
              </label>
              <Badge
                variant={getStatusVariant(toolToUpdateStatus.status)}
                className="font-questrial"
              >
                {getStatusText(toolToUpdateStatus.status)}
              </Badge>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-calsans">
                Chọn trạng thái mới <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedNewStatus}
                onChange={setSelectedNewStatus}
                placeholder="Chọn trạng thái mới"
                className="w-full"
                size="large"
              >
                {statusOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={option.variant}
                        className="m-0 font-questrial"
                      >
                        {option.label}
                      </Badge>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </div>

            {selectedNewStatus &&
              selectedNewStatus !== toolToUpdateStatus.status && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Thay đổi:</strong>{" "}
                    {getStatusText(toolToUpdateStatus.status)} →{" "}
                    {getStatusText(selectedNewStatus)}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {selectedNewStatus === "ACTIVE" &&
                      "Công cụ sẽ được kích hoạt và có thể sử dụng."}
                    {selectedNewStatus === "INACTIVE" &&
                      "Công cụ sẽ bị vô hiệu hóa và không thể sử dụng."}
                    {selectedNewStatus === "PENDING" &&
                      "Công cụ sẽ chuyển về trạng thái chờ duyệt."}
                    {selectedNewStatus === "APPROVED" &&
                      "Công cụ sẽ được đánh dấu là đã duyệt."}
                    {selectedNewStatus === "REJECTED" &&
                      "Công cụ sẽ bị từ chối và không thể sử dụng."}
                    {selectedNewStatus === "CANCELLED" &&
                      "Công cụ sẽ bị hủy bỏ."}
                    {selectedNewStatus === "DELETED" &&
                      "Công cụ sẽ được đánh dấu là đã xóa."}
                  </p>
                </div>
              )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ExternalToolsTable;
