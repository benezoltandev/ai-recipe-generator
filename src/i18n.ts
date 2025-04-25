import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import huTranslation from "./locales/hu.json";
import deTranslation from "./locales/de.json";

const isProduction = import.meta.env.MODE === "production";

const resources = {
  en: { translation: enTranslation },
  hu: { translation: huTranslation },
  de: { translation: deTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: isProduction ? undefined : resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: isProduction
      ? {
          loadPath:
            "https://<your-s3-bucket-name>.s3.amazonaws.com/locales/{{lng}}.json",
        }
      : undefined,
  });

export default i18n;
