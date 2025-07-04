"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    type: "INPUT" | "CONTENT" | "REFERENCES" | "SUBSECTION";
  } | null;
  onConfirm: (config: any) => void;
}

export function ConfigModal({
  isOpen,
  onClose,
  item,
  onConfirm,
}: ConfigModalProps) {
  const [config, setConfig] = useState({
    title: "",
    content: "",
    placeholder: "",
    required: false,
  });

  const handleSubmit = () => {
    if (!config.title.trim()) return;

    onConfirm({
      ...config,
      type: item?.type,
    });

    // Reset form
    setConfig({
      title: "",
      content: "",
      placeholder: "",
      required: false,
    });

    onClose();
  };

  const getModalTitle = () => {
    switch (item?.type) {
      case "INPUT":
        return "Cấu hình Ô nhập";
      case "CONTENT":
        return "Cấu hình Nội dung";
      case "REFERENCES":
        return "Cấu hình Học liệu";
      case "SUBSECTION":
        return "Cấu hình Phần con";
      default:
        return "Cấu hình";
    }
  };

  const renderConfigFields = () => {
    switch (item?.type) {
      case "INPUT":
        return (
          <>
            <FormField label="Tiêu đề">
              <Input
                placeholder="Nhập tiêu đề cho trường này"
                value={config.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Mô tả">
              <Textarea
                placeholder="Mô tả chi tiết cho trường này"
                value={config.content}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={3}
              />
            </FormField>
          </>
        );

      case "CONTENT":
        return (
          <>
            <FormField label="Tiêu đề">
              <Input
                placeholder="Nhập tiêu đề cho nội dung"
                value={config.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Nội dung">
              <Textarea
                placeholder="Nhập nội dung hoặc hướng dẫn"
                value={config.content}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={4}
              />
            </FormField>
          </>
        );

      case "REFERENCES":
        return (
          <>
            <FormField label="Tiêu đề">
              <Input
                placeholder="Nhập tiêu đề cho học liệu"
                value={config.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Mô tả">
              <Textarea
                placeholder="Mô tả loại học liệu cần thiết"
                value={config.content}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={3}
              />
            </FormField>
          </>
        );

      case "SUBSECTION":
        return (
          <>
            <FormField label="Tiêu đề">
              <Input
                placeholder="Nhập tiêu đề cho phần con"
                value={config.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </FormField>

            <FormField label="Mô tả">
              <Textarea
                placeholder="Mô tả cho phần con này"
                value={config.content}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={3}
              />
            </FormField>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size="md">
      <div className="space-y-4">
        {renderConfigFields()}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!config.title.trim()}>
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
}
