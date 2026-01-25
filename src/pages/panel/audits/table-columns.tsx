import {type ColumnDef} from "@tanstack/react-table";
import type {AuditEntry} from "@/api/services/audit-service.ts";
import {
  AuditStatus
} from "@/pages/panel/audits/table-components.tsx";

export const columns: ColumnDef<AuditEntry, unknown>[] = [
  {
    header: "panel.page.audits.column.number",
    accessorKey: "result.test_number",
    cell: ({row}) => {
      return row.original.result.test_number;
    },
  },
  {
    header: "panel.page.audits.column.type",
    accessorKey: "control.node_type",
    cell: ({row}) => {
      return row.original.control.node_type;
    },
  },
  {
    header: "panel.page.audits.column.description",
    accessorKey: "result.test_description",
    cell: ({row}) => {
      return row.original.result.test_description;
    },
  },
  {
    header: "panel.page.audits.column.status",
    accessorKey: "result.status",
    cell: ({row}) => {
      return <AuditStatus status={row.original.result.status.toUpperCase()}/>
    },
  }
];