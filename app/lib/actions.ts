"use server";

import { redirect } from "next/navigation";
import { createClient, createClientWithUser } from "@/app/lib/supabase/server";
import { analyzeJournal } from "@/app/lib/analysis";
import { pathAfterLogin } from "@/app/lib/auth";
import { loginIdToEmail } from "@/app/lib/demoAccount";
import { refreshTodaysQuestions } from "@/app/lib/dailyQuestions";
import { toAnalysis, type AnalysisRow } from "@/app/lib/db";
import type { AIAnalysis, Journal, UserProfile } from "@/app/lib/types";

/** 기본 레벨을 저장하면 레벨 변경 제안을 위한 집계를 처음부터 다시 셈 */
export async function saveProfile(profile: Partial<UserProfile>) {
  const { supabase, userId } = await createClientWithUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      age_group: profile.ageGroup,
      base_level: profile.baseLevel,
      nickname: profile.nickname,
      level_counted_since:
        profile.baseLevel === undefined ? undefined : new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) throw error;
}

/** 레벨 변경 제안 거절. 지금부터 다시 세어 같은 제안이 바로 다시 뜨지 않게 함 */
export async function dismissLevelSuggestion() {
  const { supabase, userId } = await createClientWithUser();
  const { error } = await supabase
    .from("profiles")
    .update({ level_counted_since: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}

/** 오늘의 질문을 새로 받음. 한도 초과는 예상 가능한 에러라 반환값으로 알림 */
export async function refreshQuestions(): Promise<{ error: string | null }> {
  const refreshed = await refreshTodaysQuestions();
  return {
    error: refreshed ? null : "오늘은 새 질문을 모두 받았어요. 내일 다시 만나요",
  };
}

/** 글을 저장하고 새로 발급된 id를 돌려줌 */
export async function createJournal(
  journal: Pick<Journal, "questionId" | "questionContent" | "level" | "content">,
): Promise<string> {
  const { supabase, userId } = await createClientWithUser();
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
  const { supabase } = await createClientWithUser();

  const { data: journal, error } = await supabase
    .from("journals")
    .select(`content, question_content, ai_analyses(${ANALYSIS_COLUMNS})`)
    .eq("id", journalId)
    .single<{
      content: string;
      question_content: string;
      ai_analyses: AnalysisRow | null;
    }>();
  if (error) throw error;
  if (journal.ai_analyses) return toAnalysis(journal.ai_analyses);

  const analysis = await analyzeJournal({
    question: journal.question_content,
    content: journal.content,
  });

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

/** 실패해도 아이디는 남겨 둘 수 있게 함께 돌려줌 (폼 액션이 끝나면 입력칸이 초기화됨) */
export type PasswordLoginState = { id: string; error: string | null };

/**
 * 아이디·비밀번호 로그인 (체험 계정용, 회원가입은 없음).
 * 틀린 비밀번호는 예상 가능한 에러라 반환값으로 알리고, 성공하면 바로 이동
 */
export async function signInWithPassword(
  _prevState: PasswordLoginState,
  formData: FormData,
): Promise<PasswordLoginState> {
  const id = String(formData.get("id") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!id || !password) return { id, error: "아이디와 비밀번호를 입력해 주세요" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginIdToEmail(id),
    password,
  });
  if (error) {
    return {
      id,
      error:
        error.code === "invalid_credentials"
          ? "아이디나 비밀번호가 맞지 않아요"
          : "로그인하지 못했어요. 잠시 후 다시 시도해 주세요",
    };
  }

  redirect(await pathAfterLogin(supabase, data.user.id));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
