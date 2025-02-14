type DuaLine = {
  [key: string]: string;
  repetitions_number: number | null;
  begin_of_section: boolean;
  type: string;
};

type Dua = {
  route_name: string;
  image_url: string;
  languages: string[];
  title: { [key: string]: string };
  description: { [key: string]: string | null };
  narratedBy: { [key: string]: string | null };
  tags: string[];
  lines: DuaLine[];
  recitations: DuaRecitation[];
};

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

type DuaRecitationDetail = {
  uuid: string;
  audio_low_quality_url: string;
  audio_high_quality_url: string;
  duration_in_ms: number;
  startTimes: number[];
  reciter: Reciter;
};
