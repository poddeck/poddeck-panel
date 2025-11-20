import type {LucideIcon} from "lucide-react";

export interface SettingsPage {
  key: string;
  title: string;
  icon: LucideIcon;
  component: React.ComponentType;
}