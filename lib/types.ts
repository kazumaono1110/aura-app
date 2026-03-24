export interface AuraResult {
  primary: string;
  secondary: string;
  tertiary: string;
  emotion_label: string;
  comment: string;
  lucky_action: string;
  compatible_color: string;
  compatible_hex: string;
  compatible_message: string;
  personality_mode: string;
  personality_detail: string;
  advice: string;
  trend: string;
}

export interface AuraEntry extends AuraResult {
  id: string;
  input: string;
  date: string;
  user_id?: string;
}

export interface AuraHistoryItem {
  date: string;
  emotion_label: string;
  input: string;
  primary_color: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
}

export interface DateTimeContext {
  dayOfWeek: string;
  timeOfDay: string;
  season: string;
}

export interface GenerateRequest {
  mood: string;
  history?: AuraHistoryItem[];
  weather?: WeatherData | null;
  datetime: DateTimeContext;
}
