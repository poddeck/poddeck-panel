import client from "../client";

export type Deployment = {
  name: string;
  namespace: string;
  replicas: number;
  updated_replicas: number;
  ready_replicas: number;
  available_replicas: number;
  unavailable_replicas: number;
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
}

export type Event = {
  type: string;
  reason: string;
  message: string;
  timestamp: number;
  source: string;
}

export type DeploymentListResponse = {
  deployments: Deployment[];
  success?: boolean;
}

export interface DeploymentFindRequest {
  namespace: string;
  deployment: string;
}

export type DeploymentFindResponse = {
  success: boolean;
  deployment: Deployment;
}

export interface DeploymentDeleteRequest {
  namespace: string;
  deployment: string;
}

export type DeploymentDeleteResponse = {
  success: boolean;
}

export interface DeploymentLogRequest {
  namespace: string;
  deployment: string;
  since_seconds?: number;
}

export type DeploymentLogResponse = {
  success: boolean;
  logs: string;
}

export const DeploymentApi = {
  List: "/deployments/",
  Find: "/deployment/find/",
  Delete: "/deployment/delete/",
  Log: "/deployment/log/",
} as const;

const list = () => client.get<DeploymentListResponse>({url: DeploymentApi.List});
const find = (data: DeploymentFindRequest) => client.post<DeploymentFindResponse>({
  url: DeploymentApi.Find,
  data
});
const remove = (data: DeploymentDeleteRequest) => client.post<DeploymentDeleteResponse>({
  url: DeploymentApi.Delete,
  data
});
const log = (data: DeploymentLogRequest) => client.post<DeploymentLogResponse>({
  url: DeploymentApi.Log,
  data
});

export default {
  list,
  find,
  remove,
  log,
};