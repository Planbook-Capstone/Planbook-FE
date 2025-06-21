"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateFrameworkForm from "../create-framework-form";

function CreateFrameworkModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]">
          <Plus /> Tạo Framework mới
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[500px] max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo Framework mới</DialogTitle>
          <DialogDescription>
            Thêm framework mới vào hệ thống với tên và file đính kèm
          </DialogDescription>
        </DialogHeader>
        <CreateFrameworkForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateFrameworkModal;
