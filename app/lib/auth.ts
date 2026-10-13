import "server-only";
import type { createClient } from "@/app/lib/supabase/server";

/** 로그인 직후 이동할 경로. 온보딩을 마치지 않은 사용자는 온보딩으로 */
export async function pathAfterLogin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("age_group, base_level")
    .eq("id", userId)
    .single();

  const needsOnboarding = !profile?.age_group || !profile?.base_level;
  return needsOnboarding ? "/onboarding/age" : "/home";
}
