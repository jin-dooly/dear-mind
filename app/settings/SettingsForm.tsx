'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { ChoiceButton } from '@/app/components/ChoiceButton';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { useHasMounted } from '@/app/lib/useHasMounted';
import { DEFAULT_PROFILE, getProfile, saveProfile } from '@/app/lib/storage';
import type { AgeGroup, Level } from '@/app/lib/types';

const AGE_GROUPS: AgeGroup[] = ['10대', '20대', '30대', '40대', '50대 이상'];
const LEVELS: { level: Level; label: string; color: string }[] = [
  { level: 1, label: 'Lv.1 가볍게', color: '#DCEFFB' },
  { level: 2, label: 'Lv.2 조금 더', color: '#E3E3FB' },
  { level: 3, label: 'Lv.3 깊게', color: '#F0D9F5' },
  { level: 4, label: 'Lv.4 아주 깊게', color: '#C9B8EA' },
];

export default function SettingsPage() {
  const router = useRouter();
  const hasMounted = useHasMounted();
  const profile = hasMounted ? getProfile() : DEFAULT_PROFILE;
  const [ageOverride, setAgeOverride] = useState<AgeGroup | null>(null);
  const [levelOverride, setLevelOverride] = useState<Level | null>(null);

  const ageGroup = ageOverride ?? profile.ageGroup;
  const level = levelOverride ?? profile.baseLevel;

  function handleSave() {
    saveProfile({ ageGroup, baseLevel: level });
    router.push('/home');
  }

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="MY INFO">
        <p className="text-[13px] text-muted mb-1">나이대와 기본 레벨을 다시 설정해요</p>
        <h1 className="font-jua text-lg text-ink mb-5">내 정보 변경</h1>

        <div className="flex flex-col gap-4 grow overflow-y-auto">
          <div>
            <p className="text-[12px] font-jua text-muted mb-2">나이대</p>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((age) => (
                <button
                  key={age}
                  onClick={() => setAgeOverride(age)}
                  className={`rounded-full border-2 px-3 py-1.5 text-[12px] font-jua transition-colors ${
                    ageGroup === age ? 'border-ink-dark bg-sky-light text-ink' : 'border-[#C7CDEB] bg-white text-muted'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] font-jua text-muted mb-2">기본 레벨</p>
            <div className="flex flex-col gap-2">
              {LEVELS.map(({ level: l, label, color }) => (
                <ChoiceButton
                  key={l}
                  label={label}
                  selected={level === l}
                  onClick={() => setLevelOverride(l)}
                  accentColor={color}
                />
              ))}
            </div>
          </div>
        </div>

        <PrimaryButton onClick={handleSave} className="mt-4">
          저장하기
        </PrimaryButton>
      </WindowFrame>
    </div>
  );
}
