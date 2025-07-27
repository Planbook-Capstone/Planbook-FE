"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/profile-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className=" min-h-screen w-full">
        {/* <SidebarTrigger /> */}
        <div className="border bg-white rounded-t-md mt-5 mx-3 p-6 shadow-lg min-h-screen">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
