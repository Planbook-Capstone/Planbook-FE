"use client";

import React from "react";
import MainHeader from "../organisms/header/MainHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <MainHeader />

      <main className="flex-grow container mx-auto p-3.5 space-y-5">
        {children}
      </main>

      <footer className="bg-gray-100 p-4">
        <div className="container mx-auto text-center text-gray-600">
          &copy; {new Date().getFullYear()} PlanBook. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
