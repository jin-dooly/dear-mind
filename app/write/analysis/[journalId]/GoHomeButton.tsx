'use client';

import { useRouter } from 'next/navigation';
import { PrimaryButton } from '@/app/components/PrimaryButton';

export function GoHomeButton() {
  const router = useRouter();
  return <PrimaryButton onClick={() => router.push('/home')}>홈으로 돌아가기</PrimaryButton>;
}
