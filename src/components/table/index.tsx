"use client";

import { useEffect, useState } from "react";
import {
  type ColumnDef,
  type ColumnSort,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";
import DataTableColumnSelection from "./column-selection.tsx";
import DataTableHeader from "./header.tsx";
import DataTableBody from "./body.tsx";
import DataTablePagination from "./pagination.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useTranslation } from "react-i18next";
import { RotateCw, Search, TriangleAlert } from "lucide-react";
import {
  type DataTableFilterOption,
  DataTableFilters,
} from "@/components/table/filter.tsx";
import DataTableBottomBar, {
  type DataTableBottomBarAction,
} from "@/components/table/bottom-bar.tsx";

interface DataTableProps<T> {
  name: string;
  columns: ColumnDef<T, unknown>[];
  initialSorting?: ColumnSort[];
  data: T[];
  pageSize?: number;
  isLoading?: boolean;
  /** True while a background refresh is in flight; shows a subtle spinner. */
  isFetching?: boolean;
  /** True when the latest fetch failed. With data present a stale-data warning
   * is shown; without data the body renders a full error state. */
  isError?: boolean;
  onRetry?: () => void;
  visibilityState?: VisibilityState;
  filters?: DataTableFilterOption[];
  defaultFilters?: Record<string, string>;
  onClick?: (entry: T) => void;
  bulkActions?: DataTableBottomBarAction<T>[];
}

// Only surface the refresh spinner once a fetch has been in flight for a
// moment — fast polls shouldn't strobe the toolbar every few seconds.
function useDelayedFlag(active: boolean, delayMs = 400) {
  const [shown, setShown] = useState(false);
  if (!active && shown) {
    setShown(false);
  }
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setShown(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [active, delayMs]);
  return shown;
}

export function DataTable<T>({
  name,
  columns,
  initialSorting,
  data,
  pageSize = 10,
  isLoading,
  isFetching,
  isError,
  onRetry,
  visibilityState,
  filters,
  defaultFilters = {},
  onClick,
  bulkActions,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const loadPageSize = (defaultSize: number) => {
    if (typeof window === "undefined") return defaultSize;
    try {
      const stored = localStorage.getItem("table_" + name + "_page_size");
      return stored ? Number(stored) : defaultSize;
    } catch {
      return defaultSize;
    }
  };
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: loadPageSize(pageSize),
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "table_" + name + "_page_size",
        pagination.pageSize.toString(),
      );
    }
  }, [name, pagination.pageSize]);
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const loadColumnVisibility = (): VisibilityState => {
    if (typeof window === "undefined") return visibilityState ?? {};
    try {
      const stored = localStorage.getItem(
        "table_" + name + "_column_visibility",
      );
      return stored ? JSON.parse(stored) : (visibilityState ?? {});
    } catch {
      return visibilityState ?? {};
    }
  };
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => loadColumnVisibility(),
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "table_" + name + "_column_visibility",
        JSON.stringify(columnVisibility),
      );
    }
  }, [name, columnVisibility]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSortingRemoval: false,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: { pagination, sorting, columnVisibility, globalFilter },
    autoResetPageIndex: false,
  });

  const showRefreshing = useDelayedFlag(
    Boolean(isFetching && !isLoading && !isError),
  );
  const showStaleWarning = Boolean(isError && data.length > 0);

  return (
    <div className="space-y-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
              <Search className="size-4" />
            </div>
            <Input
              placeholder={t("table.search")}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              className="max-w-sm peer pl-9"
            />
          </div>
          {showStaleWarning ? (
            <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-500">
              <TriangleAlert className="size-4 shrink-0" />
              <span className="max-md:hidden">{t("table.error.stale")}</span>
              {onRetry && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={onRetry}
                  aria-label={t("table.error.retry")}
                >
                  <RotateCw />
                </Button>
              )}
            </div>
          ) : (
            showRefreshing && (
              <div
                role="status"
                aria-label={t("table.refreshing")}
                className="text-muted-foreground"
              >
                <Spinner className="size-4" />
              </div>
            )
          )}
        </div>
        <div>
          {filters && (
            <DataTableFilters
              table={table}
              name={name}
              filters={filters}
              defaultFilters={defaultFilters}
            />
          )}
          <DataTableColumnSelection
            table={table}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            visibilityState={visibilityState}
          />
        </div>
      </div>

      <div className="rounded-md">
        <Table
          className={`border-separate border-spacing-y-2`}
          style={{
            borderSpacing: `0 ${pagination.pageSize <= 5 ? 12 : 6}px`,
          }}
        >
          <DataTableHeader table={table} pagination={pagination} />
          <DataTableBody
            table={table}
            columns={columns}
            isLoading={isLoading}
            isError={isError && data.length === 0}
            onRetry={onRetry}
            pagination={pagination}
            onClick={onClick}
          />
          <DataTableBottomBar
            table={table}
            actions={bulkActions ? bulkActions : []}
          />
        </Table>
      </div>

      {/* Reserve the pagination row's height while loading so the layout
          doesn't jump when data arrives. */}
      <div className="min-h-9">
        {!isLoading && !(isError && data.length === 0) && (
          <DataTablePagination table={table} pagination={pagination} />
        )}
      </div>
    </div>
  );
}
