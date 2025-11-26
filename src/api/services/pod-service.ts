import client from "../client";

export type Pod = {
  name: string;
  namespace: string;
  total_containers: number;
  ready_containers: number;
  status: string;
  age: number;
}

export type PodListResponse = {
  pods: Pod[];
  success?: boolean;
}

export const PodApi = {
  List: "/pods/",
} as const;

const list = () => client.get<PodListResponse>({url: PodApi.List});

export default {
  list,
};