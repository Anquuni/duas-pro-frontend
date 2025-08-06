export type DuaLine = {
  id: number;
  repetitions_number: number | null;
  begin_of_section: boolean;
  type: string;
} & {
  [langCode: string]: string;
};

export type Dua = {
  route_name: string;
  image_url: string;
  languages: string[];
  id: { [key: string]: string };
  title: { [key: string]: string };
  description: { [key: string]: string | null };
  seo_description: { [key: string]: string | null };
  word_count: { [key: string]: number | null };
  narrator: Narrator | null;
  tags: string[];
  lines: DuaLine[];
  recitations: DuaRecitation[];
  reciters: Reciter[];
};

export const duaTypes = [
  "dua",
  "ziyarat",
  // "munajat",
  // "amal",
  // "salawat",
  // "salat",
  // "tasbihat"
] as const;

export type DuaType = typeof duaTypes[number];

export const narrators = [
  "prophet-muhammad",
  "lady-fatimah",
  "imam-ali",
  "imam-hasan",
  "imam-hussain",
  "imam-sajjad",
  "imam-baqir",
  "imam-sadiq",
  "imam-kadhim",
  "imam-ridha",
  "imam-jawad",
  "imam-hadi",
  "imam-askari",
  "imam-mahdi"
] as const;

export type Narrator = typeof narrators[number];

export interface DuaRecitation {
  uuid: string;
  duration_in_ms: number;
  audio_low_quality_url?: string;
  audio_high_quality_url?: string;
  reciters: Reciter;
}

export interface Reciter {
  full_name_tl: string;
  full_name_ar: string;
  profile_image_url: string;
}

export type DuaRecitationDetail = {
  uuid: string;
  audio_low_quality_url: string;
  audio_high_quality_url: string;
  duration_in_ms: number;
  startTimes: number[];
  reciter: Reciter;
};
