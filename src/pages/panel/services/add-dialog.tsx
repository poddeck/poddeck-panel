import {useTranslation} from "react-i18next";
import * as React from "react";
import {useState} from "react";
import ServiceService from "@/api/services/service-service";
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
import {toast} from "sonner";

export default function ServiceAddDialog(
  {
    setOpen,
  }: {
    setOpen: (open: boolean) => void;
  }
) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [code, setCode] = useState("");
  const [loading, setLoading] = React.useState(false);
  const handleCreateService = async () => {
    setLoading(true);
    const response = await ServiceService.create({raw: code});
    setLoading(false);
    if (!response.success) {
      toast.error(t("panel.page.services.add.dialog.failure"), {
        position: "top-right",
      });
      return;
    }
    toast.success(t("panel.page.services.add.dialog.successful"), {
      position: "top-right",
    });
    setOpen(false);
  };
  return (
    <DialogContent className="sm:max-w-[1000px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.page.services.add.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.page.services.add.dialog.description")}
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
            {t("panel.page.services.add.dialog.cancel")}
          </Button>
        </DialogClose>
        <Button onClick={handleCreateService} disabled={loading}>
          {t("panel.page.services.add.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}