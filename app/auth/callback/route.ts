import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/?error=auth`);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/?error=auth`);

  // 온보딩을 마치지 않은 사용자는 온보딩으로
  const { data: profile } = await supabase
    .from("profiles")
    .select("age_group, base_level")
    .eq("id", data.user.id)
    .single();

  const needsOnboarding = !profile?.age_group || !profile?.base_level;
  return NextResponse.redirect(
    `${origin}${needsOnboarding ? "/onboarding/age" : "/home"}`,
  );
}
