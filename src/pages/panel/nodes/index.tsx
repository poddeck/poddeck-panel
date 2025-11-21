import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import PanelPage from "@/layouts/panel";

export type KubernetesNode = {
  name: string;
  status: "Ready" | "NotReady" | "SchedulingDisabled";
  roles: string[];
  cpu: string;
  memory: string;
  version: string;
  createdAt: string;
};

const dummyNodes: KubernetesNode[] = [
  {
    name: "node-1",
    status: "Ready",
    roles: ["control-plane", "master"],
    cpu: "4 vCPU",
    memory: "16 Gi",
    version: "v1.29.3",
    createdAt: "2024-05-10",
  },
  {
    name: "node-2",
    status: "Ready",
    roles: ["worker"],
    cpu: "8 vCPU",
    memory: "32 Gi",
    version: "v1.29.3",
    createdAt: "2024-05-08",
  },
  {
    name: "node-3",
    status: "NotReady",
    roles: ["worker"],
    cpu: "2 vCPU",
    memory: "8 Gi",
    version: "v1.28.1",
    createdAt: "2024-04-01",
  },
  {
    name: "node-4",
    status: "SchedulingDisabled",
    roles: ["worker"],
    cpu: "4 vCPU",
    memory: "16 Gi",
    version: "v1.29.0",
    createdAt: "2024-05-11",
  },
];

export const nodeColumns: ColumnDef<KubernetesNode, unknown>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableSorting: true
  },
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    cell: ({ row }) => {
      const value = row.getValue("status") as KubernetesNode["status"];
      const colors = {
        Ready: "bg-green-600/10 text-green-600",
        NotReady: "bg-red-600/10 text-red-600",
        SchedulingDisabled: "bg-amber-600/10 text-amber-600",
      };
      return <Badge className={colors[value]}>{value}</Badge>;
    },
  },
  {
    header: "Roles",
    accessorKey: "roles",
    enableSorting: false,
    cell: ({ row }) => {
      const roles = row.getValue("roles") as string[];
      return <div className="flex gap-1 flex-wrap">{roles.map((r) => <Badge key={r}>{r}</Badge>)}</div>;
    },
  },
  {
    header: "CPU",
    accessorKey: "cpu",
    enableSorting: false,
  },
];

export default function NodesPage() {
  const [nodes] = useState(dummyNodes);
  return (
    <PanelPage title="panel.page.nodes.title">
      <DataTable<KubernetesNode>
        columns={nodeColumns}
        data={nodes}
        pageSize={5}
        initialSorting={[{id: "name", desc: true}]}
      />
    </PanelPage>
  )
}
