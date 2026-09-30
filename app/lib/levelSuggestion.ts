import { createClient } from "@/app/lib/supabase/server";
import type { Level } from "@/app/lib/types";

/** 기본 레벨 설정 이후 최근 몇 개의 글을 볼지 */
const WINDOW_SIZE = 5;
/** 그중 몇 개 이상이 같은 방향이면 제안할지 */
const THRESHOLD = 4;

export type LevelSuggestion = {
  from: Level;
  to: Level;
};

/**
 * 기본 레벨 설정(또는 제안 수락/거절) 이후 쓴 최근 글 5개 중
 * 4개 이상이 기본 레벨보다 높거나 낮은 질문이면, 한 단계 올리거나 내리도록 제안
 */
export async function getLevelSuggestion(): Promise<LevelSuggestion | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("base_level, level_counted_since")
    .maybeSingle<{ base_level: Level | null; level_counted_since: string }>();
  if (!profile?.base_level) return null;

  const { data: journals, error } = await supabase
    .from("journals")
    .select("level")
    .gt("created_at", profile.level_counted_since)
    .order("created_at", { ascending: false })
    .limit(WINDOW_SIZE)
    .overrideTypes<{ level: Level }[]>();
  if (error) throw error;
  if (journals.length < WINDOW_SIZE) return null;

  const base = profile.base_level;
  const higher = journals.filter((j) => j.level > base).length;
  const lower = journals.filter((j) => j.level < base).length;

  if (higher >= THRESHOLD && base < 4) return { from: base, to: (base + 1) as Level };
  if (lower >= THRESHOLD && base > 1) return { from: base, to: (base - 1) as Level };
  return null;
}
