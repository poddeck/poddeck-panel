import type {SettingsPage} from "../settings-page.tsx";
import {Pencil} from "lucide-react";
import PersonalizationPageContent from "./content.tsx";

export const PersonalizationPage: SettingsPage = {
  key: "personalization",
  title: "settings.personalization.title",
  icon: Pencil,
  component: PersonalizationPageContent,
};
