export const PricingDescription = () => {
  const plans = [
    {
      name: "Gói Cơ bản",
      description:
        "Phù hợp cho giáo viên đang bắt đầu chuyển sang số hoá với các tính năng cơ bản và hỗ trợ tiêu chuẩn.",
      highlight: true,
    },
    {
      name: "Gói Nâng cao",
      description:
        "Tích hợp thêm các tính năng chuyên sâu và hỗ trợ riêng cho giáo viên có nhiều lớp hoặc khối chuyên biệt.",
    },
    {
      name: "Gói Tổ chức",
      description:
        "Tuỳ chỉnh linh hoạt theo nhu cầu của tổ bộ môn, tổ chức giáo dục hoặc trường học.",
    },
  ];

  return (
    <div className="space-y-12 max-w-full lg:max-w-sm w-full">
      {plans.map((plan, i) => (
        <div
          key={i}
          className={
            plan.highlight
              ? "bg-[#00B15F] text-white rounded-2xl p-6 shadow-lg"
              : "p-6"
          }
        >
          <h3 className="text-2xl mb-2 font-calsans">{plan.name}</h3>
          <p className="text-base">{plan.description}</p>
        </div>
      ))}
    </div>
  );
};
