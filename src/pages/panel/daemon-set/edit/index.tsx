import PanelPage from "@/layouts/panel"
import DaemonSetPageBreadcrumb from "@/pages/panel/daemon-set/breadcrumb.tsx";
import DaemonSetPageHeader from "@/pages/panel/daemon-set/header.tsx";
import useDaemonSet from "@/hooks/use-daemon-set";
import React, {useState} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button.tsx";
import {Copy, Save} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Spinner} from "@/components/ui/spinner.tsx";
import DaemonSetService from "@/api/services/daemon-set-service.ts";
import {toast} from "sonner";

export default function DaemonSetEditPage() {
  const {t} = useTranslation();
  const daemonSet = useDaemonSet();
  const {theme} = useTheme();
  const [code, setCode] = useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (daemonSet && code === "") {
      setCode(daemonSet.raw);
    }
  }, [daemonSet]);

  async function save() {
    setLoading(true);
    await DaemonSetService.edit({
      namespace: daemonSet ? daemonSet.namespace : "",
      daemon_set: daemonSet ? daemonSet.name : "",
      raw: code
    });
    setLoading(false);
    toast.success(t("panel.page.daemon-set.edit.successful"), {
      position: "top-right",
    });
  }

  function copy() {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success(t("panel.page.daemon-set.edit.copy.successful"), {
          position: "top-right"
        });
      });
  }

  return (
    <PanelPage breadcrumb={DaemonSetPageBreadcrumb()} layout={false}>
      <DaemonSetPageHeader daemonSet={daemonSet} page="edit"/>
      <div className="w-[min(calc(1500px+var(--spacing)*8),95%)] mx-auto flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="bg-sidebar aspect-video rounded-xl p-4">
          <div className="flex justify-end items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={copy}
            >
              <Copy />
            </Button>
            <Button
              size='sm'
              className='bg-emerald-500 hover:bg-emerald-400'
              onClick={save}
              disabled={loading}
            >
              <Save/>
              {t("panel.page.daemon-set.edit.save")}
              {loading && <Spinner className="ml-2"></Spinner>}
            </Button>
          </div>
          <AceEditor
            mode="yaml"
            theme={theme === "light" ? "tomorrow" : "tomorrow_night"}
            value={code}
            onChange={(newValue: React.SetStateAction<string>) => setCode(newValue)}
            name="yaml_editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="calc(100% - var(--spacing) * 12)"
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
