import {type ColumnDef} from "@tanstack/react-table";
import {type ReplicaSet} from "@/api/services/replica-set-service"
import {ReplicaSetsActionDropdown} from "./table-components.tsx";
import {Age} from "@/components/age/age.tsx";

export const columns: ColumnDef<ReplicaSet, unknown>[] = [
  {
    header: "panel.page.replica-sets.column.namespace",
    accessorKey: "namespace",
    filterFn: 'equals',
  },
  {
    header: "panel.page.replica-sets.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.replica-sets.column.desired",
    accessorKey: "replicas",
  },
  {
    header: "panel.page.replica-sets.column.current",
    accessorKey: "available_replicas",
  },
  {
    header: "panel.page.replica-sets.column.ready",
    accessorKey: "ready_replicas",
  },
  {
    header: "panel.page.replica-sets.column.age",
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
      return <ReplicaSetsActionDropdown replicaSet={row.original}/>
    },
  },
];