export const daysOfWeek = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
] as const;

export type DayOfWeek = typeof daysOfWeek[number];

export type SessionSchedule =
  | { type: "once"; date: string }
  | { type: "recurring"; day: DayOfWeek };

export interface PlannedSession {
  id: string;
  user_id: string;
  code: string;
  name: string;
  dua_slug: string;
  dua_title: Record<string, string>;
  schedule: SessionSchedule;
  created_at: string;
}

const everyPrefix: Record<string, string> = {
  en: "Every", de: "Jeden", ar: "كل", fa: "هر", tr: "Her",
};

// day index for a known Mon–Sun week (Jan 6–12 2025)
const dayIndex: Record<string, number> = {
  monday: 6, tuesday: 7, wednesday: 8, thursday: 9,
  friday: 10, saturday: 11, sunday: 12,
};

export function formatSchedule(schedule: SessionSchedule, locale = "en"): string {
  if (schedule.type === "once") {
    return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(schedule.date));
  }
  const date = new Date(2025, 0, dayIndex[schedule.day]);
  const dayName = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  const prefix = everyPrefix[locale] ?? everyPrefix.en;
  return `${prefix} ${dayName}`;
}
