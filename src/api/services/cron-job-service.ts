import client from "../client";

export type CronJob = {
  name: string;
  namespace: string;
  schedule: string;
  time_zone: string;
  suspend: boolean;
  concurrency_policy: string;
  successful_jobs_history_limit: number;
  failed_jobs_history_limit: number;
  active: number;
  last_schedule_time: number;
  last_successful_time: number;
  age: number;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  events: CronJobEvent[];
  raw: string;
};

export type CronJobEvent = {
  type: string;
  reason: string;
  message: string;
  timestamp: number;
  source: string;
};

export type CronJobListResponse = {
  cron_jobs: CronJob[];
  success?: boolean;
};

export interface CronJobFindRequest {
  namespace: string;
  cron_job: string;
}

export type CronJobFindResponse = {
  success: boolean;
  cron_job: CronJob;
};

export interface CronJobCreateRequest {
  raw: string;
}

export type CronJobCreateResponse = {
  success: boolean;
  namespace: string;
  cron_job: string;
};

export interface CronJobDeleteRequest {
  namespace: string;
  cron_job: string;
}

export type CronJobDeleteResponse = {
  success: boolean;
};

export interface CronJobSuspendRequest {
  namespace: string;
  cron_job: string;
  suspend: boolean;
}

export type CronJobSuspendResponse = {
  success: boolean;
};

export interface CronJobRunRequest {
  namespace: string;
  cron_job: string;
}

export type CronJobRunResponse = {
  success: boolean;
};

export interface CronJobEditRequest {
  namespace: string;
  cron_job: string;
  raw: string;
}

export type CronJobEditResponse = {
  success: boolean;
};

export const CronJobApi = {
  List: "/cron-jobs/",
  Find: "/cron-job/find/",
  Create: "/cron-job/create/",
  Delete: "/cron-job/delete/",
  Suspend: "/cron-job/suspend/",
  Run: "/cron-job/run/",
  Edit: "/cron-job/edit/",
} as const;

const list = () => client.get<CronJobListResponse>({ url: CronJobApi.List });

const listCluster = (clusterId: string) =>
  client.get<CronJobListResponse>({
    url: CronJobApi.List,
    headers: { Cluster: clusterId },
  });

const find = (data: CronJobFindRequest) =>
  client.post<CronJobFindResponse>({ url: CronJobApi.Find, data });

const create = (data: CronJobCreateRequest) =>
  client.post<CronJobCreateResponse>({ url: CronJobApi.Create, data });

const remove = (data: CronJobDeleteRequest) =>
  client.post<CronJobDeleteResponse>({ url: CronJobApi.Delete, data });

const suspend = (data: CronJobSuspendRequest) =>
  client.post<CronJobSuspendResponse>({ url: CronJobApi.Suspend, data });

const run = (data: CronJobRunRequest) =>
  client.post<CronJobRunResponse>({ url: CronJobApi.Run, data });

const edit = (data: CronJobEditRequest) =>
  client.post<CronJobEditResponse>({ url: CronJobApi.Edit, data });

export default {
  list,
  listCluster,
  find,
  create,
  remove,
  suspend,
  run,
  edit,
};
