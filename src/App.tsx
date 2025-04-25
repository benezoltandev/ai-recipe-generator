import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { useTranslation } from "react-i18next";
import CustomLanguageSelect from "./components/CustomLanguageSelect";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

const translateClient = new TranslateClient({ region: "us-east-1" });

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: "auto",
      TargetLanguageCode: targetLanguage,
    });
    const response = await translateClient.send(command);
    return response.TranslatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

function App() {
  const { t, i18n } = useTranslation();
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);

    const inputElement = document.getElementById("ingredients") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      const translatedText = await translateText(inputElement.value, lng);
      inputElement.value = translatedText;
    }
  };

  const languageOptions = [
    { code: "en", label: "English", flag: "/flags/en.png" },
    { code: "hu", label: "Hungarian", flag: "/flags/hu.png" },
    { code: "de", label: "German", flag: "/flags/de.png" },
  ];

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">{t("welcome")}</h1>
        <p className="description">{t("description")}</p>
        <div className="language-switcher">
          <CustomLanguageSelect
            options={languageOptions}
            onChange={changeLanguage}
            defaultValue={i18n.language}
          />
        </div>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            {t("generate")}
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>{t("loading")}</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;
