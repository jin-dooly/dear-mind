import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { pathAfterLogin } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/?error=auth`);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/?error=auth`);

  return NextResponse.redirect(
    `${origin}${await pathAfterLogin(supabase, data.user.id)}`,
  );
}
