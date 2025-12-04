import PanelPage from "@/layouts/panel"
import DeploymentPageBreadcrumb from "@/pages/panel/deployment/breadcrumb.tsx";
import DeploymentPageHeader from "@/pages/panel/deployment/header.tsx";
import useDeployment from "@/hooks/use-deployment";
import React, {useState} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import {useTheme} from "next-themes";

export default function DeploymentPodsPage() {
  const deployment = useDeployment();
  const {theme} = useTheme();
  const [code, setCode] = useState("");

  React.useEffect(() => {
    if (deployment && code === "") {
      setCode(deployment.raw);
    }
  }, [deployment]);

  return (
    <PanelPage breadcrumb={DeploymentPageBreadcrumb()} layout={false}>
      <DeploymentPageHeader deployment={deployment} page="edit"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="bg-sidebar aspect-video rounded-xl p-4">
          <AceEditor
            mode="yaml"
            theme={theme === "light" ? "tomorrow" : "tomorrow_night"}
            value={code}
            onChange={(newValue: React.SetStateAction<string>) => setCode(newValue)}
            name="yaml_editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="100%"
            fontSize={14}
            showPrintMargin={false}
            setOptions={{
              useWorker: true,
              tabSize: 2,
            }}
            className={"rounded-xl"}
          />
        </div>
      </div>
    </PanelPage>
  )
}
