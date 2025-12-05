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
  container_name: string;
  container_image: string;
  conditions: Condition[];
  events: Event[];
  raw: string;
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

export interface DeploymentScaleRequest {
  namespace: string;
  deployment: string;
  replicas: number;
}

export type DeploymentScaleResponse = {
  success: boolean;
}

export interface DeploymentRestartRequest {
  namespace: string;
  deployment: string;
}

export type DeploymentRestartResponse = {
  success: boolean;
}

export interface DeploymentEditRequest {
  namespace: string;
  deployment: string;
  raw: string;
}

export type DeploymentEditResponse = {
  success: boolean;
}

export const DeploymentApi = {
  List: "/deployments/",
  Find: "/deployment/find/",
  Delete: "/deployment/delete/",
  Scale: "/deployment/scale/",
  Restart: "/deployment/restart/",
  Edit: "/deployment/edit/",
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
const scale = (data: DeploymentScaleRequest) => client.post<DeploymentScaleResponse>({
  url: DeploymentApi.Scale,
  data
});
const restart = (data: DeploymentRestartRequest) => client.post<DeploymentRestartResponse>({
  url: DeploymentApi.Restart,
  data
});
const edit = (data: DeploymentEditRequest) => client.post<DeploymentEditResponse>({
  url: DeploymentApi.Edit,
  data
});

export default {
  list,
  find,
  remove,
  scale,
  restart,
  edit
};