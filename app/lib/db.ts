import { createClient } from "@/app/lib/supabase/server";
import type {
  AgeGroup,
  AIAnalysis,
  Journal,
  Level,
  Question,
  UserProfile,
} from "@/app/lib/types";

export const DEFAULT_PROFILE: UserProfile = {
  ageGroup: "20대",
  baseLevel: 1,
  nickname: "친구",
};

export type AnalysisRow = {
  summary: string;
  tone_keywords: string[];
  message: string;
  is_safety_fallback: boolean;
};

type JournalRow = {
  id: string;
  question_id: string | null;
  question_content: string;
  level: Level;
  content: string;
  created_at: string;
  // journal_id가 PK인 1:1 관계라 객체로 오지만, 방어적으로 배열도 처리
  ai_analyses: AnalysisRow | AnalysisRow[] | null;
};

const JOURNAL_COLUMNS =
  "id, question_id, question_content, level, content, created_at, ai_analyses(summary, tone_keywords, message, is_safety_fallback)";

export function toAnalysis(row: AnalysisRow): AIAnalysis {
  return {
    summary: row.summary,
    toneKeywords: row.tone_keywords,
    message: row.message,
    isSafetyFallback: row.is_safety_fallback,
  };
}

function toJournal(row: JournalRow): Journal {
  const analysis = Array.isArray(row.ai_analyses)
    ? row.ai_analyses[0]
    : row.ai_analyses;
  return {
    id: row.id,
    questionId: row.question_id ?? "",
    questionContent: row.question_content,
    level: row.level,
    content: row.content,
    createdAt: row.created_at,
    analysis: analysis ? toAnalysis(analysis) : null,
  };
}

/** 로그인한 사용자의 프로필. 온보딩 전이라 비어 있는 값은 기본값으로 채움 */
export async function getProfile(): Promise<UserProfile> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("age_group, base_level, nickname")
    .maybeSingle<{
      age_group: AgeGroup | null;
      base_level: Level | null;
      nickname: string;
    }>();

  return {
    ageGroup: data?.age_group ?? DEFAULT_PROFILE.ageGroup,
    baseLevel: data?.base_level ?? DEFAULT_PROFILE.baseLevel,
    nickname: data?.nickname ?? DEFAULT_PROFILE.nickname,
  };
}

/** 최신순 기록 목록 */
export async function getJournals(limit?: number): Promise<Journal[]> {
  const supabase = await createClient();
  let query = supabase
    .from("journals")
    .select(JOURNAL_COLUMNS)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query.overrideTypes<JournalRow[]>();
  if (error) throw error;
  return data.map(toJournal);
}

export async function getJournal(id: string): Promise<Journal | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("journals")
    .select(JOURNAL_COLUMNS)
    .eq("id", id)
    .maybeSingle<JournalRow>();
  return data ? toJournal(data) : null;
}

/** 글쓰기 화면에서 보여줄 질문. 본인 질문이 아니거나 없으면 null */
export async function getQuestion(id: string): Promise<Question | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("questions")
    .select("id, content, level, type")
    .eq("id", id)
    .maybeSingle<Question>();
  return data;
}
