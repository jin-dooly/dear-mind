"use client";

import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setLoading(false);
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="w-full max-w-65 flex items-center justify-center gap-2.5 rounded-xl border-2 border-ink-dark bg-white px-5 py-3 font-jua text-[14px] text-ink shadow-[0_4px_0_var(--color-ink-dark)] active:translate-y-1 active:shadow-none transition-transform disabled:opacity-60"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-sky-light to-folder-purple-front text-[11px] font-bold text-ink-dark">
        G
      </span>
      {loading ? "이동 중..." : "Google로 시작하기"}
    </button>
  );
}
