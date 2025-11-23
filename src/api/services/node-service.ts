import client from "../client";

export type Node = {
  name: string;
  cpu_cores: number;
  cpu_ratio: number;
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
}

export const NodeApi = {
  List: "/nodes/",
} as const;

const list = () => client.get<NodeListResponse>({url: NodeApi.List});

export default {
  list,
};