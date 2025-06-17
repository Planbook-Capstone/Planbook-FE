"use client";

import { useState, useEffect, useMemo, useRef, memo } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import FolderCard from "@/components/molecules/folder-card";
import CreateFolderModal from "@/components/organisms/create-folder-modal";
import ItemSection from "@/components/organisms/item-section";
import FallingText from "@/components/ui/FallingText";

// Isolated FallingText component to prevent URL-based re-renders
const FallingTextContainer = memo(() => {
  const [wordData, setWordData] = useState<
    Array<{ text: string; bgColor: string; textColor: string }>
  >([]);
  const [fallingKey, setFallingKey] = useState(0);

  const fullWordData = [
    { text: "Sáng tạo", bgColor: "#000", textColor: "#fff" },
    { text: "Tối giản", bgColor: "#5E90F1", textColor: "#fff" },
    { text: "Tinh tế", bgColor: "#25BEE5", textColor: "#fff" },
    { text: "Mộng mơ", bgColor: "#7147E4", textColor: "#fff" },
    { text: "Hiện đại", bgColor: "#5CCA6A", textColor: "#fff" },
    { text: "Nổi bật", bgColor: "#2AD6DD", textColor: "#fff" },
    { text: "Năng động", bgColor: "#D5B0F8", textColor: "#fff" },
    { text: "Phóng khoáng", bgColor: "#D950BE", textColor: "#fff" },
    { text: "Cổ điển", bgColor: "#0CB68B", textColor: "#fff" },
  ];

  const getRandomHalf = useMemo(() => {
    return (arr: typeof fullWordData) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.ceil(arr.length / 2));
    };
  }, []);

  // Initialize wordData on first load
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const initialWordData = mobile ? getRandomHalf(fullWordData) : fullWordData;
    setWordData(initialWordData);
  }, []);

  // Handle resize events only
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const checkMobile = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        const newWordData = mobile ? getRandomHalf(fullWordData) : fullWordData;

        setWordData((prevData) => {
          const dataChanged =
            JSON.stringify(prevData) !== JSON.stringify(newWordData);
          if (dataChanged) {
            setFallingKey((prev) => prev + 1);
            return newWordData;
          }
          return prevData;
        });
      }, 150);
    };

    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div
      key={`falling-${fallingKey}`}
      className="absolute inset-0 transition-opacity duration-300 ease-in-out"
      style={{
        opacity: wordData.length > 0 ? 1 : 0,
      }}
    >
      {wordData.length > 0 && (
        <FallingText
          key={`text-${fallingKey}`}
          wordData={wordData}
          gravity={0.9}
          trigger="auto"
        />
      )}
    </div>
  );
});

FallingTextContainer.displayName = "FallingTextContainer";

function MyLibrary() {
  const searchParams = useSearchParams();
  const currentView = useRef(searchParams.get("view") || "grid");

  // Handle URL view changes (separate from FallingText logic)
  useEffect(() => {
    const newView = searchParams.get("view") || "grid";

    if (currentView.current !== newView) {
      console.log(`View changed from ${currentView.current} to ${newView}`);
      currentView.current = newView;
      // FallingText is now isolated and won't be affected by URL changes
    }
  }, [searchParams]);

  const myFolder = [
    {
      name: "Tài liệu tham khảo",
      colorId: "1",
      folderId: 1,
    },
    {
      name: "Đề thi",
      colorId: "2",
      folderId: 2,
    },
    {
      name: "Bài tập",
      colorId: "3",
      folderId: 3,
    },
    {
      name: "Mẫu tài liệu",
      colorId: "4",
      folderId: 4,
    },
    {
      name: "Mẫu tài liệu",
      colorId: "5",
      folderId: 5,
    },
  ];
  return (
    <MainLayout>
      <div
        style={{
          backgroundImage: `url(${"/images/background/bgHome.svg"})`,
        }}
        className="w-full h-[210px] bg-cover bg-center bg-no-repeat text-black rounded-2xl border border-[#DFDFDF] relative overflow-hidden"
      >
        <div className="absolute lg:left-[40%] pt-10 text-center">
          <h1 className="text-3xl md:text-3xl sm:text-xl mb-3 font-calsans">
            Kho cá nhân
          </h1>
          <p className="text-lg pl-1 md:text-lg sm:text-sm">
            Lưu tài liệu cá nhân theo cách của bạn
          </p>
        </div>

        <FallingTextContainer />
      </div>
      <ItemSection title="Phân loại tài liệu" action={<CreateFolderModal />} />
      <div className="grid grid-cols-2 lg:grid-cols-8">
        {myFolder?.map((f) => (
          <FolderCard
            key={f.folderId}
            id={f.folderId.toString()}
            colorId={f.colorId}
            title={f.name}
          />
        ))}
      </div>
    </MainLayout>
  );
}

export default MyLibrary;
