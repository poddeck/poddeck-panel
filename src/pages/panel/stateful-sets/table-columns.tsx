import {type ColumnDef} from "@tanstack/react-table";
import {type StatefulSet} from "@/api/services/stateful-set-service"
import {StatefulSetsActionDropdown} from "./table-components.tsx";
import {Age} from "@/components/age/age.tsx";

export const columns: ColumnDef<StatefulSet, unknown>[] = [
  {
    header: "panel.page.stateful-sets.column.namespace",
    accessorKey: "namespace",
    filterFn: 'equals',
  },
  {
    header: "panel.page.stateful-sets.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.stateful-sets.column.ready",
    accessorKey: "ready_replicas",
    cell: ({row}) => {
      return (
        <span>{row.original.ready_replicas} / {row.original.replicas}</span>
      );
    },
  },
  {
    header: "panel.page.stateful-sets.column.age",
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
      return <StatefulSetsActionDropdown statefulSet={row.original}/>
    },
  },
];