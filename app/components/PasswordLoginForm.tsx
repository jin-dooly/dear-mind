"use client";

import { useActionState, useRef } from "react";
import { signInWithPassword } from "@/app/lib/actions";
import { DEMO_ACCOUNT } from "@/app/lib/demoAccount";
import { ErrorMessage } from "@/app/components/ErrorMessage";
import { PrimaryButton } from "@/app/components/PrimaryButton";

const INPUT_CLASS =
  "w-full rounded-xl border-2 border-line-soft bg-surface px-4 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted focus:border-line";

/** 체험 계정으로 둘러볼 수 있는 아이디·비밀번호 로그인. 회원가입은 없음 */
export function PasswordLoginForm() {
  const [state, formAction, pending] = useActionState(signInWithPassword, {
    id: "",
    error: null,
  });
  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function fillDemoAccount() {
    if (idRef.current) idRef.current.value = DEMO_ACCOUNT.id;
    if (passwordRef.current) passwordRef.current.value = DEMO_ACCOUNT.password;
  }

  return (
    <form action={formAction} className="w-full max-w-80 flex flex-col gap-2">
      <input
        ref={idRef}
        name="id"
        defaultValue={state.id}
        aria-label="아이디"
        placeholder="아이디"
        autoComplete="username"
        autoCapitalize="none"
        required
        className={INPUT_CLASS}
      />
      <input
        ref={passwordRef}
        name="password"
        type="password"
        aria-label="비밀번호"
        placeholder="비밀번호"
        autoComplete="current-password"
        required
        className={INPUT_CLASS}
      />
      <PrimaryButton type="submit" disabled={pending} className="mt-1">
        {pending ? "로그인 중..." : "아이디로 로그인하기"}
      </PrimaryButton>
      <ErrorMessage>{state.error}</ErrorMessage>
      <p className="text-[12px] text-muted">
        체험 계정 · 아이디 <b className="text-ink">{DEMO_ACCOUNT.id}</b> / 비밀번호{" "}
        <b className="text-ink">{DEMO_ACCOUNT.password}</b>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="ml-2 underline underline-offset-2 hover:text-ink"
        >
          채우기
        </button>
      </p>
    </form>
  );
}
