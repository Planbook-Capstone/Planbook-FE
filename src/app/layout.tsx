import type { Metadata } from "next";
import { Geist, Geist_Mono, Questrial, Manrope } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/store";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import Loading from "@/components/ui/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const questrial = Questrial({
  weight: "400",
  variable: "--font-questrial",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanBook - AI Giáo Án Thông Minh",
  description: "PlanBook - Nền tảng AI hỗ trợ giáo viên tạo giáo án, đề thi và quản lý giảng dạy hiệu quả",
  keywords: ["PlanBook", "AI", "Giáo án", "Giáo viên", "Giảng dạy", "Đề thi", "Slide"],
  authors: [{ name: "PlanBook Team" }],
  creator: "PlanBook",
  publisher: "PlanBook",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/images/logoPlanbook.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "PlanBook - AI Giáo Án Thông Minh",
    description: "Nền tảng AI hỗ trợ giáo viên tạo giáo án, đề thi và quản lý giảng dạy hiệu quả",
    url: "https://planbook.vn",
    siteName: "PlanBook",
    images: [
      {
        url: "/images/logoPlanbook.png",
        width: 1200,
        height: 630,
        alt: "PlanBook - AI Giáo Án Thông Minh",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanBook - AI Giáo Án Thông Minh",
    description: "Nền tảng AI hỗ trợ giáo viên tạo giáo án, đề thi và quản lý giảng dạy hiệu quả",
    images: ["/images/logoPlanbook.png"],
    creator: "@planbook",
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
        {/* Favicon - Next.js sẽ tự động handle từ metadata.icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />

        {/* Prevent zoom on mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        {/* Theme color */}
        <meta name="theme-color" content="#5E90F1" />
        <meta name="msapplication-TileColor" content="#5E90F1" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${questrial.variable} ${manrope.variable} antialiased`}
      >
        <ReactQueryProvider>
          <Suspense fallback={<Loading />}>
            <Toaster position="top-right" />
            <AppProvider>{children}</AppProvider>
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
