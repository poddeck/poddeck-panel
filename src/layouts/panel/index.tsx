import {AppSidebar, SidebarInset, SidebarProvider} from "./sidebar";
import {AppHeader} from "./header";

interface PanelPageProps {
  title?: string;
  breadcrumb?: React.ReactNode;
  layout?: boolean
  children?: React.ReactNode;
}

export default function PanelPage(
  {
    title,
    breadcrumb,
    layout,
    children
  }: PanelPageProps
) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <AppHeader title={title} breadcrumb={breadcrumb}/>
        <div className={layout == false ? "" : "w-[min(1500px,95%)] mx-auto flex flex-col flex-1"}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
