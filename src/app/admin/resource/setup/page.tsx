"use client";

import CreateGardeForm from "@/components/organisms/create-grade-form";
import CreateSubjectForm from "@/components/organisms/create-subject-form";
import { Steps } from "antd";

import { useState } from "react";

function BookSetUpPage() {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Tạo Lớp",
      content: <CreateGardeForm onSuccess={next} />,
    },
    {
      title: "Tạo môn học",
      content: <CreateSubjectForm onSuccess={next} />,
    },
    {
      title: "Hoàn thành",
      content: "Quuay trở lại trang quản lý tài nguyên để xem kết quả",
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  return (
    <div className="space-y-5">
      <Steps current={current} items={items} />
      <div className="py-10">{steps[current].content}</div>
      <div className="flex justify-end">
        {/* {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Quay lại bước {steps[current-1].title}
          </Button>
        )} */}
        {/* {current != 0 && current < steps.length - 1 && (
          <Button onClick={() => next()}>Next</Button>
        )} */}

        {/* {current === steps.length - 1 && (
          <Button onClick={() => toast.success("Processing complete!")}>
            Done
          </Button>
        )} */}
      </div>
    </div>
  );
}

export default BookSetUpPage;
