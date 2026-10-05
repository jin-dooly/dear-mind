'use client';

import { useParams } from 'next/navigation';
import { DitheredCat } from '@/app/components/DitheredCat';

/** loading.tsx는 params를 받지 못해서, 주소의 글 id를 읽어 분석 화면과 같은 색의 고양이를 그림 */
export function LoadingCat() {
  const { journalId } = useParams<{ journalId: string }>();
  return <DitheredCat seed={journalId} />;
}
