import {
  type ColumnDef,
  flexRender,
  type PaginationState,
  type Row,
  type Table
} from '@tanstack/react-table'
import {TableBody, TableCell, TableRow} from '@/components/ui/table'
import {Skeleton} from "@/components/ui/skeleton"
import {Checkbox} from '@/components/ui/checkbox'
import {useTranslation} from "react-i18next";
import {useState} from "react";

function DataRow<T>(
  {
    row,
    spacing,
    pagination,
    onClick
  }: {
    row: Row<T>,
    spacing: string,
    pagination: PaginationState,
    onClick?: (row: Row<T>) => void
  }
) {
  const [disableGroup, setDisableGroup] = useState(false);
  const selected = row.getIsSelected();

  return (
    <TableRow
      key={row.id}
      className={`${disableGroup ? '' : 'group'} transition hover:bg-transparent !bg-transparent`}
      data-state={selected ? 'selected' : undefined}
      onClick={() => onClick ? onClick(row) : {}}
    >
      <TableCell
        className="py-6 px-4 !bg-transparent w-10 pointer-events-auto"
        onMouseEnter={() => setDisableGroup(true)}
        onMouseLeave={() => setDisableGroup(false)}
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </TableCell>

      {row.getVisibleCells().map((cell: any, index: number) => {
        const isFirst = index === 0;
        const isLast = index === row.getVisibleCells().length - 1;

        const selectedEdgeClasses = selected
          ? `border-t-2 border-b-2 box-border py-${pagination.pageSize <= 5 ? 9.5 : 5.5} ${!isFirst && !isLast ? (pagination.pageSize <= 5 ? "px-8" : "px-4") : ""}`
          : '';
        const firstExtra = isFirst && selected ?
          `border-l-2 rounded-l-xl pl-${pagination.pageSize <= 5 ? 7.5 : 3.5} pr-${pagination.pageSize <= 5 ? 8 : 4}` :
          (isFirst ? 'rounded-l-xl' : '');
        const lastExtra = isLast && selected ?
          `border-r-2 rounded-r-xl pr-${pagination.pageSize <= 5 ? 7.5 : 3.5} pl-${pagination.pageSize <= 5 ? 8 : 4}` :
          (isLast ? 'rounded-r-xl' : '');
        return (
          <TableCell
            key={cell.id}
            className={`${selected ? "" : spacing} bg-muted/50 group-hover:bg-muted transition ${selectedEdgeClasses} ${firstExtra} ${lastExtra}`}
            style={{
              width: cell.column.getSize(),
              minWidth: cell.column.columnDef.minSize,
              maxWidth: cell.column.columnDef.maxSize
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}


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
            <TableCell className={`${spacing} bg-muted/50`}>
              <Skeleton className="h-5 w-5"/>
            </TableCell>
            {Array.from({length: columns.length}).map((_, cellIndex) => (
              <TableCell key={cellIndex}
                         className={`${spacing} bg-muted/50 ${cellIndex === columns.length - 1 ? "rounded-r-xl" : ""}`}>
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
      {rows.length ? rows.map(row => (
        <DataRow
          key={row.id}
          row={row}
          spacing={spacing}
          pagination={pagination}
          onClick={onClick}
        />
      )) : (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={columns.length + 1} className="text-center h-24">
            {t("table.empty")}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
