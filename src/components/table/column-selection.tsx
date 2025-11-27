'use client'

import {Button} from '@/components/ui/button'
import {
  CheckCheck,
  ChevronDown,
  Columns3Icon,
  RefreshCcwIcon,
  SearchIcon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import {useState} from "react";

export default function DataTableColumnSelection(
  {
    table,
    searchQuery,
    setSearchQuery,
    visibilityState
  }: any
) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          <span className="flex items-center gap-2">
            <Columns3Icon/> {t("table.columns.label")}
          </span>
          <ChevronDown
            className={`ml-2 transition-transform duration-300 ${
              open ? 'scale-y-[-1]' : 'scale-y-100'
            }`}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="relative p-2">
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8"
            placeholder={t("table.columns.search")}
            onKeyDown={e => e.stopPropagation()}
          />
          <SearchIcon className="absolute inset-y-0 left-4 my-auto size-4"/>
        </div>
        <DropdownMenuSeparator/>
        {table.getAllColumns()
          .filter((column: any) => column.getCanHide())
          .filter((column: any) => {
            if (!searchQuery) return true
            const header = column.columnDef.header
            if (typeof header !== "string") return false
            return t(header).toLowerCase().includes(searchQuery.toLowerCase())
          })
          .map((column: any) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={value => column.toggleVisibility(value)}
              onSelect={e => e.preventDefault()}
            >
              {typeof column.columnDef.header === "string" ? t(column.columnDef.header) : ""}
            </DropdownMenuCheckboxItem>
          ))}
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={() => {
          table.resetColumnVisibility();
          setSearchQuery("")
        }}>
          <CheckCheck/> {t("table.columns.all")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          table.setColumnVisibility(visibilityState);
          setSearchQuery("")
        }}>
          <RefreshCcwIcon/> {t("table.columns.reset")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}