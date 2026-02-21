import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en";
import ru from "./locales/ru";
import az from "./locales/az";

export const LANGUAGES = [
  { code: "en", label: "EN", nativeLabel: "English" },
  { code: "ru", label: "RU", nativeLabel: "Русский" },
  { code: "az", label: "AZ", nativeLabel: "Azərbaycan" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      az: { translation: az },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "ru", "az"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "nutriflow_lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
