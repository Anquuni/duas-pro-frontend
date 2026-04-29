import { settingsStore } from "$lib/settings/settings.store";
import { derived } from "svelte/store";
import ar from "./ar";
import de from "./de";
import en from "./en";
import fa from "./fa";
import tr from "./tr";

const translations: Record<string, Record<string, unknown>> = { ar, de, en, fa, tr };

export const locales = Object.keys(translations);

function translate(locale: string, key: string, vars: Record<string, string | number | null | undefined>): string {
  if (!key) throw new Error("no key provided to $t()");
  if (!locale) throw new Error(`no locale provided for key "${key}"`);

  const parts = key.split(".");
  let value: unknown = translations[locale];
  for (const part of parts) {
    value = (value as Record<string, unknown>)?.[part];
  }

  if (typeof value !== "string") throw new Error(`no translation found for ${locale}.${key}`);

  Object.keys(vars).forEach((k) => {
    value = (value as string).replace(new RegExp(`{{${k}}}`, "g"), String(vars[k] ?? ""));
  });

  return value as string;
}

export const t = derived(
  settingsStore,
  ($settingsStore) =>
    (key: string, vars: Record<string, string | number | null | undefined> = {}) =>
      translate($settingsStore.systemLanguage, key, vars),
);
