"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WindowFrame } from "@/app/components/WindowFrame";
import { ChoiceButton } from "@/app/components/ChoiceButton";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { ErrorMessage } from "@/app/components/ErrorMessage";
import { saveProfile } from "@/app/lib/actions";
import type { AgeGroup } from "@/app/lib/types";

const AGE_GROUPS: AgeGroup[] = ["10대", "20대", "30대", "40대", "50대 이상"];

export default function OnboardingAgePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<AgeGroup | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await saveProfile({ ageGroup: selected });
      router.push("/onboarding/level");
    } catch {
      setError("저장하지 못했어요. 잠시 후 다시 시도해주세요");
      setSaving(false);
    }
  }

  return (
    <div className="relative p-7 flex flex-col min-h-screen items-center">
      <WindowFrame title="ONBOARDING (1/2)" className="w-full max-w-200">
        <p className="text-[13px] text-muted mb-1">먼저, 나이대를 알려주세요</p>
        <h1 className="font-jua text-lg text-ink mb-6">몇 살이신가요?</h1>

        <div className="flex flex-col gap-2.5">
          {AGE_GROUPS.map((age) => (
            <ChoiceButton
              key={age}
              label={age}
              selected={selected === age}
              onClick={() => setSelected(age)}
            />
          ))}
        </div>

        <div className="grow" />
        <ErrorMessage className="mb-3">{error}</ErrorMessage>
        <PrimaryButton onClick={handleNext} disabled={!selected || saving}>
          {saving ? "저장 중..." : "다음"}
        </PrimaryButton>
      </WindowFrame>
    </div>
  );
}
