import {AppSidebar, SidebarInset, SidebarProvider} from "./sidebar";
import {AppHeader} from "./header";

interface PanelPageProps {
  title: string;
  children?: React.ReactNode;
}

export default function PanelPage({title, children}: PanelPageProps) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <AppHeader title={title}/>
        <div className="w-[min(1400px,95%)] mx-auto mt-[5vh] flex flex-col flex-1">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
