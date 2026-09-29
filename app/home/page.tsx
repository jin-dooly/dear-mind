import { Pencil, BookOpen, Settings } from "lucide-react";
import { WindowFrame } from "@/app/components/WindowFrame";
import { FolderMenuItem } from "@/app/components/FolderMenuItem";

export default function HomePage() {
  return (
    <div className="p-7 flex flex-col min-h-screen items-center justify-center">
      <WindowFrame title="MY HOME" className="w-fit h-fit grow-0">
        <div className="p-2 pb-4">
          <h1 className="font-jua text-xl text-ink mb-1">안녕하세요</h1>
          <p className="text-[13px] text-muted mb-5">
            오늘도 마음 한 조각을 들여다볼까요
          </p>

          <div className="flex flex-col gap-5 justify-center">
            <FolderMenuItem
              colorScheme="purple"
              title="작성하기"
              subtitle="오늘의 질문에 답해보세요"
              icon={<Pencil size={24} />}
              href="/write"
            />
            <FolderMenuItem
              colorScheme="pink"
              title="기록 보기"
              subtitle="지난 기록을 다시 읽어보세요"
              icon={<BookOpen size={24} />}
              href="/records"
            />
            <FolderMenuItem
              colorScheme="mint"
              title="내 정보 변경하기"
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
