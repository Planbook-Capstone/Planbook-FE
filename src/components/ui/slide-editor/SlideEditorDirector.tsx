"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MenuItemButton } from "@/components/ui/MenuItemButton";

export interface MenuItem {
  key: string;
  label: string;
  image: string;
  active: string;
}

interface SidebarMenuProps {
  menuItems: MenuItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  defaultActiveKey?: string;
  isGenerating?: boolean;
}

export function SlideEditorDirector({
  menuItems,
  activeTab,
  onTabChange,
  defaultActiveKey,
  isGenerating = false,
}: SidebarMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey || menuItems[0]?.key
  );

  const currentKey = activeTab ?? internalActiveKey;

  const handleClick = (key: string) => {
    // Không cho phép thay đổi tab khi đang tạo slide
    if (isGenerating) {
      return;
    }

    if (!activeTab) {
      setInternalActiveKey(key);
    }
    onTabChange?.(key);
  };

  return (
    <aside className={`flex flex-col items-center w-[80px] bg-white py-2 border-r border-gray-200 relative ${isGenerating ? 'pointer-events-none' : ''}`}>
      {menuItems.map((item) => (
        <MenuItemButton
          key={item.key}
          label={item.label}
          image={item.image}
          active={item.active}
          isActive={item.key === currentKey}
          onClick={() => handleClick(item.key)}
          disabled={isGenerating}
        />
      ))}

      {/* Overlay khi đang tạo slide */}
      {isGenerating && (
        <div className="absolute inset-0 bg-white bg-opacity-50 z-10 flex items-center justify-center">
          <div className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">
            Đang tạo...
          </div>
        </div>
      )}
    </aside>
  );
}
