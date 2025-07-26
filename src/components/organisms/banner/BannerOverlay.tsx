"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BannerOverlayProps {
  userName?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const BannerOverlay = ({
  userName = "Nguyễn Văn A",
  onSearch,
  className = "",
}: BannerOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none ${className}`}
    >
      {/* Greeting */}
      <div className="text-center mb-4 pointer-events-none">
        <h1 className="text-lg md:text-xl lg:text-2xl font-calsans text-white mb-2 drop-shadow-lg">
          Chào mừng {userName}
        </h1>
        <p className="text-base md:text-lg text-white/90 font-questrial drop-shadow-md">
          Trợ lý dạy học thế hệ mới
        </p>
      </div>

      {/* Search Box */}
      <div className="w-full max-w-2xl px-4 pointer-events-auto">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 z-50" />
            <Input
              type="text"
              placeholder="Tìm kiếm chức năng, tài liệu, đề thi..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-14 pl-14 pr-6 text-white placeholder:text-white/70 bg-black/50 backdrop-blur-md border-white/20 rounded-full text-lg font-questrial focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
            />
          </div>
        </form>
      </div>

      {/* Optional: Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center pointer-events-auto">
        <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-questrial hover:bg-white/20 transition-all duration-200 border border-white/20">
          Tạo bài giảng
        </button>
        <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-questrial hover:bg-white/20 transition-all duration-200 border border-white/20">
          Tạo đề thi
        </button>
        <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-questrial hover:bg-white/20 transition-all duration-200 border border-white/20">
          Tạo slide
        </button>
      </div>
    </div>
  );
};

export default BannerOverlay;
