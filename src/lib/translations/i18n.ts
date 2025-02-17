import { settingsStore } from "$lib/settings/settings.store";
import { derived } from "svelte/store";
import translations from "./translations";

export const locales = Object.keys(translations);

// Usage Example:
// <h1>{$t("homepage.title")}!</h1>
// <p>{@html $t("homepage.welcome", { name: "Jane Doe" })}!</p>

function translate(locale: string, key: string, vars) {
  // Fehlerbehandlung, falls keine gültigen Keys oder Locale angegeben werden
  if (!key) throw new Error("no key provided to $t()");
  if (!locale) throw new Error(`no translation for key "${key}"`);

  // Übersetzung aus dem translations-Objekt abrufen
  let text = translations[locale][key];

  if (!text) throw new Error(`no translation found for ${locale}.${key}`);

  // Ersetze Variablen in der Übersetzung
  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });

  return text;
}

// Verwenden des systemlanguage-Werts aus settingsstore anstelle von locale
export const t = derived(
  settingsStore,
  ($settingsStore) =>
    (key: string, vars = {}) =>
      translate($settingsStore.systemLanguage, key, vars),
);
