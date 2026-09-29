"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { analyzeJournal } from "@/app/lib/analysis";
import { toAnalysis, type AnalysisRow } from "@/app/lib/db";
import type {
  AIAnalysis,
  Journal,
  Question,
  UserProfile,
} from "@/app/lib/types";

async function getUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) throw new Error("로그인이 필요해요");
  return { supabase, userId };
}

export async function saveProfile(profile: Partial<UserProfile>) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase
    .from("profiles")
    .update({
      age_group: profile.ageGroup,
      base_level: profile.baseLevel,
      nickname: profile.nickname,
    })
    .eq("id", userId);
  if (error) throw error;
}

/** 사용자가 고른 질문을 저장하고 DB id가 붙은 질문을 돌려줌 */
export async function createQuestion(
  question: Omit<Question, "id">,
): Promise<Question> {
  const { supabase, userId } = await getUserId();
  const { data, error } = await supabase
    .from("questions")
    .insert({
      user_id: userId,
      content: question.content,
      level: question.level,
      type: question.type,
    })
    .select("id")
    .single<{ id: string }>();
  if (error) throw error;
  return { ...question, id: data.id };
}

/** 글을 저장하고 새로 발급된 id를 돌려줌 */
export async function createJournal(
  journal: Pick<Journal, "questionId" | "questionContent" | "level" | "content">,
): Promise<string> {
  const { supabase, userId } = await getUserId();
  const { data, error } = await supabase
    .from("journals")
    .insert({
      user_id: userId,
      question_id: journal.questionId || null,
      question_content: journal.questionContent,
      level: journal.level,
      content: journal.content,
    })
    .select("id")
    .single<{ id: string }>();
  if (error) throw error;
  return data.id;
}

const ANALYSIS_COLUMNS = "summary, tone_keywords, message, is_safety_fallback";

/** 저장된 글을 AI로 분석하고 결과를 저장. 이미 분석된 글이면 기존 결과를 돌려줌 */
export async function analyzeAndSaveJournal(
  journalId: string,
): Promise<AIAnalysis> {
  const { supabase } = await getUserId();

  const { data: journal, error } = await supabase
    .from("journals")
    .select(`content, ai_analyses(${ANALYSIS_COLUMNS})`)
    .eq("id", journalId)
    .single<{ content: string; ai_analyses: AnalysisRow | null }>();
  if (error) throw error;
  if (journal.ai_analyses) return toAnalysis(journal.ai_analyses);

  const analysis = analyzeJournal(journal.content);

  // 동시에 두 번 호출돼도 한 번만 저장되도록 중복은 무시
  const { error: upsertError } = await supabase.from("ai_analyses").upsert(
    {
      journal_id: journalId,
      summary: analysis.summary,
      tone_keywords: analysis.toneKeywords,
      message: analysis.message,
      is_safety_fallback: analysis.isSafetyFallback,
    },
    { onConflict: "journal_id", ignoreDuplicates: true },
  );
  if (upsertError) throw upsertError;

  const { data: saved, error: savedError } = await supabase
    .from("ai_analyses")
    .select(ANALYSIS_COLUMNS)
    .eq("journal_id", journalId)
    .single<AnalysisRow>();
  if (savedError) throw savedError;
  return toAnalysis(saved);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
