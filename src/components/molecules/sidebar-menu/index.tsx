"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MenuItemButton } from "@/components/ui/MenuItemButton";

export interface MenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  image: string;
  active: string;
}

interface SidebarMenuProps {
  menuItems: MenuItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  defaultActiveKey?: string;
  basePath?: string; // Add basePath prop to handle different routes
}

export function SidebarMenu({
  menuItems,
  activeTab,
  onTabChange,
  defaultActiveKey,
  basePath = "/admin", // Default to admin path
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
    // Dynamic routing based on basePath
    router.push(`${basePath}/${key}`);
  };

  return (
    <aside className="flex flex-col items-center w-[100px]">
      {menuItems.map((item) => (
        <MenuItemButton
          key={item.key}
          icon={item.icon}
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
