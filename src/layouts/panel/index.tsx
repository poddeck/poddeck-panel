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
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
