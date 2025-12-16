import client from "../client";

export type Service = {
  name: string;
  namespace: string;
  type: string;
  age: number;
  cluster_ip: string;
  cluster_ips: string[];
  ip_family_policy: string;
  ip_families: string[];
  selector: Record<string, string>;
  session_affinity: string;
  internal_traffic_policy: string;
  external_traffic_policy: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  ports: ServicePort[];
  endpoints: ServiceEndpoint[];
  events: Event[];
  raw: string;
}

export type ServicePort = {
  name: string;
  port: number;
  protocol: string;
  target_port: string;
  node_port: number;
}

export type ServiceEndpoint = {
  ip: string;
  port: number;
}

export type Event = {
  type: string;
  reason: string;
  message: string;
  timestamp: number;
  source: string;
}

export type ServiceListResponse = {
  services: Service[];
  success?: boolean;
}

export interface ServiceFindRequest {
  namespace: string;
  service: string;
}

export type ServiceFindResponse = {
  success: boolean;
  service: Service;
}

export interface ServiceCreateRequest {
  raw: string;
}

export type ServiceCreateResponse = {
  success: boolean;
  namespace: string;
  service: string;
}

export interface ServiceDeleteRequest {
  namespace: string;
  service: string;
}

export type ServiceDeleteResponse = {
  success: boolean;
}

export const ServiceApi = {
  List: "/services/",
  Find: "/service/find/",
  Create: "/service/create/",
  Delete: "/service/delete/"
} as const;

const list = () => client.get<ServiceListResponse>({url: ServiceApi.List});
const listCluster = (clusterId: string) => client.get<ServiceListResponse>(
  {
    url: ServiceApi.List,
    headers: {
      Cluster: clusterId,
    },
  }
);
const find = (data: ServiceFindRequest) => client.post<ServiceFindResponse>({
  url: ServiceApi.Find,
  data
});
const create = (data: ServiceCreateRequest) => client.post<ServiceCreateResponse>({
  url: ServiceApi.Create,
  data
});
const remove = (data: ServiceDeleteRequest) => client.post<ServiceDeleteResponse>({
  url: ServiceApi.Delete,
  data
});

export default {
  list,
  listCluster,
  find,
  create,
  remove
};