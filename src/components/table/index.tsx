'use client'

import {useState} from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState, type ColumnSort
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
  PaginationItem,
  PaginationEllipsis
} from '@/components/ui/pagination'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from 'lucide-react'

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  initialSorting?: ColumnSort[]
  data?: T[]
  pageSize?: number
}

export function DataTable<T>({
                               columns,
                               initialSorting,
                               data: initialData,
                               pageSize = 10,
                             }: DataTableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize
  })

  const [sorting, setSorting] = useState<SortingState>(
    initialSorting ? initialSorting : []
  )
  const [data] = useState<T[]>(initialData ?? [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSortingRemoval: false,
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
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="h-11">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className="flex items-center justify-between cursor-pointer select-none group"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {{
                          asc: <ChevronUpIcon size={16} className="opacity-60" />,
                          desc: <ChevronDownIcon size={16} className="opacity-60" />
                        }[header.column.getIsSorted() as string] ?? (
                          <ChevronUpIcon size={16} className="opacity-0 group-hover:opacity-60 transition-opacity" />
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

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                            className="rounded-xl p-4 shadow-sm bg-card hover:bg-secondary transition border-none mb-2">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}
                           className="text-center h-24">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between max-sm:flex-col gap-3">
        <p className='text-muted-foreground flex-1 text-sm whitespace-nowrap'
           aria-live='polite'>
          Page <span
          className='text-foreground'>{table.getState().pagination.pageIndex + 1}</span> of{' '}
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
                {pageSize} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
