import {type ColumnDef} from "@tanstack/react-table";
import {type Deployment} from "@/api/services/deployment-service"
import {DeploymentsActionDropdown} from "./table-components.tsx";
import {DeploymentAge} from "@/pages/panel/deployment/age.tsx";

export const columns: ColumnDef<Deployment, unknown>[] = [
  {
    header: "panel.page.deployments.column.namespace",
    accessorKey: "namespace",
    filterFn: 'equals',
  },
  {
    header: "panel.page.deployments.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.deployments.column.ready",
    accessorKey: "ready_replicas",
    cell: ({row}) => {
      return (
        <span>{row.original.ready_replicas} / {row.original.replicas}</span>
      );
    },
  },
  {
    header: "panel.page.deployments.column.up-to-date",
    accessorKey: "updated_replicas",
  },
  {
    header: "panel.page.deployments.column.available",
    accessorKey: "available_replicas",
  },
  {
    header: "panel.page.deployments.column.age",
    accessorKey: "age",
    cell: ({row}) => {
      return <DeploymentAge age={row.original.age}/>
    },
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    enableHiding: false,
    cell: ({row}) => {
      return <DeploymentsActionDropdown deployment={row.original}/>
    },
  },
];