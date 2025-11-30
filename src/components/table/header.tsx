'use client'

import {
  flexRender,
  type PaginationState,
  type Table
} from '@tanstack/react-table'

import {TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon} from 'lucide-react'
import {useTranslation} from "react-i18next"
import {Checkbox} from '@/components/ui/checkbox'
import {useEffect, useRef} from "react";

function DataTableSelectAll({ table }: { table: any }) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
    }
  }, [table.getIsSomePageRowsSelected(), table.getIsAllPageRowsSelected()])

  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  )
}


export default function DataTableHeader<T>(
  {
    table,
    pagination
  }: {
    table: Table<T>,
    pagination: PaginationState
  }) {
  const {t} = useTranslation();
  const spacing = pagination.pageSize <= 5 ? "h-11 px-8" : "h-11 px-4";

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup: any) => (
        <TableRow key={headerGroup.id}
                  className="hover:bg-transparent border-none">
          <TableHead key="select_all" className="py-6 px-4 w-0">
            <DataTableSelectAll table={table} />
          </TableHead>
          {headerGroup.headers.map((header: any, index: number) => {
            return (
              <TableHead key={header.id} className={spacing} style={{
                width: header.getSize(),
                minWidth: header.column.columnDef.minSize,
                maxWidth: header.column.columnDef.maxSize
              }}>
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <div
                    className="flex items-center justify-start cursor-pointer select-none group"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      typeof header.column.columnDef.header === "string"
                        ? t(header.column.columnDef.header)
                        : header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                        asc: <ChevronUpIcon size={16}
                                            className="opacity-60 ml-4"/>,
                        desc: <ChevronDownIcon size={16}
                                               className="opacity-60 ml-4"/>
                      }[header.column.getIsSorted() as string] ??
                      <ChevronsUpDownIcon size={16}
                                          className="opacity-0 group-hover:opacity-60 transition-opacity ml-4"/>}
                  </div>
                ) : (
                  flexRender(
                    typeof header.column.columnDef.header === "string"
                      ? t(header.column.columnDef.header)
                      : header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}
