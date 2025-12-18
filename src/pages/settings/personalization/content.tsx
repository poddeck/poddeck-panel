import {MonitorCog, Moon, Sun} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useTheme} from "next-themes";

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils.ts";

function LanguageOption(
  {
    id,
    value,
    flag,
    label,
    selected,
  }: {
    id: string;
    value: string;
    flag: string;
    label: string;
    selected: boolean;
  }
) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "cursor-pointer rounded-2xl border p-6 transition-all",
        "flex flex-col items-center justify-center gap-3",
        "hover:border-primary",
        selected && "border-primary ring-2 ring-primary/30"
      )}
    >
      <RadioGroupItem value={value} id={id} className="sr-only"/>
      <span className="text-5xl leading-none">{flag}</span>
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
    </Label>
  );
}


function ThemeOption(
  {
    id,
    value,
    icon: Icon,
    label,
    selected,
  }: {
    id: string;
    value: string;
    icon: React.ElementType;
    label: string;
    selected: boolean;
  }) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "cursor-pointer rounded-2xl border p-6 transition-all",
        "flex flex-col items-center justify-center gap-3",
        "hover:border-primary",
        selected && "border-primary ring-2 ring-primary/30"
      )}
    >
      <RadioGroupItem value={value} id={id} className="sr-only"/>
      <Icon className="size-15"/>
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
    </Label>
  );
}

export default function PersonalizationPageContent() {
  const {t, i18n} = useTranslation();
  const {theme, setTheme} = useTheme();

  const language = i18n.resolvedLanguage || "en_US";

  return (
    <div className="space-y-6">
      <div>
        <div className="border-b-1 border-secondary pb-2 mb-4 w-full">
          <span>{t("panel.sidebar.language")}</span>
        </div>

        <RadioGroup
          value={language}
          onValueChange={i18n.changeLanguage}
          className="grid grid-cols-2 gap-6"
        >
          <LanguageOption
            id="lang-en"
            value="en_US"
            flag="🇺🇸"
            label="English"
            selected={language === "en_US"}
          />

          <LanguageOption
            id="lang-de"
            value="de_DE"
            flag="🇩🇪"
            label="Deutsch"
            selected={language === "de_DE"}
          />
        </RadioGroup>
      </div>

      <div>
        <div className="border-b-1 border-secondary pb-2 mb-4 w-full">
          <span>{t("panel.sidebar.theme")}</span>
        </div>

        <RadioGroup
          value={theme}
          onValueChange={setTheme}
          className="grid grid-cols-3 gap-6"
        >
          <ThemeOption
            id="theme-system"
            value="system"
            icon={MonitorCog}
            label={t("panel.sidebar.theme.system")}
            selected={theme === "system"}
          />

          <ThemeOption
            id="theme-dark"
            value="dark"
            icon={Moon}
            label={t("panel.sidebar.theme.dark")}
            selected={theme === "dark"}
          />

          <ThemeOption
            id="theme-light"
            value="light"
            icon={Sun}
            label={t("panel.sidebar.theme.light")}
            selected={theme === "light"}
          />
        </RadioGroup>
      </div>
    </div>
  );
}
