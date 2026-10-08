import { Cloud, Sparkle } from "lucide-react";

/**
 * 배경 구름·별 배치. 위치와 크기를 바꾸려면 이 표만 고치면 됨
 * - mobile: 640px 미만. 창이 화면을 거의 다 덮어서 창 위·아래 남는 띠(약 30~60px)에 모아 둠.
 *   창 가장자리에 살짝 걸쳐 창 뒤에서 빼꼼 보이게 함
 * - desktop: 640px 이상(sm:). 창 바깥 넓은 여백에 흩어 둠
 */
const DECOR = [
  {
    Icon: Cloud,
    color: "text-white/70",
    mobile: "top-2 left-[6%] size-10",
    desktop: "sm:top-[6%] sm:left-[8%] sm:size-[54px]",
  },
  {
    Icon: Cloud,
    color: "text-white/60",
    mobile: "top-[5%] right-[20%] size-7",
    desktop: "sm:top-[16%] sm:right-[10%] sm:size-[38px]",
  },
  {
    Icon: Cloud,
    color: "text-white/50",
    mobile: "bottom-2 right-[8%] size-9",
    desktop: "sm:bottom-[10%] sm:left-[14%] sm:right-auto sm:size-[44px]",
  },
  {
    Icon: Sparkle,
    color: "text-white/80",
    mobile: "top-[8%] left-[40%] size-3.5",
    desktop: "sm:top-[30%] sm:left-auto sm:right-[16%] sm:size-[18px]",
  },
  {
    Icon: Sparkle,
    color: "text-white/70",
    mobile: "bottom-[6%] left-[60%] size-2.5",
    desktop: "sm:bottom-[22%] sm:left-auto sm:right-[24%] sm:size-[14px]",
  },
  {
    Icon: Sparkle,
    color: "text-white/70",
    mobile: "bottom-[3%] left-[18%] size-3.5",
    desktop: "sm:bottom-auto sm:top-[45%] sm:left-[9%] sm:size-4",
  },
];

export function SkyDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {DECOR.map(({ Icon, color, mobile, desktop }, i) => (
        <Icon
          key={i}
          className={`absolute ${color} ${mobile} ${desktop}`}
          fill="currentColor"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
