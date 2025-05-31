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
export const getLabel = (
  key?: Key
  // role?: string
): string | undefined => {
  return adminItems.find((item) => item.key === key)?.label;
};
const adminItems = [
  { label: "Tổng quan", key: "/", icon: <HomeOutlined /> },
  { label: "Tổng quan", key: "config", icon: <HomeOutlined /> },
  { label: "Tổng quan", key: "h", icon: <HomeOutlined /> },
  {
    label: "Cài đặt",
    key: "setting",
    icon: <SettingOutlined />,
  },
];

export const adminMenuItems: MenuItem[] = adminItems.map((item) =>
  getItem(item.label, item.key, item.icon)
);

export const userItems = [
  { label: "Trợ lý", href: "/" },
  { label: "Kho tài liệu", href: "/my-library" },
  { label: "Tài liệu cộng đồng", href: "/community" },

];
