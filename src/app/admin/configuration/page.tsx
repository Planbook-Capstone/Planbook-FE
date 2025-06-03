"use client";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Globe, ImageIcon, Upload, X } from "lucide-react";
import React, { useState } from "react";

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

  return (
    <div className="mx-auto p-6 space-y-6 font-questrial">
      <div className="flex justify-between items-center">
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
      </div>
    </div>
  );
};

export default AdminConfigurationPage;
