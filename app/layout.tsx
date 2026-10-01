import { Jua } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SkyDecor } from "@/app/components/SkyDecor";
import "./globals.css";

// 한글 글꼴 조각도 함께 포함됨. subsets는 미리 불러올(preload) 범위만 정함
const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua" });

export const metadata: Metadata = {
  title: "dear-mind",
  description: "정답을 찾기보다, 지금의 나를 알아가는 시간",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={jua.variable}>
      <body className="bg-linear-to-b from-sky-light to-sky-dark min-h-screen text-ink">
        <SkyDecor />
        {children}
      </body>
    </html>
  );
}
