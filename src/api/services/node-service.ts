import client from "../client";

export type Node = {
  name: string;
  total_cpu_capacity: number;
  allocated_cpu_capacity: number;
  cpu_cores: number;
  cpu_ratio: number;
  total_memory_capacity: number;
  allocated_memory_capacity: number;
  total_memory: number;
  used_memory: number;
  memory_ratio: number;
  total_storage: number;
  used_storage: number;
  storage_ratio: number;
  version: string;
  ready: boolean;
}

export type NodeListResponse = {
  nodes: Node[];
  success?: boolean;
}

export const NodeApi = {
  List: "/nodes/",
} as const;

const list = () => client.get<NodeListResponse>({url: NodeApi.List});
const listCluster = (clusterId: string) => client.get<NodeListResponse>(
  {
    url: NodeApi.List,
    headers: {
      Cluster: clusterId,
    },
  }
);

export default {
  list,
  listCluster
};