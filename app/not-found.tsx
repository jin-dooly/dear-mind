import { Cloud } from 'lucide-react';
import { DialogWindow } from '@/app/components/DialogWindow';
import { PrimaryLink } from '@/app/components/PrimaryButton';

export default function NotFound() {
  return (
    <DialogWindow
      title="NOT-FOUND.EXE"
      icon={<Cloud size={52} strokeWidth={2} />}
      heading="페이지를 찾을 수 없어요"
      description="주소가 바뀌었거나 사라진 페이지예요"
    >
      <PrimaryLink href="/home">홈으로 돌아가기</PrimaryLink>
    </DialogWindow>
  );
}
