import {useTranslation} from "react-i18next";
import {Link, useSearchParams} from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";

export default function StatefulSetPageBreadcrumb() {
  const {t} = useTranslation();
  const [searchParams] = useSearchParams();
  const queryStatefulSet = searchParams.get("stateful-set");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/stateful-sets/">{t("panel.page.stateful-sets.title")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{queryStatefulSet}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}