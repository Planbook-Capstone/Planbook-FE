"use client"

import MainLayout from "@/components/layout/MainLayout";
import FolderCard from "@/components/molecules/folder-card";
import CreateFolderModal from "@/components/organisms/create-folder-modal";
import ItemSection from "@/components/organisms/item-section";
import FallingText from "@/components/ui/FallingText";


function MyLibrary() {
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
        className="w-full h-[210px] bg-cover bg-center bg-no-repeat text-black rounded-2xl border border-[#DFDFDF]"
      >
        <div className="absolute left-[40%] pt-10 text-center">
          <h1 className="text-3xl md:text-3xl sm:text-xl mb-3 font-calsans">
            Kho cá nhân
          </h1>
          <p className="text-lg md:text-lg sm:text-sm">
            Lưu tài liệu cá nhân theo cách của bạn
          </p>
        </div>

        <FallingText
          wordData={[
            { text: "Sáng tạo", bgColor: "#000", textColor: "#fff" },
            { text: "Tối giản", bgColor: "#5E90F1", textColor: "#fff" },
            { text: "Tinh tế", bgColor: "#25BEE5", textColor: "#fff" },
            { text: "Mộng mơ", bgColor: "#7147E4", textColor: "#fff" },
            { text: "Hiện đại", bgColor: "#5CCA6A", textColor: "#fff" },
            { text: "Nổi bật", bgColor: "#2AD6DD", textColor: "#fff" },
            { text: "Năng động", bgColor: "#D5B0F8", textColor: "#fff" },
            { text: "Phóng khoáng", bgColor: "#D950BE", textColor: "#fff" },
            { text: "Cổ điển", bgColor: "#0CB68B", textColor: "#fff" },
          ]}
          gravity={0.9}
          trigger="auto"
        />
      </div>
      <ItemSection title="Phân loại tài liệu" action={<CreateFolderModal />} />
      <div className="flex gap-5">
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
