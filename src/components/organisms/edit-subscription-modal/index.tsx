"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa gói subscription</DialogTitle>
        </DialogHeader>
        <SubscriptionForm 
          onClose={() => onOpenChange(false)} 
          subscription={subscription}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditSubscriptionModal;
