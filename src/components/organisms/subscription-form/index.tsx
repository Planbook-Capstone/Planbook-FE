"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { subscriptionSchema, SubscriptionFormData } from "@/schemas/subscription.schema";
import { useCreateSubscriptionService, useUpdateSubscriptionService } from "@/services/subscriptionServices";
import { SubscriptionResponse } from "@/types";

interface SubscriptionFormProps {
  onClose: () => void;
  subscription?: SubscriptionResponse | null;
  mode?: "create" | "edit";
}

function SubscriptionForm({ 
  onClose, 
  subscription, 
  mode = "create" 
}: SubscriptionFormProps) {
  const createMutation = useCreateSubscriptionService();
  const updateMutation = useUpdateSubscriptionService();

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      tokenAmount: 0,
      price: 0,
      description: "",
    },
    mode: "onChange",
  });

  // Reset form when subscription data changes (for edit mode)
  useEffect(() => {
    if (subscription && mode === "edit") {
      form.reset({
        name: subscription.name || "",
        tokenAmount: subscription.tokenAmount || 100,
        price: subscription.price || 0,
        description: subscription.description || "Basic access",
      });
    }
  }, [subscription, form, mode]);

  function onSubmit(data: SubscriptionFormData) {
    if (mode === "edit" && subscription) {
      // Update existing subscription
      updateMutation.mutate(
        {
          id: String(subscription.id),
          data: {
            name: data.name,
            tokenAmount: data.tokenAmount,
            price: data.price,
            description: data.description,
          },
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật gói thành công");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
          },
        }
      );
    } else {
      // Create new subscription
      createMutation.mutate(
        {
          name: data.name,
          tokenAmount: data.tokenAmount,
          price: data.price,
          description: data.description,
        },
        {
          onSuccess: () => {
            toast.success("Tạo gói thành công");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo gói");
          },
        }
      );
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên gói</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên gói (VD: Starter Pack)"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tokenAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng token</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số lượng token (VD: 100)"
                  {...field}
                  onChange={(e:any) => field.onChange(Number(e.target.value))}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá (VNĐ)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập giá (VD: 99000)"
                  {...field}
                  onChange={(e:any) => field.onChange(Number(e.target.value))}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả gói (VD: Basic access)"
                  className="resize-none"
                  rows={3}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (mode === "edit" ? "Đang cập nhật..." : "Đang tạo...") 
              : (mode === "edit" ? "Cập nhật" : "Tạo gói")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SubscriptionForm;
