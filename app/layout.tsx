import { Jua } from "next/font/google";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SkyDecor } from "@/app/components/SkyDecor";
import { THEME_COOKIE, parseTheme } from "@/app/lib/theme";
import "./globals.css";

// 한글 글꼴 조각도 함께 포함됨. subsets는 미리 불러올(preload) 범위만 정함
const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua" });

export const metadata: Metadata = {
  title: "dear-mind",
  description: "정답을 찾기보다, 지금의 나를 알아가는 시간",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // 고른 테마가 있으면 처음부터 그 테마로 그려서 새로고침해도 깜빡이지 않음. 없으면 기기 설정을 따라감
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html lang="ko" className={jua.variable} data-theme={theme}>
      <body className="bg-linear-to-b from-page-top to-page-bottom h-dvh overflow-hidden text-ink">
        <SkyDecor />
        {children}
      </body>
    </html>
  );
}
