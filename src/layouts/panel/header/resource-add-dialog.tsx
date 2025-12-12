import {useTranslation} from "react-i18next";
import * as React from "react";
import {
  DialogClose,
  DialogContent, DialogDescription, DialogFooter,
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
import {useState} from "react";
import {toast} from "sonner";
import ResourceService from "@/api/services/resource-service.ts";

export default function ResourceAddDialog() {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [code, setCode] = useState("");
  const [loading, setLoading] = React.useState(false);
  const handleCreateResource = async () => {
    setLoading(true);
    const response = await ResourceService.create({raw: code});
    setLoading(false);
    if (!response.success) {
      toast.error(t("panel.header.resources.add.dialog.failure"), {
        position: "top-right",
      });
      return;
    }
    toast.success(t("panel.header.resources.add.dialog.successful"), {
      position: "top-right",
    });
  };
  return (
    <DialogContent className="sm:max-w-[1000px]" onClick={(e) => e.stopPropagation()}
                   onMouseDown={(e) => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>{t("panel.header.resources.add.dialog.title")}</DialogTitle>
        <DialogDescription>
          {t("panel.header.resources.add.dialog.description")}
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
            {t("panel.header.resources.add.dialog.cancel")}
          </Button>
        </DialogClose>
        <Button onClick={handleCreateResource} disabled={loading}>
          {t("panel.header.resources.add.dialog.submit")}
          {loading && <Spinner className="ml-2"></Spinner>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}