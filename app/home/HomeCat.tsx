"use client";

import { useRef, useState } from "react";
import { DitheredCat } from "@/app/components/DitheredCat";
import { WindowFrame } from "@/app/components/WindowFrame";

/**
 * 인사말 옆의 아주 작은 고양이. 누르면 화면 폭에 맞춘 창이 모달로 떠서 고양이를 쓰다듬을 수 있음
 * - 미니 고양이와 모달 고양이는 같은 색 (홈에 들어올 때마다 새 색)
 * - Esc, 바깥 클릭, × 버튼으로 닫힘. 닫혀 있을 땐 큰 고양이를 그리지 않음
 */
export function HomeCat() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  // 색을 정하는 시드는 그릴 때(effect)만 쓰여서, 서버·브라우저 값이 달라도 화면이 어긋나지 않음
  const [seed] = useState(() => Math.random().toString(36).slice(2));

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label="고양이 쓰다듬기"
        title="고양이 쓰다듬기"
        className="shrink-0 rounded-full mt-auto"
      >
        <DitheredCat mini seed={seed} />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="고양이"
        onClose={() => setOpen(false)}
        // 창 바깥(배경)을 누르면 닫힘
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        // 화면 폭을 꽉 채우되 바깥 여백은 모바일 20px(5), 넓은 화면 80px(20).
        // 열 때 대화상자 자체에 포커스가 가서 생기는 테두리는 숨김
        className="m-auto outline-none w-[calc(100%-40px)] max-w-none max-h-none overflow-visible bg-transparent backdrop:bg-ink/25 sm:w-[calc(100%-160px)]"
      >
        {open && (
          <WindowFrame
            title="CAT.EXE"
            size="full"
            maxHeight="max-h-none"
            className="h-fit grow-0"
            onClose={close}
          >
            {/* 창 안쪽(여백 포함)을 고양이가 꽉 채워서, 어디를 만져도 반응하고 쳐다봄.
                높이는 창 폭만큼(정사각형)이되, 화면 높이를 넘지 않게 줄임 (제목줄·테두리·바깥 여백만큼 뺌) */}
            <DitheredCat
              fill
              seed={seed}
              className="-m-5 h-[min(calc(100vw-44px),calc(100dvh-86px))] sm:h-[min(calc(100vw-164px),calc(100dvh-206px))]"
            />
          </WindowFrame>
        )}
      </dialog>
    </>
  );
}
