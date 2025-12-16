import {type ColumnDef} from "@tanstack/react-table";
import {type Service} from "@/api/services/service-service"
import {ServicesActionDropdown} from "./table-components.tsx";
import {Age} from "@/components/age/age.tsx";

export const columns: ColumnDef<Service, unknown>[] = [
  {
    header: "panel.page.services.column.namespace",
    accessorKey: "namespace",
    filterFn: 'equals',
  },
  {
    header: "panel.page.services.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.services.column.type",
    accessorKey: "type",
  },
  {
    header: "panel.page.services.column.cluster.ip",
    accessorKey: "cluster_ip",
  },
  {
    header: "panel.page.services.column.age",
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
      return <ServicesActionDropdown service={row.original}/>
    },
  },
];