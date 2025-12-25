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
  architecture: string;
  os_image: string;
  operating_system: string;
  container_runtime_version: string;
  kubelet_version: string;
  ready: boolean;
  age: number;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  conditions: Condition[];
  events: Event[];
}

export type Condition = {
  type: string;
  status: string;
  reason: string;
  message: string;
  last_heartbeat: number;
  last_transition: number;
}

export type Event = {
  type: string;
  reason: string;
  message: string;
  timestamp: number;
  source: string;
}

export type NodeListResponse = {
  nodes: Node[];
  success?: boolean;
}

export interface NodeFindRequest {
  name: string;
}

export type NodeFindResponse = {
  success: boolean;
  node: Node;
}

export const NodeApi = {
  List: "/nodes/",
  Find: "/node/find/"
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
const find = (data: NodeFindRequest) => client.post<NodeFindResponse>({
  url: NodeApi.Find,
  data
});

export default {
  list,
  listCluster,
  find
};