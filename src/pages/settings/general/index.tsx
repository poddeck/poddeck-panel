import type {SettingsPage} from "../settings-page.tsx";
import {Settings} from "lucide-react";
import GeneralPageContent from "./content.tsx";

export const GeneralPage: SettingsPage = {
  key: "general",
  title: "settings.general.title",
  icon: Settings,
  component: GeneralPageContent,
};
