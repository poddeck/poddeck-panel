import type {SettingsPage} from "../settings-page.tsx";
import {Lock} from "lucide-react";
import SecurityPageContent from "./content.tsx";

export const SecurityPage: SettingsPage = {
  key: "security",
  title: "settings.security.title",
  icon: Lock,
  component: SecurityPageContent,
};
