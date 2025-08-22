import { Skeleton } from "@/components/ui/skeleton";

interface GridSkeletonProps {
  count?: number; // số lượng skeleton
  height?: number; // chiều cao
  cols?: string; // tailwind class cho grid (vd: "grid-cols-2 lg:grid-cols-4")
}

export function GridSkeleton({
  count = 6,
  height = 120,
  cols = "grid-cols-2 lg:grid-cols-4",
}: GridSkeletonProps) {
  return (
    <div className={`grid ${cols} gap-5`}>
      {[...Array(count)].map((_, index) => (
        <Skeleton
          key={index}
          className={`w-full rounded-md bg-neutral-300`}
          style={{ height }}
        />
      ))}
    </div>
  );
}
