import PanelPage from "@/layouts/panel"
import {
  Breadcrumb,
  BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {useTranslation} from "react-i18next";
import {useSearchParams} from "react-router-dom";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";

function PodPageBreadcrumb() {
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

const tabs = [
  {
    name: 'Explore',
    value: 'explore'
  },
  {
    name: 'Favorites',
    value: 'favorites'
  },
  {
    name: 'Surprise Me',
    value: 'surprise'
  }
]

export default function PodPage() {
  const [searchParams] = useSearchParams();
  const podFromQuery = searchParams.get("pod");
  return (
    <PanelPage breadcrumb={PodPageBreadcrumb()} layout={false}>
      <div className="w-full bg-sidebar">
        <div className="w-[min(1500px,95%)] mx-auto flex flex-col flex-1 pt-7">
          <span>{podFromQuery}</span>
          <div className='w-full max-w-md pt-5'>
            <Tabs defaultValue='explore' className='gap-4'>
              <TabsList className='bg-transparent rounded-none border-b p-0'>
                {tabs.map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='bg-transparent! data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </PanelPage>
  )
}
