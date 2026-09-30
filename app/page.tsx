import { MoonIcon } from "lucide-react";
import { WindowFrame } from "@/app/components/WindowFrame";
import { GoogleLoginButton } from "@/app/components/GoogleLoginButton";

export default async function MainPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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

          <GoogleLoginButton
            initialError={
              error === "auth" ? "로그인하지 못했어요. 다시 시도해주세요" : null
            }
          />
        </div>
      </WindowFrame>
    </div>
  );
}
