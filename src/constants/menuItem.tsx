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
  if (role === "tool-manager") {
    return toolManagerItems.find((item) => item.key === key)?.label;
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
    label: "Người dùng",
    key: "/users-management",
    icon: <HomeOutlined />,
    image: "/icons/user.svg",
    active: "/icons/user-active.svg",
  },
  {
    label: "Gói đăng ký",
    key: "subcription",
    icon: <HomeOutlined />,
    image: "/icons/diamond.svg",
    active: "/icons/diamond-active.svg",
  },
  {
    label: "Đơn hàng",
    key: "order",
    icon: <HomeOutlined />,
    image: "/icons/order.svg",
    active: "/icons/order-active.svg",
  },
  {
    label: "Chức năng",
    key: "booktype",
    icon: <HomeOutlined />,
    image: "/icons/cube.svg",
    active: "/icons/cube-active.svg",
  },
  // {
  //   label: "Giáo án",
  //   key: "lesson-plan-template",
  //   icon: <HomeOutlined />,
  //   image: "/icons/book.svg",
  //   active: "/icons/book-active.svg",
  // },
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
  {
    label: "Công cụ ngoài",
    key: "external-tools",
    icon: <SettingOutlined />,
    image: "/icons/tool.svg",
    active: "/icons/tool-active.svg",
  },
];

export const adminMenuItems: MenuItem[] = adminItems.map((item) =>
  getItem(item.label, item.key, item.icon)
);

// Staff menu items - focused on teaching materials and lesson planning
export const staffItems = [
  {
    label: "Học liệu",
    key: "material",
    icon: <HomeOutlined />,
    image: "/icons/folder.svg",
    active: "/icons/folder-active.svg",
  },
  {
    label: "Sách",
    key: "textbook",
    icon: <HomeOutlined />,
    image: "/icons/book.svg",
    active: "/icons/book-active.svg",
  },
  {
    label: "Kho đề",
    key: "question-bank",
    icon: <HomeOutlined />,
    image: "/icons/exam.svg",
    active: "/icons/exam-active.svg",
  },
  {
    label: "Giáo án",
    key: "lesson-plan",
    icon: <HomeOutlined />,
    image: "/icons/lesson-plan.svg",
    active: "/icons/lesson-plan-active.svg",
  },
  {
    label: "Mẫu Ma Trận",
    key: "matrix-templates",
    icon: <HomeOutlined />,
    image: "/icons/cube.svg",
    active: "/icons/cube-active.svg",
  },
  {
    label: "Mẫu Slide",
    key: "slide-templates",
    icon: <HomeOutlined />,
    image: "/icons/slide.svg",
    active: "/icons/slide-active.svg",
  },

  // {
  //   label: "Cấu hình",
  //   key: "configuration",
  //   icon: <SettingOutlined />,
  //   image: "/icons/gear.svg",
  //   active: "/icons/gear-active.svg",
  // },
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

// Tool Manager menu items - focused on API management and revenue tracking
export const toolManagerItems = [
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <HomeOutlined />,
    image: "/icons/home.svg",
    active: "/icons/home-active.svg",
  },
  {
    label: "API Tools",
    key: "tools",
    icon: <SettingOutlined />,
    image: "/icons/gear.svg",
    active: "/icons/gear-active.svg",
  },
];

function getToolManagerItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link href={`/tool-manager/${key}`}> {label} </Link>,
  } as MenuItem;
}

export const toolManagerMenuItems: MenuItem[] = toolManagerItems.map((item) =>
  getToolManagerItem(item.label, item.key, item.icon)
);

export const userItems = [
  { label: "Trợ lý", href: "/home" },
  { label: "Kho tài liệu", href: "/my-library" },
  { label: "Gói dịch vụ", href: "/pricing" },
];
