import client from "../client";

export type Namespace = {
  name: string;
  status: string;
  age: number;
}

export type NamespaceListResponse = {
  namespaces: Namespace[];
  success?: boolean;
}

export const NamespaceApi = {
  List: "/namespaces/",
} as const;

const list = () => client.get<NamespaceListResponse>({url: NamespaceApi.List});

export default {
  list,
};