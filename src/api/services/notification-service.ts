import client from "../client";

export type NotificationType = "REPORT" | "SUCCESS" | "WARNING" | "ERROR";

export type NotificationState = "UNSEEN" | "SEEN";

export type Notification = {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  state: NotificationState;
  created_at: number;
  cluster_found: boolean;
  cluster_name?: string;
  cluster_icon?: string;
};

export type NotificationListResponse = {
  notifications: Notification[];
};

export interface NotificationSeenRequest {
  notification: string;
}

export const NotificationApi = {
  ListAll: "/notifications/all/",
  ListCluster: "/notifications/cluster/",
  Seen: "/notification/seen/",
} as const;

const listAll = () => client.get<NotificationListResponse>({
  url: NotificationApi.ListAll,
});
const listCluster = () => client.get<NotificationListResponse>({
  url: NotificationApi.ListCluster,
});
const listSpecificCluster = (clusterId: string) => client.get<NotificationListResponse>(
  {
    url: NotificationApi.ListCluster,
    headers: {
      Cluster: clusterId,
    },
  }
);
const markSeen = (data: NotificationSeenRequest) => client.post<void>({
  url: NotificationApi.Seen,
  data,
});

export default {
  listAll,
  listCluster,
  listSpecificCluster,
  markSeen,
};
