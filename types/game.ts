export interface CardType {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  created_at: string;
}

export interface Card {
  id: string;
  card_type_id: string;
  word: string;
  forbidden_words: string[];
  word_tr?: string | null;
  forbidden_words_tr?: string[] | null;
  created_at: string;
}

export interface Game {
  id: string;
  user_id: string;
  card_type_id: string;
  team1_name: string;
  team2_name: string;
  game_time: number;
  rounds: number;
  pass_limit: number;
  status: "active" | "completed" | "paused";
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  game_id: string;
  current_team: number;
  current_round?: number;
  current_card_index: number;
  team1_score: number;
  team2_score: number;
  pass_count: number;
  time_left: number;
  used_card_ids: string[];
  updated_at: string;
}

export interface GameSettings {
  cardTypeId: string;
  team1: string;
  team2: string;
  gameTime: number;
  rounds: number;
  passLimit: number;
}

export interface GameAction {
  id: string;
  game_id: string;
  round_number: number;
  team_number: number;
  action_type: "correct" | "pass" | "tado";
  card_id: string | null;
  card_word: string | null;
  score_before: number;
  score_after: number;
  created_at: string;
}
