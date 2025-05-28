import TestInfoPanel from "@/components/organisms/test-info-panel";
import TestSidebar from "@/components/organisms/test-sidebar";
import TestEditor from "@/components/organisms/test-editor";

export default function TestLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <TestInfoPanel />
      <TestEditor />
      <TestSidebar />
    </div>
  );
}
