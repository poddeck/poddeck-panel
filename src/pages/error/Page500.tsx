import ErrorLayout from "./components/ErrorLayout";
import {useTranslation} from "react-i18next";

export default function Page500() {
  const {t} = useTranslation();
  return (
    <ErrorLayout
      title={t("error.500.title")}
      description={t("error.500.description")}
    />
  );
}