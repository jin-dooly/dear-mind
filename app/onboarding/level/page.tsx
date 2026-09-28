'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { SkyDecor } from '@/app/components/SkyDecor';
import { ChoiceButton } from '@/app/components/ChoiceButton';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { saveProfile } from '@/app/lib/storage';
import type { Level } from '@/app/lib/types';

const LEVELS: { level: Level; label: string; description: string; color: string }[] = [
  { level: 1, label: 'Lv.1 가볍게', description: '오늘 있었던 일을 가볍게 떠올려봐요', color: '#DCEFFB' },
  { level: 2, label: 'Lv.2 조금 더', description: '요즘 드는 생각을 조금 더 들여다봐요', color: '#E3E3FB' },
  { level: 3, label: 'Lv.3 깊게', description: '마음 한 켠의 감정을 깊게 마주해요', color: '#F0D9F5' },
  { level: 4, label: 'Lv.4 아주 깊게', description: '나 자신에 대해 아주 깊이 성찰해요', color: '#C9B8EA' },
];

export default function OnboardingLevelPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Level | null>(null);

  function handleDone() {
    if (!selected) return;
    saveProfile({ baseLevel: selected });
    router.push('/home');
  }

  return (
    <div className="relative p-7 flex flex-col min-h-screen">
      <SkyDecor />
      <WindowFrame title="ONBOARDING (2/2)">
        <p className="text-[13px] text-muted mb-1">이제, 기본 레벨을 골라주세요</p>
        <h1 className="font-jua text-lg text-ink mb-6">어느 정도 깊이로 시작할까요?</h1>

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
        <PrimaryButton onClick={handleDone} disabled={!selected}>
          시작하기
        </PrimaryButton>
      </WindowFrame>
    </div>
  );
}
