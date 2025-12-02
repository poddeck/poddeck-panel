import type {Table} from "@tanstack/react-table";

export default function DataTableBottomBar<T>({table}: { table: Table<T> }) {
  const selectedCount = table.getSelectedRowModel().rows.length;
  return (
    <div
      className={`
        fixed w-[min(1000px,95%)] bottom-0 -py-10
        bg-sidebar shadow-lg
        transition-transform duration-300
        ${selectedCount > 0 ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div
        className="w-[min(1000px,95%)] mx-auto"
      >
        <div className="py-10 flex items-center justify-between">
        <span className="text-sm font-medium">
          {selectedCount} AUSGEWÄHLT
        </span>

          <div className="flex gap-4">
            <button className="btn">Aktion 1</button>
            <button className="btn">Aktion 2</button>
          </div>
        </div>
      </div>
    </div>
  );
}
