'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CloudLightning } from 'lucide-react';
import { DialogWindow } from '@/app/components/DialogWindow';
import { PrimaryButton } from '@/app/components/PrimaryButton';

// 서버 에러 메시지는 프로덕션에서 가려지므로 화면에는 고정 문구만 보여줌
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DialogWindow
      title="ERROR.EXE"
      icon={<CloudLightning size={52} strokeWidth={2} />}
      heading="문제가 생겼어요"
      description="잠시 후 다시 시도해 주세요"
    >
      <PrimaryButton onClick={() => retry()}>다시 시도하기</PrimaryButton>
      <Link href="/home" className="text-[12px] text-muted underline">
        홈으로 돌아가기
      </Link>
    </DialogWindow>
  );
}
