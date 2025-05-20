import type { Metadata } from "next";
import { Geist, Geist_Mono, Questrial } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/store";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${questrial.variable} antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
