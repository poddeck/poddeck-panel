import client from "../client";

export type Pod = {
  name: string;
  namespace: string;
  total_containers: number;
  ready_containers: number;
  status: string;
  restarts: number;
  age: number;
  pod_ip: string;
  host_ip: string;
  node: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  containers: Container[];
  events: Event[];
}

export type Container = {
  name: string;
  image: string;
  ready: boolean;
  state: string;
  restarts: number;
}

export type Event = {
  type: string;
  reason: string;
  message: string;
  timestamp: number;
  source: string;
}

export type PodListResponse = {
  pods: Pod[];
  success?: boolean;
}

export interface PodFindRequest {
  namespace: string;
  pod: string;
}

export type PodFindResponse = {
  success: boolean;
  pod: Pod;
}

export interface PodDeleteRequest {
  namespace: string;
  pod: string;
}

export type PodDeleteResponse = {
  success: boolean;
}

export interface PodLogRequest {
  namespace: string;
  pod: string;
  since_seconds?: number;
}

export type PodLogResponse = {
  success: boolean;
  logs: string;
}

export const PodApi = {
  List: "/pods/",
  Find: "/pod/find/",
  Delete: "/pod/delete/",
  Log: "/pod/log/",
} as const;

const list = () => client.get<PodListResponse>({url: PodApi.List});
const find = (data: PodFindRequest) => client.post<PodFindResponse>({
  url: PodApi.Find,
  data
});
const remove = (data: PodDeleteRequest) => client.post<PodDeleteResponse>({
  url: PodApi.Delete,
  data
});
const log = (data: PodLogRequest) => client.post<PodLogResponse>({
  url: PodApi.Log,
  data
});

export default {
  list,
  find,
  remove,
  log,
};