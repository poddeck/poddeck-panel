import client from "../client";

export type Pod = {
  name: string;
  namespace: string;
  total_containers: number;
  ready_containers: number;
  status: string;
  restarts: number;
  age: number;
  ip: string;
  node: string;
}

export interface PodDeleteRequest {
  namespace: string;
  pod: string;
}

export type PodDeleteResponse = {
  success: boolean;
}

export type PodListResponse = {
  pods: Pod[];
  success?: boolean;
}

export const PodApi = {
  Delete: "/pod/delete/",
  List: "/pods/",
} as const;

const remove = (data: PodDeleteRequest) => client.post<PodDeleteResponse>({
  url: PodApi.Delete,
  data
});
const list = () => client.get<PodListResponse>({url: PodApi.List});

export default {
  remove,
  list,
};