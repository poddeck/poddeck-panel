import client from "../client";

export interface ResourceCreateRequest {
  raw: string;
}

export type ResourceCreateResponse = {
  success: boolean;
}

export const ResourceApi = {
  Create: "/resource/create/",
} as const;

const create = (data: ResourceCreateRequest) => client.post<ResourceCreateResponse>({
  url: ResourceApi.Create,
  data
});

export default {
  create
};