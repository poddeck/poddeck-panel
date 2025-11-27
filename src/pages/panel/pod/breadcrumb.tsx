import {useTranslation} from "react-i18next";
import {useSearchParams} from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";

export default function PodPageBreadcrumb() {
  const {t} = useTranslation();
  const [searchParams] = useSearchParams();
  const podFromQuery = searchParams.get("pod");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='/pods/'>{t("panel.page.pods.title")}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{podFromQuery}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}