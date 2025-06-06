"use client";
import CreateBookModal from "@/components/organisms/create-book-modal";

import { ViewToggle } from "@/components/molecules/view-toggle";

const ResourceManagementPage = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <ViewToggle />
        <CreateBookModal />
      </div>
    
    </div>
  );
};

export default ResourceManagementPage;
