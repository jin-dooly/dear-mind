'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WindowFrame } from '@/app/components/WindowFrame';
import { ChoiceButton } from '@/app/components/ChoiceButton';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { saveProfile, signOut } from '@/app/lib/actions';
import type { AgeGroup, Level, UserProfile } from '@/app/lib/types';

const AGE_GROUPS: AgeGroup[] = ['10대', '20대', '30대', '40대', '50대 이상'];
const LEVELS: { level: Level; label: string; color: string }[] = [
  { level: 1, label: 'Lv.1 가볍게', color: '#DCEFFB' },
  { level: 2, label: 'Lv.2 조금 더', color: '#E3E3FB' },
  { level: 3, label: 'Lv.3 깊게', color: '#F0D9F5' },
  { level: 4, label: 'Lv.4 아주 깊게', color: '#C9B8EA' },
];

export function SettingsForm({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(profile.ageGroup);
  const [level, setLevel] = useState<Level>(profile.baseLevel);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      // 레벨을 바꿨을 때만 저장해서, 나이대만 바꾼 경우 레벨 제안 집계가 초기화되지 않게 함
      await saveProfile({
        ageGroup,
        baseLevel: level === profile.baseLevel ? undefined : level,
      });
      router.push('/home');
    } catch {
      setError('저장하지 못했어요. 잠시 후 다시 시도해 주세요');
      setSaving(false);
    }
  }

  return (
    <div className="p-7 flex flex-col min-h-screen">
      <WindowFrame title="MY-INFO.EXE" closeHref="/home">
        <p className="text-[13px] text-muted mb-1">나이대와 기본 레벨을 다시 설정해요</p>
        <h1 className="font-jua text-lg text-ink mb-5">내 정보 변경</h1>

        <div className="flex flex-col gap-4 grow overflow-y-auto">
          <div>
            <p className="text-[12px] font-jua text-muted mb-2">나이대</p>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((age) => (
                <button
                  key={age}
                  onClick={() => setAgeGroup(age)}
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
                  onClick={() => setLevel(l)}
                  accentColor={color}
                />
              ))}
            </div>
          </div>
        </div>

        <ErrorMessage className="mt-4">{error}</ErrorMessage>
        <PrimaryButton onClick={handleSave} disabled={saving} className="mt-4">
          {saving ? '저장 중...' : '저장하기'}
        </PrimaryButton>
        <button
          onClick={() => signOut()}
          className="mt-3 text-[12px] text-muted underline self-center"
        >
          로그아웃
        </button>
      </WindowFrame>
    </div>
  );
}
