import type {SettingsPage} from "../settings-page.tsx";
import {CircleUserRound} from "lucide-react";
import AccountPageContent from "./content.tsx";

export const AccountPage: SettingsPage = {
  key: "account",
  title: "settings.account.title",
  icon: CircleUserRound,
  component: AccountPageContent,
};
