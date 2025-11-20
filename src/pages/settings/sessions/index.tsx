import type {SettingsPage} from "../settings-page.tsx";
import {Shell} from "lucide-react";
import SessionsPageContent from "./content.tsx";

export const SessionsPage: SettingsPage = {
  key: "sessions",
  title: "settings.sessions.title",
  icon: Shell,
  component: SessionsPageContent,
};
