"use client";

import { CreateMaterialTagModal } from "@/components/organisms/create-material-tag-form";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

export default function MaterialPage() {
  const tabs = [
    {
      value: "grade",
      label: "Loại học liệu",
      content: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-calsans text-base">Danh sách loại học liệu</h1>
            <CreateMaterialTagModal />
          </div>
        </div>
      ),
    },
    {
      value: "subject",
      label: "Học liệu",
      content: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-calsans text-base">Danh sách học liệu</h1>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-5 w-full">
        <Tabs defaultValue="grade" className="w-full">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
