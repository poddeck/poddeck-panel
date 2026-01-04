import client from "../client";

export type StatefulSet = {
  name: string;
  namespace: string;
  replicas: number;
  ready_replicas: number;
  current_replicas: number;
  updated_replicas: number;
  available_replicas: number;
  current_revision: string;
  update_revision: string;
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
  last_transition: number;
}

export type Event = {
  type: string;
  reason: string;
  message: string;
  timestamp: number;
  source: string;
}

export type StatefulSetListResponse = {
  stateful_sets: StatefulSet[];
  success?: boolean;
}

export interface StatefulSetFindRequest {
  namespace: string;
  stateful_set: string;
}

export type StatefulSetFindResponse = {
  success: boolean;
  stateful_set: StatefulSet;
}

export interface StatefulSetCreateRequest {
  raw: string;
}

export type StatefulSetCreateResponse = {
  success: boolean;
  namespace: string;
  stateful_set: string;
}

export interface StatefulSetDeleteRequest {
  namespace: string;
  stateful_set: string;
}

export type StatefulSetDeleteResponse = {
  success: boolean;
}

export interface StatefulSetScaleRequest {
  namespace: string;
  stateful_set: string;
  replicas: number;
}

export type StatefulSetScaleResponse = {
  success: boolean;
}

export interface StatefulSetRestartRequest {
  namespace: string;
  stateful_set: string;
}

export type StatefulSetRestartResponse = {
  success: boolean;
}

export interface StatefulSetEditRequest {
  namespace: string;
  stateful_set: string;
  raw: string;
}

export type StatefulSetEditResponse = {
  success: boolean;
}

export const StatefulSetApi = {
  List: "/stateful-sets/",
  Find: "/stateful-set/find/",
  Create: "/stateful-set/create/",
  Delete: "/stateful-set/delete/",
  Scale: "/stateful-set/scale/",
  Restart: "/stateful-set/restart/",
  Edit: "/stateful-set/edit/",
} as const;

const list = () => client.get<StatefulSetListResponse>({url: StatefulSetApi.List});
const listCluster = (clusterId: string) => client.get<StatefulSetListResponse>(
  {
    url: StatefulSetApi.List,
    headers: {
      Cluster: clusterId,
    },
  }
);
const find = (data: StatefulSetFindRequest) => client.post<StatefulSetFindResponse>({
  url: StatefulSetApi.Find,
  data
});
const create = (data: StatefulSetCreateRequest) => client.post<StatefulSetCreateResponse>({
  url: StatefulSetApi.Create,
  data
});
const remove = (data: StatefulSetDeleteRequest) => client.post<StatefulSetDeleteResponse>({
  url: StatefulSetApi.Delete,
  data
});
const scale = (data: StatefulSetScaleRequest) => client.post<StatefulSetScaleResponse>({
  url: StatefulSetApi.Scale,
  data
});
const restart = (data: StatefulSetRestartRequest) => client.post<StatefulSetRestartResponse>({
  url: StatefulSetApi.Restart,
  data
});
const edit = (data: StatefulSetEditRequest) => client.post<StatefulSetEditResponse>({
  url: StatefulSetApi.Edit,
  data
});

export default {
  list,
  listCluster,
  find,
  create,
  remove,
  scale,
  restart,
  edit
};