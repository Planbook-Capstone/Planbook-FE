"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SubscriptionForm from "@/components/organisms/subscription-form";
import { SubscriptionResponse } from "@/types";

interface EditSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: SubscriptionResponse | null;
}

function EditSubscriptionModal({
  open,
  onOpenChange,
  subscription,
}: EditSubscriptionModalProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-1/2 !max-w-none max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-bold text-xl">Chỉnh sửa gói subscription</SheetTitle>
        </SheetHeader>
        <div className="px-5">
          <SubscriptionForm
            onClose={() => onOpenChange(false)}
            subscription={subscription}
            mode="edit"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditSubscriptionModal;
