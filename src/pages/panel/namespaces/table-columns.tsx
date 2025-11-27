import {type ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {type Namespace} from "@/api/services/namespace-service"
import {t} from "@/locales/i18n";
import {NamespaceAge, NamespacesActionDropdown} from "./table-components.tsx";

export const columns: ColumnDef<Namespace, unknown>[] = [
  {
    header: "panel.page.namespaces.column.name",
    accessorKey: "name",
  },
  {
    header: "panel.page.namespaces.column.status",
    accessorKey: "status",
    cell: ({row}) => {
      if (row.original.status.toLowerCase() === "active") {
        return <Badge
          className="px-4 py-2 -my-2 bg-green-600/10 text-green-600">
          {t("panel.page.namespaces.status.active")}
        </Badge>;
      } else {
        return <Badge className="px-4 py-2 -my-2 bg-rose-600/10 text-rose-600">
          {t("panel.page.namespaces.status.terminating")}
        </Badge>;
      }
    },
  },
  {
    header: "panel.page.namespaces.column.age",
    accessorKey: "age",
    cell: ({row}) => {
      return <NamespaceAge age={row.original.age}/>
    },
  },
  {
    id: "actions",
    header: "",
    maxSize: 60,
    enableHiding: false,
    cell: ({row}) => {
      return <NamespacesActionDropdown row={row}/>
    },
  },
];