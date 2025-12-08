import client from "../client";

export type Event = {
  name: string;
  namespace: string;
  reason: string;
  message: string;
  type: string;
  involved_kind: string;
  involved_name: string;
  first_timestamp: number;
  last_timestamp: number;
  count: number;
}

export interface EventListRequest {
  start: number;
  end: number;
  limit: number;
}

export type EventListResponse = {
  events: Event[];
}

export const EventApi = {
  List: "/events/",
} as const;

const list = (data: EventListRequest) => client.post<EventListResponse>({
  url: EventApi.List,
  data
});

export default {
  list,
};