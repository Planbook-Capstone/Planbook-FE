"use client";

import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import CreateGradeForm from "../create-grade-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import CreateSubjectForm from "../create-subject-form";

function CreateSubjectModal() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]">
          <Plus /> Tạo môn học mới
        </Button>
      </SheetTrigger>
      <SheetContent className="w-1/2 !max-w-none max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Tạo môn học mới</SheetTitle>
          <SheetDescription className="py-5">
            <CreateSubjectForm onClose={() => setOpen(false)} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default CreateSubjectModal;
