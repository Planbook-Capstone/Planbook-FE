import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  useCreateGradeService,
  useGradesService,
} from "@/services/gradeServices";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gradeFormSchema, type GradeFormData } from "@/schemas";

interface CreateGradeFormProps {
  onClose?: () => void;
}

function CreateGradeForm({ onClose }: CreateGradeFormProps) {
  const { mutateAsync: createGradeMutateAsync } = useCreateGradeService();
  const { refetch } = useGradesService();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      grades: [{ name: "" }],
    },
  });

  const {
    fields: gradeFields,
    append: appendGrade,
    remove: removeGrade,
  } = useFieldArray({
    control,
    name: "grades",
  });

  const onSubmit = async (data: GradeFormData) => {
    console.log("Received values of form:", data);

    try {
      for (const grade of data.grades) {
        await createGradeMutateAsync({
          name: grade.name.trim(),
        });
      }
      toast.success("Tạo khối thành công!");
      refetch();
      reset({ grades: [{ name: "" }] });
      onClose?.();
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data || "Tạo khối thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-4">
        {gradeFields.map((gradeField, gradeIndex) => (
          <div key={gradeField.id} className="flex items-start gap-2 w-full pb-2.5">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tên Khối
              </label>
              <Controller
                name={`grades.${gradeIndex}.name`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="bg-neutral-100 font-calsans placeholder:text-neutral-300 text-black"
                    placeholder="Khối 1"
                  />
                )}
              />
              {errors.grades?.[gradeIndex]?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.grades[gradeIndex]?.name?.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={() => {
                if (gradeFields.length <= 1) {
                  toast.error("Phải có ít nhất 1 khối");
                  return;
                }
                removeGrade(gradeIndex);
              }}
              disabled={gradeFields.length <= 1}
              className="h-full bg-neutral-800 border text-white hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              <X />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="dash"
          onClick={() => appendGrade({ name: "" })}
          className="bg-neutral-100 w-full"
        >
          <Plus />
          Thêm khối
        </Button>

        {errors.grades && (
          <p className="text-red-500 text-sm">
            {errors.grades.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full mt-5" disabled={isSubmitting}>
        {isSubmitting ? "Đang tạo..." : "Tạo khối"}
      </Button>
    </form>
  );
}

export default CreateGradeForm;
