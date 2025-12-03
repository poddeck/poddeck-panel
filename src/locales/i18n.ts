import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import en_US from "./lang/en_US";
import de_DE from "./lang/de_DE";
import es_ES from "./lang/es_ES";


const defaultLng = localStorage.getItem("i18nextLng") || "en_US";
document.documentElement.lang = defaultLng;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: defaultLng,
    fallbackLng: "en_US",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en_US: {translation: en_US},
      de_DE: {translation: de_DE},
      es_ES: {translation: es_ES},
    },
  });

export const {t} = i18n;