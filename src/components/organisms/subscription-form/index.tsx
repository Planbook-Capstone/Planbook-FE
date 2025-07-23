"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/Switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Plus, X } from "lucide-react";
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
      highlight: false,
      features: ["Tính năng mới"],
    },
    mode: "onSubmit", // Changed from onChange to onSubmit to avoid immediate validation
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  // Reset form when subscription data changes (for edit mode)
  useEffect(() => {
    if (subscription && mode === "edit") {
      form.reset({
        name: subscription.name || "",
        tokenAmount: subscription.tokenAmount || 100,
        price: subscription.price || 0,
        description: subscription.description || "Basic access",
        highlight: subscription.highlight || false,
        features: subscription.features?.length > 0 ? subscription.features : ["Tính năng mới"],
      });
    } else if (mode === "create") {
      // Ensure create mode has proper default values
      form.reset({
        name: "",
        tokenAmount: 0,
        price: 0,
        description: "",
        highlight: false,
        features: ["Tính năng mới"],
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
            highlight: data.highlight,
            features: data.features.filter(feature => feature.trim() !== ""),
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
          highlight: data.highlight,
          features: data.features.filter(feature => feature.trim() !== ""),
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

        <FormField
          control={form.control}
          name="highlight"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Gói nổi bật</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Đánh dấu gói này là gói nổi bật
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Tính năng</FormLabel>
          {fields.map((fieldItem, index) => (
            <FormField
              key={fieldItem.id}
              control={form.control}
              name={`features.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder={`Tính năng ${index + 1}`}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("Tính năng mới")}
            disabled={isLoading || fields.length >= 10}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm tính năng ({fields.length}/10)
          </Button>
        </div>

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
