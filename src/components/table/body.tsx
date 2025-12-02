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
    verticalSpacing,
    horizontalSpacing,
    onClick
  }: {
    row: Row<T>,
    verticalSpacing: number,
    horizontalSpacing: number,
    onClick?: (row: Row<T>) => void
  }
) {
  const [disableGroup, setDisableGroup] = useState(false);
  const selected = row.getIsSelected();
  const borderSize = 2;

  return (
    <TableRow
      key={row.id}
      className={`${disableGroup ? '' : 'group'} transition hover:bg-transparent !bg-transparent`}
      data-state={selected ? 'selected' : undefined}
      onClick={() => onClick ? onClick(row) : {}}
    >
      <TableCell
        className="!bg-transparent pointer-events-auto w-0"
        onMouseEnter={() => setDisableGroup(true)}
        onMouseLeave={() => setDisableGroup(false)}
        onClick={e => e.stopPropagation()}
        style={{
          paddingRight: 20,
          paddingLeft: 0
        }}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
      </TableCell>

      {row.getVisibleCells().map((cell: any, index: number) => {
        const isFirst = index === 0;
        const isLast = index === row.getVisibleCells().length - 1;
        const selectedEdgeClasses = selected
          ? `border-t border-b border-blue-600` : ``;
        const firstExtra = isFirst && selected ? `border-l rounded-l-xl` :
          (isFirst ? 'rounded-l-xl' : '');
        const lastExtra = isLast && selected ? `border-r rounded-r-xl` :
          (isLast ? 'rounded-r-xl' : '');
        return (
          <TableCell
            key={cell.id}
            className={`bg-muted/50 group-hover:bg-muted transition ${selectedEdgeClasses} ${firstExtra} ${lastExtra}`}
            style={{
              width: cell.column.getSize(),
              minWidth: cell.column.columnDef.minSize,
              maxWidth: cell.column.columnDef.maxSize,
              borderTopWidth: selected ? borderSize : 0,
              borderBottomWidth: selected ? borderSize : 0,
              borderLeftWidth: selected && isFirst ? borderSize : 0,
              borderRightWidth: selected && isLast ? borderSize : 0,
              paddingTop: verticalSpacing - (selected ? borderSize : 0),
              paddingBottom: verticalSpacing - (selected ? borderSize : 0),
              paddingLeft: horizontalSpacing - (isFirst && selected ? borderSize : 0),
              paddingRight: horizontalSpacing - (isLast && selected ? borderSize : 0)
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
    onClick?: (entry: T) => void
  }
) {
  const {t} = useTranslation();
  const verticalSpacing = pagination.pageSize <= 5 ? 40 : 30;
  const horizontalSpacing = pagination.pageSize <= 5 ? 30 : 25;

  if (isLoading) {
    return (
      <TableBody>
        {Array.from({length: pagination.pageSize}).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="hover:bg-transparent">
            <TableCell
              className="bg-transparent w-0"
              style={{
                paddingRight: 20,
                paddingLeft: 0
              }}
            >
              <Skeleton className="h-4 w-4"/>
            </TableCell>
            {Array.from({length: columns.length}).map((_, cellIndex) => (
              <TableCell
                key={cellIndex}
                className={`bg-muted/50 ${cellIndex === 0 ? "rounded-l-xl" : ""} ${cellIndex === columns.length - 1 ? "rounded-r-xl" : ""}`}
                style={{
                  paddingTop: verticalSpacing,
                  paddingBottom: verticalSpacing,
                  paddingLeft: horizontalSpacing,
                  paddingRight: horizontalSpacing
                }}
              >
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
          verticalSpacing={verticalSpacing}
          horizontalSpacing={horizontalSpacing}
          onClick={(row) => onClick ? onClick(row.original) : {}}
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
