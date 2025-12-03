'use client'

import {useEffect, useState} from 'react'
import {
  type ColumnDef,
  type ColumnSort,
  getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState
} from '@tanstack/react-table'

import {Table} from '@/components/ui/table'
import DataTableColumnSelection from "./column-selection.tsx";
import DataTableHeader from "./header.tsx";
import DataTableBody from "./body.tsx";
import DataTablePagination from "./pagination.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import {Search} from "lucide-react";
import {
  type DataTableFilterOption,
  DataTableFilters
} from "@/components/table/filter.tsx";
import DataTableBottomBar, {
  type DataTableBottomBarAction
} from "@/components/table/bottom-bar.tsx";

interface DataTableProps<T> {
  name: string;
  columns: ColumnDef<T, unknown>[]
  initialSorting?: ColumnSort[]
  data: T[]
  pageSize?: number,
  isLoading?: boolean
  visibilityState?: VisibilityState
  filters?: DataTableFilterOption[]
  onClick?: (entry: T) => void,
  bulkActions?: DataTableBottomBarAction<T>[]
}

export function DataTable<T>(
  {
    name,
    columns,
    initialSorting,
    data,
    pageSize = 10,
    isLoading,
    visibilityState,
    filters,
    onClick,
    bulkActions
  }: DataTableProps<T>
) {
  const {t} = useTranslation();
  const loadPageSize = (defaultSize: number) => {
    if (typeof window === "undefined") return defaultSize
    try {
      const stored = localStorage.getItem("table_" + name + "_page_size")
      return stored ? Number(stored) : defaultSize
    } catch {
      return defaultSize
    }
  }
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: loadPageSize(pageSize)
  })
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("table_" + name + "_page_size", pagination.pageSize.toString())
    }
  }, [pagination.pageSize])
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? [])
  const loadColumnVisibility = (): VisibilityState => {
    if (typeof window === "undefined") return visibilityState ?? {}
    try {
      const stored = localStorage.getItem("table_" + name + "_column_visibility")
      return stored ? JSON.parse(stored) : visibilityState ?? {}
    } catch {
      return visibilityState ?? {}
    }
  }
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => loadColumnVisibility())
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("table_" + name + "_column_visibility", JSON.stringify(columnVisibility))
    }
  }, [columnVisibility])
  const [globalFilter, setGlobalFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState<string>("")
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
    state: {pagination, sorting, columnVisibility, globalFilter},
    autoResetPageIndex: false
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className='relative'>
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
            <Search className='size-4' />
          </div>
          <Input
            placeholder={t("table.search")}
            value={globalFilter}
            onChange={e => setGlobalFilter(String(e.target.value))}
            className="max-w-sm peer pl-9"
          />
        </div>
        <div>
          {filters &&
            <DataTableFilters
              table={table}
              name={name}
              filters={filters}
            />
          }
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
            borderSpacing: `0 ${pagination.pageSize <= 5 ? 12 : 6}px`
          }}
        >
          <DataTableHeader
            table={table}
            pagination={pagination}
          />
          <DataTableBody
            table={table}
            columns={columns}
            isLoading={isLoading}
            pagination={pagination}
            onClick={onClick}
          />
          <DataTableBottomBar
            table={table}
            actions={bulkActions ? bulkActions : []}
          />
        </Table>
      </div>

      {!isLoading && (
        <DataTablePagination
          table={table}
          pagination={pagination}
        />
      )}
    </div>
  )
}