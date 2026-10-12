import { Cloud, Moon, Sparkle } from "lucide-react";

/**
 * 배경 구름·별 배치. 위치와 크기를 바꾸려면 이 표만 고치면 됨
 * - mobile: 640px 미만. 창이 화면을 거의 다 덮어서 창 위·아래 남는 띠(약 30~60px)에 모아 둠.
 *   창 가장자리에 살짝 걸쳐 창 뒤에서 빼꼼 보이게 함
 * - desktop: 640px 이상(sm:). 창 바깥 넓은 여백에 흩어 둠
 * - theme: 다크 모드(밤하늘)에서 달라지는 점. 구름은 흐려지고, 달과 아주 작은 별은 다크에서만 보임.
 *   토글을 누르면 1.5초에 걸쳐 천천히 바뀜 (CSS transition이라 처음 화면을 열 때는 바로 그 상태로 보임)
 */
const CLOUD_THEME = "dark:opacity-15";
const FADE = "transition-opacity duration-1500 motion-reduce:transition-none";
/**
 * 밤에만 보이는 아주 작은 별. 모바일에서는 위·아래 끝에서 16%까지의 띠에,
 * 다른 장식(대부분 끝에서 10% 안쪽)과 토글 사이 빈자리를 채우도록 흩어 둠
 */
const NIGHT_ONLY = "opacity-0 dark:opacity-100";

const DECOR = [
  {
    Icon: Moon,
    theme: NIGHT_ONLY,
    color: "text-moon",
    mobile: "top-5 left-[52%] size-[30px]",
    desktop: "sm:top-[7%] sm:left-auto sm:right-[26%] sm:size-11",
  },
  {
    Icon: Cloud,
    theme: CLOUD_THEME,
    color: "text-white/70",
    mobile: "top-2 left-[6%] size-10",
    desktop: "sm:top-[6%] sm:left-[8%] sm:size-[54px]",
  },
  {
    Icon: Cloud,
    theme: CLOUD_THEME,
    color: "text-white/60",
    mobile: "top-[5%] right-[20%] size-7",
    desktop: "sm:top-[16%] sm:right-[10%] sm:size-[38px]",
  },
  {
    Icon: Cloud,
    theme: CLOUD_THEME,
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
  {
    Icon: Sparkle,
    theme: NIGHT_ONLY,
    color: "text-white/30",
    mobile: "top-[4%] left-[28%] size-1.5",
    desktop: "sm:top-[12%] sm:left-[30%] sm:size-2",
  },
  {
    Icon: Sparkle,
    theme: NIGHT_ONLY,
    color: "text-white/40",
    mobile: "top-[15%] left-[14%] size-1.5",
    desktop: "sm:top-[38%] sm:left-[20%] sm:size-1.5",
  },
  {
    Icon: Sparkle,
    theme: NIGHT_ONLY,
    color: "text-white/30",
    mobile: "top-[12%] left-[66%] size-2",
    desktop: "sm:top-[24%] sm:left-auto sm:right-[32%] sm:size-2",
  },
  {
    Icon: Sparkle,
    theme: NIGHT_ONLY,
    color: "text-white/40",
    mobile: "bottom-[10%] left-[36%] size-1.5",
    desktop: "sm:bottom-[30%] sm:left-[6%] sm:size-2",
  },
  {
    Icon: Sparkle,
    theme: NIGHT_ONLY,
    color: "text-white/30",
    mobile: "bottom-[12%] left-[76%] size-2",
    desktop: "sm:bottom-[8%] sm:left-auto sm:right-[36%] sm:size-1.5",
  },
  {
    Icon: Sparkle,
    theme: NIGHT_ONLY,
    color: "text-white/40",
    mobile: "bottom-[15%] left-[8%] size-1.5",
    desktop: "sm:bottom-[16%] sm:left-auto sm:right-[8%] sm:size-2",
  },
];

export function SkyDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {DECOR.map(({ Icon, theme, color, mobile, desktop }, i) => (
        <Icon
          key={i}
          className={`absolute ${FADE} ${theme ?? ""} ${color} ${mobile} ${desktop}`}
          fill="currentColor"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
