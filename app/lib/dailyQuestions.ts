import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientWithUser } from "@/app/lib/supabase/server";
import { getJournals, getProfile } from "@/app/lib/db";
import { todayKST } from "@/app/lib/format";
import { generateQuestions } from "@/app/lib/questions";
import type { Level, Question } from "@/app/lib/types";

/** 하루에 질문을 새로 받을 수 있는 횟수 */
export const MAX_DAILY_REFRESH = 2;

export type TodaysQuestions = {
  /** 오늘 받은 세트들. 받은 순서대로이고 마지막이 가장 최근 세트 */
  sets: Question[][];
  refreshesLeft: number;
};

type QuestionRow = {
  id: string;
  content: string;
  level: Level;
  type: string;
  batch: number;
};

/** 오늘 받은 세트를 batch 순서대로 묶어서 돌려줌 */
async function getTodaysSets(
  supabase: SupabaseClient,
  userId: string,
  date: string,
): Promise<Question[][]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, content, level, type, batch")
    .eq("user_id", userId)
    .eq("question_date", date)
    .not("position", "is", null)
    .order("batch", { ascending: true })
    .order("position", { ascending: true })
    .overrideTypes<QuestionRow[]>();
  if (error) throw error;

  const sets = new Map<number, Question[]>();
  for (const { batch, ...question } of data) {
    sets.set(batch, [...(sets.get(batch) ?? []), question]);
  }
  return [...sets.values()];
}

/** batch번째 세트를 만들어 저장. 동시에 같은 세트를 만들면 먼저 저장된 쪽을 씀 */
async function createSet(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  batch: number,
  /** 오늘 이미 받은 질문들. 새 세트가 겹치지 않게 함 */
  todaysQuestions: string[],
) {
  const [profile, recentJournals] = await Promise.all([
    getProfile(),
    getJournals(10),
  ]);
  const avoid = [
    ...new Set([
      ...todaysQuestions,
      ...recentJournals.map((j) => j.questionContent),
    ]),
  ];

  const questions = await generateQuestions({
    ageGroup: profile.ageGroup,
    baseLevel: profile.baseLevel,
    dateSeed: date,
    batch,
    avoid,
  });
  const rows = questions.map((q, position) => ({
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

/** 오늘 받은 질문 세트들. 오늘 처음이면 첫 세트를 만들어 저장 */
export async function getOrCreateTodaysQuestions(): Promise<TodaysQuestions> {
  const { supabase, userId } = await createClientWithUser();
  const date = todayKST();

  let sets = await getTodaysSets(supabase, userId, date);
  if (sets.length === 0) {
    await createSet(supabase, userId, date, 0, []);
    sets = await getTodaysSets(supabase, userId, date);
    if (sets.length === 0) throw new Error("질문을 만들지 못했어요");
  }

  return {
    sets,
    refreshesLeft: Math.max(0, MAX_DAILY_REFRESH - (sets.length - 1)),
  };
}

/** 오늘의 질문 세트를 하나 더 받음. 한도를 넘으면 false */
export async function refreshTodaysQuestions(): Promise<boolean> {
  const { supabase, userId } = await createClientWithUser();
  const date = todayKST();

  const sets = await getTodaysSets(supabase, userId, date);
  const nextBatch = sets.length;
  if (nextBatch > MAX_DAILY_REFRESH) return false;

  await createSet(
    supabase,
    userId,
    date,
    nextBatch,
    sets.flat().map((q) => q.content),
  );
  return true;
}
