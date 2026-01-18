import {useTranslation} from "react-i18next";
import {Link, useSearchParams} from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";

export default function DaemonSetPageBreadcrumb() {
  const {t} = useTranslation();
  const [searchParams] = useSearchParams();
  const queryDaemonSet = searchParams.get("daemon-set");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/daemon-sets/">{t("panel.page.daemon-sets.title")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{queryDaemonSet}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}