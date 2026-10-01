"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WindowFrame } from "@/app/components/WindowFrame";
import { ChoiceButton } from "@/app/components/ChoiceButton";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { ErrorMessage } from "@/app/components/ErrorMessage";
import { saveProfile } from "@/app/lib/actions";
import { LEVEL_INFO, LEVELS, levelBgClass, levelLabel } from "@/app/lib/levels";
import type { Level } from "@/app/lib/types";


export default function OnboardingLevelPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Level | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDone() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await saveProfile({ baseLevel: selected });
      router.push("/home");
    } catch {
      setError("저장하지 못했어요. 잠시 후 다시 시도해 주세요");
      setSaving(false);
    }
  }

  return (
    <div className="relative p-7 flex flex-col min-h-screen items-center">
      <WindowFrame title="SETUP.EXE (2/2)" className="w-full max-w-200" closeHref="/onboarding/age">
        <p className="text-[13px] text-muted mb-1">
          이제 기본 레벨을 골라 주세요
        </p>
        <h1 className="font-jua text-lg text-ink mb-6">
          어느 정도 깊이로 시작할까요?
        </h1>

        <div className="flex flex-col gap-2.5">
          {LEVELS.map((level) => (
            <ChoiceButton
              key={level}
              label={levelLabel(level)}
              description={LEVEL_INFO[level].description}
              selected={selected === level}
              onClick={() => setSelected(level)}
              selectedClassName={levelBgClass(level)}
            />
          ))}
        </div>

        <div className="grow" />
        <ErrorMessage className="mb-3">{error}</ErrorMessage>
        <PrimaryButton onClick={handleDone} disabled={!selected || saving}>
          {saving ? "저장 중..." : "시작하기"}
        </PrimaryButton>
      </WindowFrame>
    </div>
  );
}
