import { WindowFrame } from "@/app/components/WindowFrame";
import { FadeScrollArea } from "@/app/components/FadeScrollArea";
import { PrimaryLink } from "@/app/components/PrimaryButton";
import { getJournals } from "@/app/lib/db";
import { todayKST } from "@/app/lib/format";
import { RecordsBrowser } from "./RecordsBrowser";
import { parseRecordsQuery } from "./recordsQuery";

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [journals, params] = await Promise.all([getJournals(), searchParams]);

  const heading = <h1 className="font-jua text-lg text-ink">기록 보기</h1>;

  // 화면 높이로 고정해서 기록이 많아지면 창 안쪽 목록만 스크롤됨
  return (
    <div className="p-7 flex flex-col h-dvh items-center justify-center">
      <WindowFrame title="RECORDS.EXE" size="lg" closeHref="/home">
        <FadeScrollArea className="-mx-1 px-1">
          <p className="text-[13px] text-muted mb-1">
            지난 기록들을 다시 읽어 보세요
          </p>
          {journals.length === 0 ? (
            <>
              <div className="mb-6">{heading}</div>
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
            </>
          ) : (
            <RecordsBrowser
              heading={heading}
              journals={journals}
              today={todayKST()}
              initialQuery={parseRecordsQuery(params)}
            />
          )}
        </FadeScrollArea>
      </WindowFrame>
    </div>
  );
}
