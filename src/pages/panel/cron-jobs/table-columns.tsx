import {type ColumnDef} from "@tanstack/react-table";
import {type CronJob} from "@/api/services/cron-job-service"
import {
  CronJobsActionDropdown,
  CronJobsSuspendStatus
} from "./table-components.tsx";
import {Age} from "@/components/age/age.tsx";

export const columns: ColumnDef<CronJob, unknown>[] = [
  {
    header: "panel.page.cron-jobs.column.namespace",
    accessorKey: "namespace",
    filterFn: 'equals',
  },
  {
    header: "panel.page.cron-jobs.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.cron-jobs.column.schedule",
    accessorKey: "schedule",
  },
  {
    header: "panel.page.cron-jobs.column.timezone",
    accessorKey: "time_zone",
  },
  {
    header: "panel.page.cron-jobs.column.suspend",
    accessorKey: "suspend",
    cell: ({row}) => {
      return <CronJobsSuspendStatus suspend={row.original.suspend}/>
    },
  },
  {
    header: "panel.page.cron-jobs.column.active",
    accessorKey: "active",
  },
  {
    header: "panel.page.cron-jobs.column.last.schedule",
    accessorKey: "last_schedule_time",
    cell: ({row}) => {
      return <Age age={Date.now() - row.original.last_schedule_time}/>
    },
  },
  {
    header: "panel.page.cron-jobs.column.age",
    accessorKey: "age",
    cell: ({row}) => {
      return <Age age={row.original.age}/>
    },
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    enableHiding: false,
    cell: ({row}) => {
      return <CronJobsActionDropdown cronJob={row.original}/>
    },
  },
];