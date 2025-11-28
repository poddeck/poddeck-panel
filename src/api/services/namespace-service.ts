import client from "../client";

export type Namespace = {
  name: string;
  status: string;
  age: number;
}

export interface NamespaceCreateRequest {
  name: string;
}

export type NamespaceCreateResponse = {
  success: boolean;
}

export interface NamespaceDeleteRequest {
  name: string;
}

export type NamespaceDeleteResponse = {
  success: boolean;
}

export type NamespaceListResponse = {
  namespaces: Namespace[];
  success?: boolean;
}

export const NamespaceApi = {
  Create: "/namespace/create/",
  Delete: "/namespace/delete/",
  List: "/namespaces/",
} as const;

const create = (data: NamespaceCreateRequest) => client.post<NamespaceCreateResponse>({
  url: NamespaceApi.Create,
  data
});
const remove = (data: NamespaceDeleteRequest) => client.post<NamespaceDeleteResponse>({
  url: NamespaceApi.Delete,
  data
});
const list = () => client.get<NamespaceListResponse>({url: NamespaceApi.List});

export default {
  create,
  remove,
  list,
};