"use client";

import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-600 text-black p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">PlanBook</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
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
