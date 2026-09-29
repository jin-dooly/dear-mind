import Link from "next/link";
import { MoonIcon } from "lucide-react";
import { WindowFrame } from "@/app/components/WindowFrame";

export default function MainPage() {
  return (
    <div className="relative p-7 flex flex-col min-h-screen items-center justify-center">
      <WindowFrame title="DEAR-MIND.EXE" className="w-full max-w-140 max-h-140">
        <div className="relative flex flex-col grow items-center justify-center gap-2 text-center px-8">
          <MoonIcon size={50} stroke="#C3D3F5" className="mb-8" />
          <h1 className="font-jua text-3xl text-ink mb-1">끄적끄적</h1>
          <p className="text-[13px] text-muted">매일 하나의 질문으로</p>
          <p className="text-[13px] text-muted mb-8">
            AI와 함께하는 자기성찰 기록
          </p>

          <Link
            href="/onboarding/age"
            className="w-full max-w-65 flex items-center justify-center gap-2.5 rounded-xl border-2 border-ink-dark bg-white px-5 py-3 font-jua text-[14px] text-ink shadow-[0_4px_0_var(--color-ink-dark)] active:translate-y-1 active:shadow-none transition-transform"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-sky-light to-folder-purple-front text-[11px] font-bold text-ink-dark">
              G
            </span>
            Google로 시작하기
          </Link>
        </div>
      </WindowFrame>
    </div>
  );
}
