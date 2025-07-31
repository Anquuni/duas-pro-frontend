export type DuaLine = {
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
  "DUA",
  "ZIYARAT",
  "MUNAJAT",
  "AMAL",
  "SALAWAT",
  "SALAT",
  "TASBIHAT"
] as const;

export type DuaType = typeof duaTypes[number];

export const narrators = [
  "PROPHET_MUHAMMAD",
  "SAYYIDA_FATIMA",
  "IMAM_ALI",
  "IMAM_HASAN",
  "IMAM_HUSSAIN",
  "IMAM_ALI_ZAIN_UL_ABIDIEN",
  "IMAM_MUHAMMAD_AL_BAQIR",
  "IMAM_JAAFAR_AS_SADIQ",
  "IMAM_MUSA_AL_KADHIM",
  "IMAM_ALI_AL_RIDHA",
  "IMAM_MUHAMMAD_AL_JAWAD",
  "IMAM_ALI_AL_HADI",
  "IMAM_HASAN_AL_ASKARI",
  "IMAM_MAHDI"
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
