"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/profile-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="bg-[#F5F0FE] min-h-screen w-full">
        {/* <SidebarTrigger /> */}
        <div className="bg-white rounded-t-md mt-5 mx-5 p-6 shadow-lg">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
