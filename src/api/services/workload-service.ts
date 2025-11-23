import client from "../client";

export type Metric = {
  node: string;
  cpu_cores: number;
  cpu_ratio: number;
  total_memory: number;
  used_memory: number;
  memory_ratio: number;
  total_storage: number;
  used_storage: number;
  storage_ratio: number;
  timestamp: number;
}

export interface WorkloadRequest {
  node: string;
  start: number;
  end: number;
  accuracy: string;
}

export type WorkloadResponse = {
  workload: Metric[];
}

export const WorkloadApi = {
  Find: "/workload/",
} as const;

const find = (data: WorkloadRequest) => client.post<WorkloadResponse>({
  url: WorkloadApi.Find,
  data
});

export default {
  find,
};