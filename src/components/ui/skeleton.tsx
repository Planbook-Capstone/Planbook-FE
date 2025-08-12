import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-gradient-to-r from-transparent via-violet-300 to-transparent",
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

// Skeleton for text input fields
function SkeletonInput({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2 mt-2", className)}>
      {Array.from({ length: lines }).map((_, index) => {
        // Random width for all lines - completely random
        const allWidthOptions = [
          "w-full",
          "w-3/4",
          "w-5/6",
          "w-4/6",
          "w-1/2",
          "w-2/3",
        ];
        const allPixelWidths = [
          "400px",
          "300px",
          "333px",
          "267px",
          "200px",
          "267px",
        ];
        const randomIndex = Math.floor(Math.random() * allWidthOptions.length);

        // Different gradient for odd/even positions
        const isOdd = index % 2 === 1;
        const colorGradient = isOdd
          ? "linear-gradient(to right, transparent, #ddd6fe, #bfdbfe, #ecfeff, transparent)" // Violet-blue-cyan for odd
          : "linear-gradient(to right, transparent, #f3f4f6, #e5e7eb, #d1d5db, transparent)"; // Gray for even

        return (
          <Skeleton
            key={index}
            className={cn("min-h-[30px]", allWidthOptions[randomIndex])}
            style={{
              height: "30px",
              width: allPixelWidths[randomIndex],
              background: colorGradient,
            }}
          />
        );
      })}
    </div>
  );
}

// Skeleton for table
function SkeletonTable({
  rows = 3,
  cols = 3,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Table header */}
      <div className="flex gap-2">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton
            key={`header-${colIndex}`}
            className="min-h-[28px] w-full bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200"
            style={{ height: "28px", width: "150px" }}
          />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-2">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="min-h-[22px] w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
              style={{ height: "22px", width: "120px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton for image
function SkeletonImage({ className }: { className?: string }) {
  return (
    <div className={cn("", className)}>
      <Skeleton
        className="min-h-[200px] w-full bg-gradient-to-br from-purple-100 via-purple-200 to-purple-100 flex items-center justify-center"
        style={{ height: "200px", width: "400px" }}
      />
      <div className="mt-3">
        <Skeleton
          className="min-h-[18px] w-3/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          style={{ height: "18px", width: "240px" }}
        />
      </div>
    </div>
  );
}

// Skeleton for question bank
function SkeletonQuestionBank({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Question title */}
      <Skeleton
        className="min-h-[24px] w-4/5 bg-gray-300"
        style={{ height: "24px", width: "320px" }}
      />
      {/* Question content */}
      <div className="space-y-2">
        <Skeleton
          className="min-h-[16px] w-full"
          style={{ height: "16px", width: "400px" }}
        />
        <Skeleton
          className="min-h-[16px] w-11/12"
          style={{ height: "16px", width: "360px" }}
        />
        <Skeleton
          className="min-h-[16px] w-5/6"
          style={{ height: "16px", width: "330px" }}
        />
      </div>
      {/* Answer options */}
      <div className="space-y-2 pl-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton
              className="min-h-[16px] w-4"
              style={{ height: "16px", width: "16px" }}
            />
            <Skeleton
              className="min-h-[16px] w-3/5"
              style={{ height: "16px", width: "240px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonInput,
  SkeletonTable,
  SkeletonImage,
  SkeletonQuestionBank,
};
