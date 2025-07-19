import { browser } from "$app/environment";
import { writable } from "svelte/store";

export type Theme = "light" | "dark";
export type LanguageCode = string;

export interface LanguageItem {
  value: LanguageCode;
  label: string;
  rtl: boolean;
}

interface Settings {
  theme: Theme;
  systemLanguage: LanguageCode;
  primaryDuaFontSize: number;
  secondaryDuaFontSize: number;
  tertiaryDuaFontSize: number;
}

export const languages: LanguageItem[] = [
  { value: "ar", label: "Arabic", rtl: true },
  { value: "translit", label: "Transliteration", rtl: false },
  { value: "en", label: "English", rtl: false },
  { value: "de", label: "German", rtl: false },
];

// export const languages: LanguageItem[] = [
//   { value: "am", label: "Amharic", rtl: false },
//   { value: "ar", label: "Arabic", rtl: true },
//   { value: "az", label: "Azerbaijani", rtl: false },
//   { value: "be", label: "Belarusian", rtl: false },
//   { value: "bg", label: "Bulgarian", rtl: false },
//   { value: "bn", label: "Bengali", rtl: false },
//   { value: "bs", label: "Bosnian", rtl: false },
//   { value: "cs", label: "Czech", rtl: false },
//   { value: "de", label: "German", rtl: false },
//   { value: "dv", label: "Dhivehi", rtl: true },
//   { value: "en", label: "English", rtl: false },
//   { value: "es", label: "Spanish", rtl: false },
//   { value: "fa", label: "Persian", rtl: true },
//   { value: "fr", label: "French", rtl: false },
//   { value: "gu", label: "Gujarati", rtl: false },
//   { value: "ha", label: "Hausa", rtl: false },
//   { value: "hi", label: "Hindi", rtl: false },
//   { value: "id", label: "Indonesian", rtl: false },
//   { value: "it", label: "Italian", rtl: false },
//   { value: "ja", label: "Japanese", rtl: false },
//   { value: "ko", label: "Korean", rtl: false },
//   { value: "ku", label: "Kurdish", rtl: true },
//   { value: "ml", label: "Malayalam", rtl: false },
//   { value: "ms", label: "Malay", rtl: false },
//   { value: "nl", label: "Dutch", rtl: false },
//   { value: "no", label: "Norwegian", rtl: false },
//   { value: "pl", label: "Polish", rtl: false },
//   { value: "ps", label: "Pashto", rtl: true },
//   { value: "pt", label: "Portuguese", rtl: false },
//   { value: "ro", label: "Romanian", rtl: false },
//   { value: "ru", label: "Russian", rtl: false },
//   { value: "sd", label: "Sindhi", rtl: true },
//   { value: "so", label: "Somali", rtl: false },
//   { value: "sq", label: "Albanian", rtl: false },
//   { value: "sv", label: "Swedish", rtl: false },
//   { value: "sw", label: "Swahili", rtl: false },
//   { value: "ta", label: "Tamil", rtl: false },
//   { value: "te", label: "Telugu", rtl: false },
//   { value: "tg", label: "Tajik", rtl: false },
//   { value: "th", label: "Thai", rtl: false },
//   { value: "translit", label: "Transliteration", rtl: false },
//   { value: "tr", label: "Turkish", rtl: false },
//   { value: "tt", label: "Tatar", rtl: false },
//   { value: "ug", label: "Uyghur", rtl: true },
//   { value: "ur", label: "Urdu", rtl: true },
//   { value: "uz", label: "Uzbek", rtl: false },
//   { value: "zh", label: "Chinese", rtl: false },
//   { value: "ca", label: "Catalan", rtl: false },
//   { value: "da", label: "Danish", rtl: false },
//   { value: "et", label: "Estonian", rtl: false },
//   { value: "fi", label: "Finnish", rtl: false },
//   { value: "el", label: "Greek", rtl: false },
//   { value: "hu", label: "Hungarian", rtl: false },
//   { value: "is", label: "Icelandic", rtl: false },
//   { value: "ga", label: "Irish", rtl: false },
//   { value: "lv", label: "Latvian", rtl: false },
//   { value: "lt", label: "Lithuanian", rtl: false },
//   { value: "mk", label: "Macedonian", rtl: false },
//   { value: "mt", label: "Maltese", rtl: false },
//   { value: "sr", label: "Serbian", rtl: false },
//   { value: "sk", label: "Slovak", rtl: false },
//   { value: "sl", label: "Slovenian", rtl: false },
//   { value: "cy", label: "Welsh", rtl: false }
// ];

export const nonTranslitLanguages = languages.filter((l) => l.value !== "translit");

function loadSettings(): Settings {
  if (browser) {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  }
  return {
    theme: browser && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    systemLanguage: "en",
    primaryDuaFontSize: 24,
    secondaryDuaFontSize: 14,
    tertiaryDuaFontSize: 20,
  };
}

const initialSettings: Settings = loadSettings();

export const settingsStore = writable<Settings>(initialSettings);

if (browser) {
  settingsStore.subscribe((settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
    document.documentElement.style.setProperty("--primary-dua-font-size", settings.primaryDuaFontSize + "px");
    document.documentElement.style.setProperty("--secondary-dua-font-size", settings.secondaryDuaFontSize + "px");
    document.documentElement.style.setProperty("--tertiary-dua-font-size", settings.tertiaryDuaFontSize + "px");
  });
}

export function getLanguageLabel(code: LanguageCode): string {
  return languages.find((lang) => lang.value === code)?.label || code;
}

export function stringToTheme(value: string): Theme {
  return value === "dark" ? "dark" : "light";
}
