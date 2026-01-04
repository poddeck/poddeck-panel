import client from "../client";

export type DaemonSet = {
  name: string;
  namespace: string;
  current_number_scheduled: number;
  number_misscheduled: number;
  desired_number_scheduled: number;
  number_ready: number;
  updated_number_scheduled: number;
  number_available: number;
  number_unavailable: number;
  updated_revision: string;
  current_revision: string;
  age: number;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  container_name: string;
  container_image: string;
  container_cpu_limit: number;
  container_cpu_request: number;
  container_memory_limit: number;
  container_memory_request: number;
  conditions: Condition[];
  events: Event[];
  raw: string;
}

export type Condition = {
  type: string;
  status: string;
  reason: string;
  message: string;
  last_update: number;
}

export type Event = {
  type: string;
  reason: string;
  message: string;
  timestamp: number;
  source: string;
}

export type DaemonSetListResponse = {
  daemon_sets: DaemonSet[];
  success?: boolean;
}

export interface DaemonSetFindRequest {
  namespace: string;
  daemon_set: string;
}

export type DaemonSetFindResponse = {
  success: boolean;
  daemon_set: DaemonSet;
}

export interface DaemonSetCreateRequest {
  raw: string;
}

export type DaemonSetCreateResponse = {
  success: boolean;
  namespace: string;
  daemon_set: string;
}

export interface DaemonSetDeleteRequest {
  namespace: string;
  daemon_set: string;
}

export type DaemonSetDeleteResponse = {
  success: boolean;
}

export interface DaemonSetRestartRequest {
  namespace: string;
  daemon_set: string;
}

export type DaemonSetRestartResponse = {
  success: boolean;
}

export interface DaemonSetEditRequest {
  namespace: string;
  daemon_set: string;
  raw: string;
}

export type DaemonSetEditResponse = {
  success: boolean;
}

export const DaemonSetApi = {
  List: "/daemon-sets/",
  Find: "/daemon-set/find/",
  Create: "/daemon-set/create/",
  Delete: "/daemon-set/delete/",
  Restart: "/daemon-set/restart/",
  Edit: "/daemon-set/edit/",
} as const;

const list = () => client.get<DaemonSetListResponse>({url: DaemonSetApi.List});
const listCluster = (clusterId: string) => client.get<DaemonSetListResponse>(
  {
    url: DaemonSetApi.List,
    headers: {
      Cluster: clusterId,
    },
  }
);
const find = (data: DaemonSetFindRequest) => client.post<DaemonSetFindResponse>({
  url: DaemonSetApi.Find,
  data
});
const create = (data: DaemonSetCreateRequest) => client.post<DaemonSetCreateResponse>({
  url: DaemonSetApi.Create,
  data
});
const remove = (data: DaemonSetDeleteRequest) => client.post<DaemonSetDeleteResponse>({
  url: DaemonSetApi.Delete,
  data
});
const restart = (data: DaemonSetRestartRequest) => client.post<DaemonSetRestartResponse>({
  url: DaemonSetApi.Restart,
  data
});
const edit = (data: DaemonSetEditRequest) => client.post<DaemonSetEditResponse>({
  url: DaemonSetApi.Edit,
  data
});

export default {
  list,
  listCluster,
  find,
  create,
  remove,
  restart,
  edit
};