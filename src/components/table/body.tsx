'use client'

import {
  type ColumnDef,
  flexRender,
  type PaginationState,
  type Table,
  type Row
} from '@tanstack/react-table'

import {TableBody, TableCell, TableRow} from '@/components/ui/table'
import {Skeleton} from "@/components/ui/skeleton"
import {useTranslation} from "react-i18next";

export default function DataTableBody<T>(
  {
    table,
    columns,
    isLoading,
    pagination,
    onClick
  }: {
    table: Table<T>,
    columns: ColumnDef<T, unknown>[],
    isLoading?: boolean,
    pagination: PaginationState,
    onClick?: (row: Row<T>) => void
  }
) {
  const {t} = useTranslation();
  const spacing = pagination.pageSize <= 5 ? "py-10 px-8" : "py-6 px-4";

  if (isLoading) {
    return (
      <TableBody>
        {Array.from({length: pagination.pageSize}).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="hover:bg-transparent">
            {Array.from({length: columns.length}).map((_, cellIndex) => (
              <TableCell key={cellIndex}
                         className={`${spacing} bg-muted/50 ${cellIndex === 0 ? "rounded-l-xl" : ""} ${cellIndex === columns.length - 1 ? "rounded-r-xl" : ""}`}>
                <Skeleton className="h-5 w-full"/>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    )
  }

  const rows = table.getRowModel().rows
  return (
    <TableBody>
      {rows.length ? rows.map((row: any) => (
        <TableRow
          key={row.id}
          className="group transition hover:bg-transparent"
          onClick={() => onClick ? onClick(row) : {}}
        >
          {row.getVisibleCells().map((cell: any, index: number) => {
            const isFirst = index === 0
            const isLast = index === row.getVisibleCells().length - 1
            return (
              <TableCell key={cell.id}
                         className={`${spacing} bg-muted/50 group-hover:bg-muted transition ${isFirst ? 'rounded-l-xl' : ''} ${isLast ? 'rounded-r-xl' : ''}`}
                         style={{
                           width: cell.column.getSize(),
                           minWidth: cell.column.columnDef.minSize,
                           maxWidth: cell.column.columnDef.maxSize
                         }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            )
          })}
        </TableRow>
      )) : (
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={columns.length}
            className="text-center h-24"
          >
            {t("table.empty")}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}