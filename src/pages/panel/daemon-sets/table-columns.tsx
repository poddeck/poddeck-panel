import {type ColumnDef} from "@tanstack/react-table";
import {type DaemonSet} from "@/api/services/daemon-set-service"
import {DaemonSetsActionDropdown} from "./table-components.tsx";
import {Age} from "@/components/age/age.tsx";

export const columns: ColumnDef<DaemonSet, unknown>[] = [
  {
    header: "panel.page.daemon-sets.column.namespace",
    accessorKey: "namespace",
    filterFn: 'equals',
  },
  {
    header: "panel.page.daemon-sets.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.daemon-sets.column.desired",
    accessorKey: "desired_number_scheduled",
  },
  {
    header: "panel.page.daemon-sets.column.current",
    accessorKey: "current_number_scheduled",
  },
  {
    header: "panel.page.daemon-sets.column.ready",
    accessorKey: "number_ready",
  },
  {
    header: "panel.page.daemon-sets.column.up-to-date",
    accessorKey: "updated_number_scheduled",
  },
  {
    header: "panel.page.daemon-sets.column.age",
    accessorKey: "age",
    cell: ({row}) => {
      return <Age age={row.original.age}/>
    },
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    enableHiding: false,
    cell: ({row}) => {
      return <DaemonSetsActionDropdown daemonSet={row.original}/>
    },
  },
];