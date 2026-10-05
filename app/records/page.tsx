import Link from "next/link";
import { WindowFrame } from "@/app/components/WindowFrame";
import { FadeScrollArea } from "@/app/components/FadeScrollArea";
import { PrimaryLink } from "@/app/components/PrimaryButton";
import { LevelBadge } from "@/app/components/LevelBadge";
import { getJournals } from "@/app/lib/db";
import { formatDate } from "@/app/lib/format";

export default async function RecordsPage() {
  const journals = await getJournals();

  // 화면 높이로 고정해서 기록이 많아지면 창 안쪽 목록만 스크롤됨
  return (
    <div className="p-7 flex flex-col h-dvh items-center justify-center">
      <WindowFrame title="RECORDS.EXE" size="lg" closeHref="/home">
        <FadeScrollArea>
          <p className="text-[13px] text-muted mb-1">
            지난 기록들을 다시 읽어 보세요
          </p>
          <h1 className="font-jua text-lg text-ink mb-6">기록 보기</h1>

          <div className="flex flex-col gap-3 grow min-h-0 -mx-1 px-1 py-0.5">
            {journals.length === 0 && (
              <div className="flex flex-col items-center text-center mt-10 gap-1.5">
                <p className="font-jua text-[15px] text-ink">
                  아직 작성한 기록이 없어요
                </p>
                <p className="text-[13px] text-muted mb-5">
                  마음이 향하는 질문 하나에 답해 보세요
                </p>
                <PrimaryLink href="/write" className="max-w-60">
                  첫 기록 쓰러 가기
                </PrimaryLink>
              </div>
            )}
            {journals.map((j) => (
              <Link
                key={j.id}
                href={`/records/${j.id}`}
                className="w-full rounded-xl border-2 border-line bg-white px-4 py-3.5 text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <LevelBadge level={j.level} />
                  <span className="text-[11px] text-muted">
                    {formatDate(j.createdAt)}
                  </span>
                </div>
                <p className="text-[12px] text-muted mb-1 line-clamp-1">
                  {j.questionContent}
                </p>
                <p className="text-[13px] text-ink line-clamp-2 leading-relaxed">
                  {j.content}
                </p>
              </Link>
            ))}
          </div>
        </FadeScrollArea>
      </WindowFrame>
    </div>
  );
}
