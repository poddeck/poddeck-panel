'use client'

import {usePagination} from '@/hooks/use-pagination'
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
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react'
import {useTranslation} from "react-i18next";
import type {PaginationState, Table} from "@tanstack/react-table";

export default function DataTablePagination<T>(
  {
    table,
    pagination
  }: {
    table: Table<T>,
    pagination: PaginationState
  }
) {
  const {t} = useTranslation();
  const {pages, showLeftEllipsis, showRightEllipsis} = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5
  })

  return (
    <div className="flex items-center justify-between max-sm:flex-col gap-3">
      <p className='text-muted-foreground flex-1 text-sm whitespace-nowrap'
         aria-live='polite'>
        {t("table.page")} <span
        className='text-foreground'>{table.getState().pagination.pageIndex + 1}</span> {t("table.of")}{' '}
        <span className='text-foreground'>{table.getPageCount()}</span>
      </p>

      <Pagination className="relative z-10">
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

          {showLeftEllipsis &&
            <PaginationItem><PaginationEllipsis/></PaginationItem>}

          {pages.map((p: number) => {
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

          {showRightEllipsis &&
            <PaginationItem><PaginationEllipsis/></PaginationItem>}

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

      <Select value={pagination.pageSize.toString()}
              onValueChange={v => table.setPageSize(Number(v))}>
        <SelectTrigger className="w-fit"><SelectValue/></SelectTrigger>
        <SelectContent align="end">
          {[1, 5, 10, 25, 50].map(size => (
            <SelectItem
              key={size}
              value={size.toString()}
            >
              {size} / {t("table.page")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
