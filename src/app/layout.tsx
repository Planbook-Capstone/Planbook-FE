import type { Metadata } from "next";
import { Geist, Geist_Mono, Questrial, Manrope } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/store";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

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
  title: "PlanBook - Plan Your Journey",
  description: "PlanBook helps you plan and organize your trips efficiently",
  icons: {
    icon: "/images/logoPlanbook.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logoPlanbook.png" type="image/png" />

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
          <Suspense fallback={<div>Loading...</div>}>
            <Toaster position="top-right" />
            <AppProvider>{children}</AppProvider>
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
