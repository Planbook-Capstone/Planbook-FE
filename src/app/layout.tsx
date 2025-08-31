import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Questrial,
  Manrope,
  Cal_Sans,
} from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/store";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import Loading from "@/components/ui/loading";
import { StructuredData } from "@/components/seo/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const questrial = Questrial({
  weight: "400",
  variable: "--font-questrial",
  subsets: ["latin"],
});

const calSans = Cal_Sans({
  weight: "400",
  variable: "--font-calsans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PlanBook - Hệ thống quản lý giáo án thông minh",
    template: "%s | PlanBook",
  },
  description:
    "PlanBook là hệ thống quản lý giáo án thông minh, hỗ trợ giáo viên tạo, quản lý và chia sẻ giáo án hiệu quả. Tích hợp chấm điểm tự động và thi trực tuyến.",
  keywords: [
    "giáo án",
    "quản lý giáo án",
    "hệ thống giáo dục",
    "chấm điểm tự động",
    "thi trực tuyến",
    "planbook",
    "giáo viên",
    "học sinh",
    "giáo dục thông minh",
    "THPT",
    "thpt",
    "AI",
  ],
  authors: [{ name: "PlanBook Team" }],
  creator: "PlanBook",
  publisher: "PlanBook",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://planbook.vn"),
  alternates: {
    canonical: "https://planbook.vn/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://planbook.vn",
    title: "PlanBook - Hệ thống quản lý giáo án thông minh",
    description:
      "PlanBook là hệ thống quản lý giáo án thông minh, hỗ trợ giáo viên tạo, quản lý và chia sẻ giáo án hiệu quả. Tích hợp chấm điểm tự động và thi trực tuyến.",
    siteName: "Planbook - AI Portal cho giáo viên cấp 3",
    images: [
      {
        url: "/images/logoPlanbook.png",
        width: 1200,
        height: 630,
        alt: "PlanBook - Hệ thống quản lý giáo án thông minh",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logoPlanbook.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PlanBook" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${questrial.variable}  ${calSans.variable} antialiased`}
      >
        <ReactQueryProvider>
          <Suspense fallback={<Loading />}>
            <StructuredData />
            <Toaster position="top-right" richColors />
            <AppProvider>{children}</AppProvider>
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
