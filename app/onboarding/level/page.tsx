"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WindowFrame } from "@/app/components/WindowFrame";
import { ChoiceButton } from "@/app/components/ChoiceButton";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { ErrorMessage } from "@/app/components/ErrorMessage";
import { saveProfile } from "@/app/lib/actions";
import type { Level } from "@/app/lib/types";

const LEVELS: {
  level: Level;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    level: 1,
    label: "Lv.1 가볍게",
    description: "오늘 있었던 일을 가볍게 떠올려봐요",
    color: "#DCEFFB",
  },
  {
    level: 2,
    label: "Lv.2 조금 더",
    description: "요즘 드는 생각을 조금 더 들여다봐요",
    color: "#E3E3FB",
  },
  {
    level: 3,
    label: "Lv.3 깊게",
    description: "마음 한 켠의 감정을 깊게 마주해요",
    color: "#F0D9F5",
  },
  {
    level: 4,
    label: "Lv.4 아주 깊게",
    description: "나 자신에 대해 아주 깊이 성찰해요",
    color: "#C9B8EA",
  },
];

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
      setError("저장하지 못했어요. 잠시 후 다시 시도해주세요");
      setSaving(false);
    }
  }

  return (
    <div className="relative p-7 flex flex-col min-h-screen items-center">
      <WindowFrame title="ONBOARDING (2/2)" className="w-full max-w-200">
        <p className="text-[13px] text-muted mb-1">
          이제, 기본 레벨을 골라주세요
        </p>
        <h1 className="font-jua text-lg text-ink mb-6">
          어느 정도 깊이로 시작할까요?
        </h1>

        <div className="flex flex-col gap-2.5">
          {LEVELS.map(({ level, label, description, color }) => (
            <ChoiceButton
              key={level}
              label={label}
              description={description}
              selected={selected === level}
              onClick={() => setSelected(level)}
              accentColor={color}
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
