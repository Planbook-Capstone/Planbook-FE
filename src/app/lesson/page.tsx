"use client";

import MainLayout from "@/components/layout/MainLayout";
import CurriculumList from "@/components/organisms/curriculum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function LessonPlan() {
  const handleChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <MainLayout>
      <div className="flex justify-between items-center gap-5">
        <div className="flex-col w-full">
          <p className="text-sm font-bold">Khối học</p>
          <Select onValueChange={handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Lớp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">10</SelectItem>
              <SelectItem value="2">11</SelectItem>
              <SelectItem value="3">12</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-col w-full">
          <p className="text-sm font-bold">Môn học</p>
          <Select onValueChange={handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Môn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Toán</SelectItem>
              <SelectItem value="2">Hóa</SelectItem>
              <SelectItem value="3">Lý</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-col w-full">
          <p className="text-sm font-bold">Chương trình học</p>
          <Select onValueChange={handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sách" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Sách cánh diều</SelectItem>
              <SelectItem value="dark">chân trời</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="py-5">
        <CurriculumList />
      </div>
    </MainLayout>
  );
}

export default LessonPlan;
