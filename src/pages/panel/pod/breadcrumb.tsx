import {useTranslation} from "react-i18next";
import {Link, useSearchParams} from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";

export default function PodPageBreadcrumb() {
  const {t} = useTranslation();
  const [searchParams] = useSearchParams();
  const queryPod = searchParams.get("pod");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/pods/">{t("panel.page.pods.title")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{queryPod}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}