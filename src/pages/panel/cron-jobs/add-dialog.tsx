import {useTranslation} from "react-i18next";
import * as React from "react";
import {useState} from "react";
import CronJobService from "@/api/services/cron-job-service.ts";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import {useTheme} from "next-themes";
import {useRouter} from "@/routes/hooks";
import {toast} from "sonner";

export default function CronJobAddDialog() {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {replace} = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = React.useState(false);
  const handleCreateCronJob = async () => {
    setLoading(true);
    const response = await CronJobService.create({raw: code});
    setLoading(false);
    if (!response.success) {
      toast.error(t("panel.page.cron-jobs.add.dialog.failure"), {
        position: "top-right",
      });
      return;
    }
    toast.success(t("panel.page.cron-jobs.add.dialog.successful"), {
      position: "top-right",
    });
    replace("/cron-job/overview/?" +
      "cron-job=" + response.cron_job + "&namespace=" + response.namespace);
  };
  return (
    <DialogContent className="sm:max-w-[1000px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.cron-jobs.add.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.cron-jobs.add.dialog.description")}
        </DialogDescription>
      </DialogHeader>
      <div className="flex align-center justify-center">
        <AceEditor
          mode="yaml"
          theme={theme === "light" ? "tomorrow" : "tomorrow_night"}
          value={code}
          onChange={(newValue: React.SetStateAction<string>) => setCode(newValue)}
          name="yaml_editor"
          editorProps={{ $blockScrolling: true }}
          width="100%"
          fontSize={14}
          showPrintMargin={false}
          setOptions={{
            useWorker: true,
            tabSize: 2,
          }}
          className={"rounded-xl"}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">
            {t("panel.page.cron-jobs.add.dialog.cancel")}
          </Button>
        </DialogClose>
        <Button onClick={handleCreateCronJob} disabled={loading}>
          {t("panel.page.cron-jobs.add.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}