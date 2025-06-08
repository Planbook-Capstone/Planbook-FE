import { GroupSection } from "../group-section";

export function FormBuilderCanvas({ groups, onChange }: any) {
  return (
    <div className="space-y-6">
      {groups.map((group: any, idx: number) => (
        <GroupSection
          key={idx}
          group={group}
          onUpdate={(newGroup: any) => {
            const updated = [...groups];
            updated[idx] = newGroup;
            onChange(updated);
          }}
          onDelete={() => {
            const updated = [...groups];
            updated.splice(idx, 1);
            onChange(updated);
          }}
        />
      ))}
    </div>
  );
}
