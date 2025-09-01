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
    if (!activeTab) {
      setInternalActiveKey(key);
    }
    onTabChange?.(key);
  };

  return (
    <aside
      className={`flex flex-col items-center w-[80px] bg-white py-2 border-r border-gray-200 relative `}
    >
      {menuItems.map((item) => (
        <MenuItemButton
          key={item.key}
          label={item.label}
          image={item.image}
          active={item.active}
          isActive={item.key === currentKey}
          onClick={() => handleClick(item.key)}
        />
      ))}
    </aside>
  );
}
