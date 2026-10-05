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
      <WindowFrame title="DEAR-MIND.EXE" size="md" maxHeight="max-h-140">
        <div className="relative flex flex-col grow items-center justify-center text-center px-6 py-10">
          <MoonIcon
            size={56}
            stroke="#9FB4EA"
            strokeWidth={2.5}
            className="mb-6"
          />
          <h1 className="font-jua text-4xl text-ink mb-5">dear mind</h1>
          <p className="text-[14px] text-muted leading-relaxed mb-10">
            정답을 찾기보다,
            <br />
            지금의 나를 알아가는 시간
          </p>

          <GoogleLoginButton
            initialError={
              error === "auth" ? "로그인하지 못했어요. 다시 시도해 주세요" : null
            }
          />
        </div>
      </WindowFrame>
    </div>
  );
}
