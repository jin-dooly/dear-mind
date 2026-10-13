import { MoonIcon } from "lucide-react";
import { WindowFrame } from "@/app/components/WindowFrame";
import { GoogleLoginButton } from "@/app/components/GoogleLoginButton";
import { PasswordLoginForm } from "@/app/components/PasswordLoginForm";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default async function MainPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="relative p-7 flex flex-col h-dvh items-center justify-center">
      <ThemeToggle />
      <WindowFrame title="DEAR-MIND.EXE" size="md">
        <div className="relative flex flex-col grow items-center justify-center text-center px-6 py-10 overflow-y-auto">
          <MoonIcon
            size={56}
            stroke="#9FB4EA"
            strokeWidth={2.5}
            className="mb-5 shrink-0"
          />
          <h1 className="font-jua text-4xl text-ink mb-4">dear mind</h1>
          <p className="text-[14px] text-muted leading-relaxed mb-8">
            정답을 찾기보다,
            <br />
            지금의 나를 알아가는 시간
          </p>

          <GoogleLoginButton
            initialError={
              error === "auth" ? "로그인하지 못했어요. 다시 시도해 주세요" : null
            }
          />

          <div className="w-full max-w-80 flex items-center gap-3 my-5 text-[12px] text-muted">
            <span className="h-px grow bg-line-soft" />
            또는
            <span className="h-px grow bg-line-soft" />
          </div>

          <PasswordLoginForm />
        </div>
      </WindowFrame>
    </div>
  );
}
