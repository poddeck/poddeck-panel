'use client'

import {useState} from 'react'
import {
  type ColumnDef,
  type ColumnSort,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable
} from '@tanstack/react-table'

import {usePagination} from '@/hooks/use-pagination'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon
} from 'lucide-react'
import {useTranslation} from "react-i18next";
import {Skeleton} from "@/components/ui/skeleton"

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  initialSorting?: ColumnSort[]
  data: T[]
  pageSize?: number,
  isLoading?: boolean
}

export function DataTable<T>({
                               columns,
                               initialSorting,
                               data,
                               pageSize = 10,
                               isLoading
                             }: DataTableProps<T>) {
  const {t} = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize
  })
  const [sorting, setSorting] = useState<SortingState>(
    initialSorting ? initialSorting : []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSortingRemoval: false,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {pagination, sorting}
  })
  const {pages, showLeftEllipsis, showRightEllipsis} = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5
  })
  return (
    <div className="space-y-4">
      <div className="rounded-md">
        <Table className="border-separate border-spacing-y-2">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-none"
              >
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-8"
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className="flex items-center justify-start cursor-pointer select-none group"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: (
                            <ChevronUpIcon
                              size={16}
                              className="opacity-60 ml-4"
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              size={16}
                              className="opacity-60 ml-4"
                            />
                          )
                        }[header.column.getIsSorted() as string] ?? (
                          <ChevronsUpDownIcon
                            size={16}
                            className="opacity-0 group-hover:opacity-60 transition-opacity ml-4"
                          />
                        )}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading ? (
            <>
              <TableBody>
                {Array.from({length: pageSize}).map((_, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-transparent">
                    {Array.from({length: columns.length}).map((_, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className={`
                          py-10 px-8
                          bg-muted/50
                          ${cellIndex === 0 ? "rounded-l-xl" : ""}
                          ${cellIndex === columns.length - 1 ? "rounded-r-xl" : ""}
                        `}
                      >
                        <Skeleton className="h-5 w-full"/>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}
                              className="group transition hover:bg-transparent">
                      {row.getVisibleCells().map((cell, index) => {
                        const isFirst = index === 0
                        const isLast = index === row.getVisibleCells().length - 1
                        return (
                          <TableCell
                            key={cell.id}
                            className={`
                              py-10 px-8
                              bg-muted/50
                              group-hover:bg-muted transition
                              ${isFirst ? 'rounded-l-xl' : ''}
                              ${isLast ? 'rounded-r-xl' : ''}
                            `}
                            style={{
                              width: cell.column.getSize(),
                              minWidth: cell.column.columnDef.minSize,
                              maxWidth: cell.column.columnDef.maxSize,
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center h-24"
                    >
                      {t("table.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      </div>
      {!isLoading &&
        <div
          className="flex items-center justify-between max-sm:flex-col gap-3">
          <p className='text-muted-foreground flex-1 text-sm whitespace-nowrap'
             aria-live='polite'>
            {t("table.page")} <span
            className='text-foreground'>{table.getState().pagination.pageIndex + 1}</span> {t("table.of")}{' '}
            <span className='text-foreground'>{table.getPageCount()}</span>
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon/>
                </Button>
              </PaginationItem>
              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis/>
                </PaginationItem>
              )}
              {pages.map(p => {
                const active = p === pagination.pageIndex + 1
                return (
                  <PaginationItem key={p}>
                    <Button
                      size="icon"
                      variant={active ? 'outline' : 'ghost'}
                      onClick={() => table.setPageIndex(p - 1)}
                    >
                      {p}
                    </Button>
                  </PaginationItem>
                )
              })}
              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis/>
                </PaginationItem>
              )}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon/>
                </Button>
              </PaginationItem>

            </PaginationContent>
          </Pagination>

          <Select
            value={pagination.pageSize.toString()}
            onValueChange={v => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="w-fit">
              <SelectValue/>
            </SelectTrigger>

            <SelectContent>
              {[1, 5, 10, 25, 50].map(pageSize => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize} / {t("table.page")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    </div>
  )
}
