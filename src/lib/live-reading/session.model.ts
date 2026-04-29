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

export function formatSchedule(schedule: SessionSchedule): string {
  if (schedule.type === "once") {
    return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(schedule.date));
  }
  const day = schedule.day;
  return `Every ${day.charAt(0).toUpperCase()}${day.slice(1)}`;
}
