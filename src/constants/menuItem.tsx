import { MenuProps } from "antd";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Key } from "react";

export type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link href={`/admin/${key}`}> {label} </Link>,
  } as MenuItem;
}
export const getLabel = (key?: Key, role?: string): string | undefined => {
  if (role === "staff") {
    return staffItems.find((item) => item.key === key)?.label;
  }
  return adminItems.find((item) => item.key === key)?.label;
};
export const adminItems = [
  {
    label: "Tổng quan",
    key: "/",
    icon: <HomeOutlined />,
    image: "/icons/home.svg",
    active: "/icons/home-active.svg",
  },
  {
    label: "Gói đăng ký",
    key: "subcription",
    icon: <HomeOutlined />,
    image: "/icons/diamond.svg",
    active: "/icons/diamond-active.svg",
  },
  {
    label: "Chức năng",
    key: "booktype",
    icon: <HomeOutlined />,
    image: "/icons/cube.svg",
    active: "/icons/cube-active.svg",
  },
  {
    label: "Giáo án",
    key: "lesson-plan",
    icon: <HomeOutlined />,
    image: "/icons/book.svg",
    active: "/icons/book-active.svg",
  },
  {
    label: "Năm học",
    key: "workspace",
    icon: <HomeOutlined />,
    image: "/icons/academic.svg",
    active: "/icons/academic-active.svg",
  },
  {
    label: "Quản lí sách",
    key: "resource",
    icon: <SettingOutlined />,
    image: "/icons/folder.svg",
    active: "/icons/folder-active.svg",
  },
  {
    label: "Cấu hình",
    key: "configuration",
    icon: <SettingOutlined />,
    image: "/icons/gear.svg",
    active: "/icons/gear-active.svg",
  },
];

export const adminMenuItems: MenuItem[] = adminItems.map((item) =>
  getItem(item.label, item.key, item.icon)
);

// Staff menu items - focused on teaching materials and lesson planning
export const staffItems = [
  {
    label: "Tổng quan",
    key: "/",
    icon: <HomeOutlined />,
    image: "/icons/home.svg",
    active: "/icons/home-active.svg",
  },
  {
    label: "Học liệu",
    key: "material",
    icon: <HomeOutlined />,
    image: "/icons/folder.svg",
    active: "/icons/folder-active.svg",
  },
  {
    label: "Giáo án",
    key: "lesson-plan",
    icon: <HomeOutlined />,
    image: "/icons/book.svg",
    active: "/icons/book-active.svg",
  },
];

function getStaffItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link href={`/staff/${key}`}> {label} </Link>,
  } as MenuItem;
}

export const staffMenuItems: MenuItem[] = staffItems.map((item) =>
  getStaffItem(item.label, item.key, item.icon)
);

export const userItems = [
  { label: "Trợ lý", href: "/home" },
  { label: "Kho tài liệu", href: "/my-library" },
  { label: "Tài liệu cộng đồng", href: "/community" },
];
