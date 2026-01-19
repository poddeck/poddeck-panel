import type {
  Table,
} from "@tanstack/react-table";
import {useSidebar} from "@/components/ui/sidebar.tsx";
import {useTranslation} from "react-i18next";
import type {LucideIcon} from "lucide-react";

export interface DataTableBottomBarAction<T> {
  name: string;
  icon: LucideIcon;
  onClick?: (entries: T[]) => void
}

export default function DataTableBottomBar<T>(
  {
    table,
    actions,
  }: {
    table: Table<T>
    actions: DataTableBottomBarAction<T>[]
  }
) {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const {t} = useTranslation();
  const {open} = useSidebar()
  return (
    <div
      className={`
        fixed z-30 inset-x-0 bottom-0
        bg-sidebar shadow-lg
        transition-transform duration-300
        ${selectedCount > 0 ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div
        style={{
          paddingLeft: open ? "var(--sidebar-width)" : "var(--sidebar-width-icon)",
          transition: "padding-left 300ms ease"
        }}
      >
        <div className="w-[min(1500px,95%)] mx-auto">
          <div className="py-5 flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedCount} {t("table.bottom.bar.selected")}
            </span>
            <div className="flex gap-6">
              {actions.map(({ name, icon: Icon, onClick }, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onClick?.(selectedRows.map(entry => entry.original));
                    table.resetRowSelection(true);
                  }}
                  className="
                    flex flex-col items-center justify-center
                    px-10 py-5
                    rounded-lg text-accent-foreground
                    hover:bg-accent/80 transition-colors
                  "
                >
                  <Icon className="size-6 mb-3" />
                  <span className="font-medium">{t(name)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
