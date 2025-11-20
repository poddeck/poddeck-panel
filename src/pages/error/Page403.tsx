import ErrorLayout from "./components/ErrorLayout";
import {useTranslation} from "react-i18next";

export default function Page403() {
  const {t} = useTranslation();
  return (
    <ErrorLayout
      title={t("error.403.title")}
      description={t("error.403.description")}
    />
  );
}