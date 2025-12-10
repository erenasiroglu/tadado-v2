import i18n from "@/utils/i18n";
import { supabase } from "./supabase";
import type { Card, CardType, Game, GameSession, GameSettings, GameAction } from "@/types/game";

export const gameService = {
  // Tüm kart tiplerini getir
  async getCardTypes(): Promise<CardType[]> {
    const { data, error } = await supabase.from("card_types").select("*").order("name");

    if (error) {
      console.error("Error fetching card types:", error);
      throw error;
    }

    return data || [];
  },

  // Belirli tip için tüm kartları getir (dil desteği ile)
  async getCardsByType(cardTypeId: string): Promise<Card[]> {
    const currentLanguage = i18n.language || "en";
    const isTurkish = currentLanguage === "tr";

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("card_type_id", cardTypeId)
      .order("word");

    if (error) {
      console.error("Error fetching cards:", error);
      throw error;
    }

    // forbidden_words JSONB'den array'e çevir ve dile göre seç
    return (data || []).map((card) => {
      // Dil'e göre kelime seç (Türkçe varsa kullan, yoksa İngilizce)
      const word = isTurkish && card.word_tr ? card.word_tr : card.word;

      // Dil'e göre yasaklı kelimeler seç
      let forbiddenWords: string[] = [];
      if (isTurkish && card.forbidden_words_tr) {
        forbiddenWords = Array.isArray(card.forbidden_words_tr)
          ? card.forbidden_words_tr
          : JSON.parse(card.forbidden_words_tr || "[]");
      } else {
        forbiddenWords = Array.isArray(card.forbidden_words)
          ? card.forbidden_words
          : JSON.parse(card.forbidden_words || "[]");
      }

      return {
        ...card,
        word,
        forbidden_words: forbiddenWords,
      };
    });
  },

  // Yeni oyun oluştur
  async createGame(settings: GameSettings): Promise<{ game: Game; session: GameSession }> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Oyun oluştur
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert({
        user_id: user.id,
        card_type_id: settings.cardTypeId,
        team1_name: settings.team1,
        team2_name: settings.team2,
        game_time: settings.gameTime,
        rounds: settings.rounds,
        pass_limit: settings.passLimit,
        status: "active",
      })
      .select()
      .single();

    if (gameError) {
      console.error("Error creating game:", gameError);
      throw gameError;
    }

    // Oyun seansı oluştur
    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        game_id: game.id,
        current_team: 0,
        current_round: 1,
        current_card_index: 0,
        team1_score: 0,
        team2_score: 0,
        pass_count: 0,
        time_left: settings.gameTime,
        used_card_ids: [],
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Error creating game session:", sessionError);
      throw sessionError;
    }

    return {
      game,
      session: {
        ...session,
        used_card_ids: Array.isArray(session.used_card_ids)
          ? session.used_card_ids
          : JSON.parse(session.used_card_ids || "[]"),
      },
    };
  },

  // Oyun durumunu güncelle
  async updateGameSession(gameId: string, sessionData: Partial<GameSession>): Promise<GameSession> {
    const updateData: any = {
      ...sessionData,
      updated_at: new Date().toISOString(),
    };

    // used_card_ids'i JSONB formatına çevir
    if (sessionData.used_card_ids) {
      updateData.used_card_ids = sessionData.used_card_ids;
    }

    const { data, error } = await supabase
      .from("game_sessions")
      .update(updateData)
      .eq("game_id", gameId)
      .select()
      .single();

    if (error) {
      console.error("Error updating game session:", error);
      throw error;
    }

    return {
      ...data,
      used_card_ids: Array.isArray(data.used_card_ids)
        ? data.used_card_ids
        : JSON.parse(data.used_card_ids || "[]"),
    };
  },

  // Oyun durumunu getir
  async getGameSession(gameId: string): Promise<GameSession | null> {
    const { data, error } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("game_id", gameId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      console.error("Error fetching game session:", error);
      throw error;
    }

    return {
      ...data,
      used_card_ids: Array.isArray(data.used_card_ids)
        ? data.used_card_ids
        : JSON.parse(data.used_card_ids || "[]"),
    };
  },

  // Oyunu tamamla
  async completeGame(gameId: string): Promise<void> {
    const { error } = await supabase
      .from("games")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", gameId);

    if (error) {
      console.error("Error completing game:", error);
      throw error;
    }
  },

  // Oyun aksiyonu kaydet (Correct, Pass, TaDo)
  async logGameAction(
    gameId: string,
    action: {
      roundNumber: number;
      teamNumber: number;
      actionType: "correct" | "pass" | "tado";
      cardId: string | null;
      cardWord: string | null;
      scoreBefore: number;
      scoreAfter: number;
    }
  ): Promise<GameAction> {
    const { data, error } = await supabase
      .from("game_actions")
      .insert({
        game_id: gameId,
        round_number: action.roundNumber,
        team_number: action.teamNumber,
        action_type: action.actionType,
        card_id: action.cardId,
        card_word: action.cardWord,
        score_before: action.scoreBefore,
        score_after: action.scoreAfter,
      })
      .select()
      .single();

    if (error) {
      console.error("Error logging game action:", error);
      throw error;
    }

    return data;
  },
};
