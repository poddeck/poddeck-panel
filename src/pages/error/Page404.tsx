import ErrorLayout from "./components/ErrorLayout";
import {useTranslation} from "react-i18next";

export default function Page404() {
  const {t} = useTranslation();
  return (
    <ErrorLayout
      title={t("error.404.title")}
      description={t("error.404.description")}
    />
  );
}