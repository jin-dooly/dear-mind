import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientWithUser } from "@/app/lib/supabase/server";
import { getJournals, getProfile } from "@/app/lib/db";
import { todayKST } from "@/app/lib/format";
import { generateQuestions, recommendLevel } from "@/app/lib/questions";
import type { Level, Question } from "@/app/lib/types";

/** 하루에 질문을 새로 받을 수 있는 횟수 */
export const MAX_DAILY_REFRESH = 3;

export type QuestionSet = {
  questions: Question[];
  refreshesLeft: number;
};

type QuestionRow = {
  id: string;
  content: string;
  level: Level;
  type: string;
  batch: number;
};

/** 오늘 받은 세트 중 가장 최근 세트. 없으면 null */
async function getLatestSet(
  supabase: SupabaseClient,
  userId: string,
  date: string,
): Promise<{ batch: number; questions: Question[] } | null> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, content, level, type, batch")
    .eq("user_id", userId)
    .eq("question_date", date)
    .not("position", "is", null)
    .order("batch", { ascending: false })
    .order("position", { ascending: true })
    .limit(3)
    .overrideTypes<QuestionRow[]>();
  if (error) throw error;
  if (data.length === 0) return null;

  const batch = data[0].batch;
  const questions = data
    .filter((row) => row.batch === batch)
    .map(({ id, content, level, type }) => ({ id, content, level, type }));
  return { batch, questions };
}

/** batch번째 세트를 만들어 저장. 동시에 같은 세트를 만들면 먼저 저장된 쪽을 씀 */
async function createSet(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  batch: number,
) {
  const [profile, journals] = await Promise.all([getProfile(), getJournals(7)]);
  const level = recommendLevel(journals, profile.baseLevel);

  const rows = generateQuestions(level, date, batch).map((q, position) => ({
    user_id: userId,
    content: q.content,
    level: q.level,
    type: q.type,
    question_date: date,
    batch,
    position,
  }));

  const { error } = await supabase.from("questions").upsert(rows, {
    onConflict: "user_id,question_date,batch,position",
    ignoreDuplicates: true,
  });
  if (error) throw error;
}

function toQuestionSet(set: { batch: number; questions: Question[] }): QuestionSet {
  return {
    questions: set.questions,
    refreshesLeft: Math.max(0, MAX_DAILY_REFRESH - set.batch),
  };
}

/** 오늘의 질문 세트. 오늘 처음이면 새로 만들어 저장 */
export async function getOrCreateTodaysQuestions(): Promise<QuestionSet> {
  const { supabase, userId } = await createClientWithUser();
  const date = todayKST();

  const existing = await getLatestSet(supabase, userId, date);
  if (existing) return toQuestionSet(existing);

  await createSet(supabase, userId, date, 0);
  const created = await getLatestSet(supabase, userId, date);
  if (!created) throw new Error("질문을 만들지 못했어요");
  return toQuestionSet(created);
}

/** 오늘의 질문을 새 세트로 교체. 한도를 넘으면 false */
export async function refreshTodaysQuestions(): Promise<boolean> {
  const { supabase, userId } = await createClientWithUser();
  const date = todayKST();

  const current = await getLatestSet(supabase, userId, date);
  const nextBatch = current ? current.batch + 1 : 0;
  if (nextBatch > MAX_DAILY_REFRESH) return false;

  await createSet(supabase, userId, date, nextBatch);
  return true;
}
