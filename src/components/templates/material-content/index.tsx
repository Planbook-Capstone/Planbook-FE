import AudioPreview from "@/components/molecules/audio-preview";
import PreviewImage from "@/components/molecules/preview-image/page";
import { useMaterialSearchService } from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { TagResponse } from "@/types";
import { Tabs } from "antd";
import { useEffect, useState } from "react";

function MaterialContent() {
  const { data: tag } = useTagService();
  const [activeTabId, setActiveTabId] = useState<string>("");

  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTabId) {
      setActiveTabId(tag.data[0].id);
    }
  }, [tag?.data, activeTabId]);

  const { data: materials } = useMaterialSearchService(activeTabId);

  const handleTabChange = (key: string) => {
    setActiveTabId(key);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey={activeTabId}
        onChange={handleTabChange}
        items={
          tag?.data?.map((item: TagResponse, index: number) => ({
            label: item.name || `Tab-${index}`,
            key: String(item.id || index), // key chính là id nếu có
            children: `Nội dung của tag "${item.name}"`,
          })) || []
        }
      />

      <div className="mt-4 grid grid-cols-5 ">
        {/* Đang chọn tag ID: <strong>{activeTabId}</strong> */}
        {materials?.data?.content?.map((item: any, idx: any) => {
          const extension = item?.url?.split(".")?.pop();

          switch (extension) {
            case "mp3":
              return (
                <div key={idx}>
                  <AudioPreview item={item} />
                </div>
              );

            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
              return (
                <div key={idx}>
                  {/* <p className="mb-1 text-sm text-gray-600">Image preview:</p>
                  <img
                    src={item.url}
                    alt="Preview"
                    className="w-64 rounded border shadow"
                  /> */}
                  <PreviewImage item={item} />
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}

export default MaterialContent;
