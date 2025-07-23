"use client";

import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
import SubscriptionForm from "@/components/organisms/subscription-form";

function CreateSubscriptionModal() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]">
          <Plus /> Tạo gói mới
        </Button>
      </SheetTrigger>
      <SheetContent className="w-1/2 !max-w-none max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-bold text-xl">Tạo gói subscription mới</SheetTitle>
        </SheetHeader>
        <div className="px-5">
          <SubscriptionForm
            onClose={() => setOpen(false)}
            mode="create"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateSubscriptionModal;
