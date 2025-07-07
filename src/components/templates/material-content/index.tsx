import { useMaterialSearchService } from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { TagResponse } from "@/types";
import { Tabs } from "antd";
import { useEffect, useState } from "react";

function MaterialContent() {
  const { data: tag } = useTagService();
  const [activeTabId, setActiveTabId] = useState<string>("");

  // Set initial activeTabId when tags are loaded
  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTabId) {
      setActiveTabId(tag.data[0].id);
      console.log("Set initial tab ID:", tag.data[0].id);
    }
  }, [tag?.data, activeTabId]);

  // Only call service when activeTabId is available
  const { data: materials } = useMaterialSearchService(activeTabId);

  const handleTabChange = (key: string) => {
    setActiveTabId(key);
    console.log("Tab đang chọn có id:", key);
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

      {/* Ví dụ hiển thị ID tab đang chọn */}
      <div className="mt-4 text-gray-500">
        Đang chọn tag ID: <strong>{activeTabId}</strong>
        {materials?.data?.content?.length}
      </div>
    </div>
  );
}

export default MaterialContent;
