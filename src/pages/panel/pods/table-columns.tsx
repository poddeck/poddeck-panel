import {type ColumnDef} from "@tanstack/react-table";
import {type Pod} from "@/api/services/pod-service"
import {PodsStatus, PodsActionDropdown} from "./table-components.tsx";
import {PodAge} from "@/pages/panel/pod/age.tsx";

export const columns: ColumnDef<Pod, unknown>[] = [
  {
    header: "panel.page.pods.column.namespace",
    accessorKey: "namespace",
    filterFn: 'equals',
  },
  {
    header: "panel.page.pods.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.pods.column.containers",
    accessorKey: "container",
    cell: ({row}) => {
      return (
        <span>{row.original.ready_containers} / {row.original.total_containers}</span>
      );
    },
  },
  {
    header: "panel.page.pods.column.status",
    accessorKey: "status",
    cell: ({row}) => {
      return <PodsStatus status={row.original.status.toLowerCase()}/>
    },
  },
  {
    header: "panel.page.pods.column.restarts",
    accessorKey: "restarts",
  },
  {
    header: "panel.page.pods.column.age",
    accessorKey: "age",
    cell: ({row}) => {
      return <PodAge age={row.original.age}/>
    },
  },
  {
    header: "panel.page.pods.column.node",
    accessorKey: "node",
  },
  {
    header: "panel.page.pods.column.ip",
    accessorKey: "pod_ip",
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    enableHiding: false,
    cell: ({row}) => {
      return <PodsActionDropdown pod={row.original}/>
    },
  },
];