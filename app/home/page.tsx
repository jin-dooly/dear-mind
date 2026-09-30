import { Pencil, BookOpen, Settings } from "lucide-react";
import { WindowFrame } from "@/app/components/WindowFrame";
import { FolderMenuItem } from "@/app/components/FolderMenuItem";
import { DEFAULT_PROFILE, getProfile } from "@/app/lib/db";

export default async function HomePage() {
  const { nickname } = await getProfile();
  // 이름을 모르면 기본값("친구님")보다 인사만 하는 게 자연스러움
  const greeting =
    nickname === DEFAULT_PROFILE.nickname ? "안녕하세요" : `${nickname}님, 안녕하세요`;

  return (
    <div className="p-7 flex flex-col min-h-screen items-center justify-center">
      <WindowFrame title="HOME.EXE" className="w-fit h-fit grow-0">
        <div className="p-2 pb-4">
          <h1 className="font-jua text-xl text-ink mb-1">{greeting}</h1>
          <p className="text-[13px] text-muted mb-5">
            마음 한 조각을 들여다볼까요?
          </p>

          <div className="flex flex-col gap-5 justify-center">
            <FolderMenuItem
              colorScheme="purple"
              title="작성하기"
              subtitle="오늘의 질문에 답해 보세요"
              icon={<Pencil size={24} />}
              href="/write"
            />
            <FolderMenuItem
              colorScheme="pink"
              title="기록 보기"
              subtitle="지난 기록을 다시 읽어 보세요"
              icon={<BookOpen size={24} />}
              href="/records"
            />
            <FolderMenuItem
              colorScheme="mint"
              title="내 정보 변경"
              subtitle="나이대, 레벨을 다시 설정해요"
              icon={<Settings size={24} />}
              href="/settings"
            />
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}
