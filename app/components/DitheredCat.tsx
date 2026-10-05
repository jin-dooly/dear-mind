"use client";

import { useEffect, useRef } from "react";

/*
 * 디더링 점으로 그린 털뭉치 고양이. componentry의 dithered-logo 방식(오차 확산 디더링 + 커서 반발 + 클릭 물결)을
 * 고양이 실루엣에 맞게 옮겨 왔음
 * - 쓰다듬으면 털(점)이 손 방향으로 쓸리고, 오래 쓰다듬거나 톡 누르면 눈을 감고 좋아함
 * - 색은 마운트할 때마다 파스텔 두 색 그라데이션으로 무작위로 정해짐
 * - 동작 줄이기 설정이면 숨쉬기·눈 깜빡임을 끄고, 만질 때만 움직임
 */

/** 모양을 정의하는 좌표 공간 */
const GRID_W = 160;
const GRID_H = 150;
/** 실제 디더링 격자 해상도 비율. 작을수록 점이 굵고 듬성듬성해져 입자 질감이 잘 보임 */
const RES = 1;
const FIELD_W = Math.round(GRID_W * RES);
const FIELD_H = Math.round(GRID_H * RES);
/** 캔버스에서 고양이가 차지하는 비율 */
const FIT = 0.92;

/**
 * 고양이 몸통 외곽선 (격자 좌표). 무드등처럼 위는 좁고 아래로 갈수록 둥글게 퍼지며, 귀는 위쪽 모서리의 작은 둥근 혹.
 * [시작점, ...[제어점1, 제어점2, 끝점]] 3차 베지어 곡선
 */
const BODY_PATH = [
  [80, 25], // 머리 위 가운데 (두 귀 사이 살짝 들어간 곳)
  [86, 26, 94, 18, 100, 17], // 오른쪽 귀 안쪽
  [108, 16, 112, 5, 113, 32], // 오른쪽 귀 바깥쪽
  [116, 60, 134, 84, 134, 118], // 오른쪽 옆 (아래로 퍼짐)
  [134, 134, 126, 143, 112, 143], // 오른쪽 아래 모서리
  [90, 143, 60, 143, 38, 143], // 바닥
  [24, 143, 16, 134, 16, 118], // 왼쪽 아래 모서리
  [16, 84, 34, 60, 37, 32], // 왼쪽 옆
  [38, 5, 42, 16, 50, 17], // 왼쪽 귀 바깥쪽
  [56, 18, 64, 26, 75, 26], // 왼쪽 귀 안쪽
] as const;
/** 몸 뒤에서 오른쪽 위로 말려 올라가는 꼬리: 시작점, 제어점, 끝점, 굵기 */
const TAIL = { from: [122, 136], ctrl: [158, 142], to: [150, 108], width: 15 };
/** 쓰다듬기·톡 판정과 빛 중심에 쓰는 몸 근사 타원 */
const BODY = { cx: 75, cy: 85, rx: 58, ry: 60 };
const EYES = [
  [60, 58],
  [90, 58],
] as const;
const EYE_R = 2.8;
/** 웃을 때 눈 곡선의 높이 (눈 반지름 대비). 작을수록 완만하고 유해 보임 */
const HAPPY_EYE_ARCH = 0.3;
/** 눈이 커서를 따라 움직이는 최대 거리 (격자 단위, 클수록 많이 움직임) */
const LOOK_MAX = 7;
/** 커서가 얼굴에서 이 거리(px)만큼 떨어지면 눈이 최대로 움직임 (작을수록 조금만 움직여도 끝까지 감) */
const LOOK_REACH = 60;
/** 숨쉬기·눌림 변형의 기준점 (몸 아래 가운데) */
const ANCHOR = [75, 123] as const;

const INK = "rgba(74, 84, 128, 0.9)";
const COLOR_STEPS = 20;
const ALPHA_STEPS = 20;
/** 점 번짐 정도. 점의 흐릿한 테두리가 원래 점 크기의 몇 배까지 퍼지는지 (1이면 번짐 없음) */
const DOT_BLUR = 1.8;
/** 번진 점의 가운데가 얼마나 진하게 남는지 (0~1, 작을수록 전체가 더 뿌옇게 됨) */
const DOT_CORE = 0.25;
const DITHER_THRESHOLD = 128;

const CURSOR_RADIUS = 200;
const CURSOR_FORCE = 8;
/** 쓰다듬는 방향으로 털이 쓸리는 정도 */
const STROKE_DRAG = 1.4;
const MAX_STROKE_SPEED = 8;
const RIPPLE_SPEED = 150;
const RIPPLE_WIDTH = 30;
const RIPPLE_FORCE = 10;
const RIPPLE_DURATION = 700;
const LERP = 0.14;
const SNAP = 0.01;

/** 이만큼 쓰다듬으면 눈을 감고 좋아함 */
const PET_HAPPY = 60;
const TAP_HAPPY_MS = 1200;
const BREATH_PERIOD_S = 3.2;

type Hsl = [number, number, number];

interface Particles {
  count: number;
  baseX: Float32Array;
  baseY: Float32Array;
  offX: Float32Array;
  offY: Float32Array;
  size: number;
  /** 색·투명도가 같은 점끼리 묶어 fillStyle 변경을 줄임 */
  groups: { sprite: HTMLCanvasElement; alpha: number; ids: Uint32Array }[];
}

interface Ripple {
  x: number;
  y: number;
  start: number;
}

const hsl = ([h, s, l]: Hsl, a = 1) =>
  `hsl(${h.toFixed(1)} ${s}% ${l}% / ${a})`;

/** 위(진한 파스텔) → 아래(옅은 파스텔) 두 색. 색상환에서 35~80도 떨어진 이웃 색을 고름 */
function randomPalette(): { top: Hsl; bottom: Hsl } {
  // 파스텔로 만들면 탁해 보이는 노랑-연두(60~140도)는 시작 색에서 뺌
  let h1 = Math.random() * 280;
  if (h1 >= 60) h1 += 80;
  const shift = (35 + Math.random() * 45) * (Math.random() < 0.5 ? -1 : 1);
  return { top: [h1, 72, 74], bottom: [(h1 + shift + 360) % 360, 68, 81] };
}

function paletteSteps(top: Hsl, bottom: Hsl): Hsl[] {
  let dh = bottom[0] - top[0];
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return Array.from({ length: COLOR_STEPS }, (_, i) => {
    const t = i / (COLOR_STEPS - 1);
    return [
      (top[0] + dh * t + 360) % 360,
      Math.round(top[1] + (bottom[1] - top[1]) * t),
      Math.round(top[2] + (bottom[2] - top[2]) * t),
    ] as Hsl;
  });
}

/** 가운데는 진하고 바깥으로 갈수록 투명해지는 흐릿한 점 하나를 미리 그려 둠. 매 프레임 이 그림을 찍어서 점을 그림 */
function makeDotSprite(color: Hsl): HTMLCanvasElement {
  const size = 32;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  const c = size / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  gradient.addColorStop(0, hsl(color, 1));
  gradient.addColorStop(DOT_CORE, hsl(color, 0.8));
  gradient.addColorStop(1, hsl(color, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

function boxBlur(
  src: Float32Array,
  w: number,
  h: number,
  r: number,
): Float32Array {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const n = r * 2 + 1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let d = -r; d <= r; d++)
        sum += src[y * w + Math.min(w - 1, Math.max(0, x + d))];
      tmp[y * w + x] = sum / n;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let d = -r; d <= r; d++)
        sum += tmp[Math.min(h - 1, Math.max(0, y + d)) * w + x];
      out[y * w + x] = sum / n;
    }
  }
  return out;
}

/** 고양이 실루엣을 밝기 격자로 그림. 가운데가 밝고(점 빽빽) 가장자리·아래로 갈수록 옅어짐(점 성김) */
function sampleSilhouette(): Float32Array | null {
  const canvas = document.createElement("canvas");
  canvas.width = FIELD_W;
  canvas.height = FIELD_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.scale(RES, RES);

  const gradient = ctx.createRadialGradient(66, 68, 0, BODY.cx, BODY.cy, 72);
  gradient.addColorStop(0, "rgb(236,236,236)");
  gradient.addColorStop(0.65, "rgb(205,205,205)");
  gradient.addColorStop(1, "rgb(165,165,165)");
  ctx.fillStyle = gradient;
  ctx.strokeStyle = gradient;

  const [start, ...curves] = BODY_PATH;
  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);
  for (const [c1x, c1y, c2x, c2y, x, y] of curves) {
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.lineCap = "round";
  ctx.lineWidth = TAIL.width;
  ctx.beginPath();
  ctx.moveTo(TAIL.from[0], TAIL.from[1]);
  ctx.quadraticCurveTo(TAIL.ctrl[0], TAIL.ctrl[1], TAIL.to[0], TAIL.to[1]);
  ctx.stroke();

  const pixels = ctx.getImageData(0, 0, FIELD_W, FIELD_H).data;
  const raw = new Float32Array(FIELD_W * FIELD_H);
  for (let i = 0; i < raw.length; i++) raw[i] = pixels[i * 4];

  // 세 번 흐리면 가우시안에 가까워져 테두리가 털처럼 부드럽게 흩어짐
  let field = boxBlur(raw, FIELD_W, FIELD_H, 1);
  field = boxBlur(field, FIELD_W, FIELD_H, 1);
  field = boxBlur(field, FIELD_W, FIELD_H, 1);

  for (let y = 0; y < FIELD_H; y++) {
    const fade = 1 - 0.28 * Math.max(0, (y / RES - 80) / 62);
    for (let x = 0; x < FIELD_W; x++) {
      const i = y * FIELD_W + x;
      // 약간의 잡음으로 테두리 점을 들쭉날쭉하게 → 잔털 느낌
      field[i] = field[i] * fade + (Math.random() - 0.5) * 50;
    }
  }
  return field;
}

/** 오차 확산(Floyd–Steinberg, 지그재그) 디더링으로 점 위치를 뽑음. value는 원래 밝기(투명도에 씀) */
function ditherPoints(
  field: Float32Array,
): { x: number; y: number; value: number }[] {
  const err = Float32Array.from(field);
  const points: { x: number; y: number; value: number }[] = [];

  const spread = (x: number, y: number, amount: number) => {
    if (x < 0 || x >= FIELD_W || y >= FIELD_H) return;
    err[y * FIELD_W + x] += amount;
  };

  for (let y = 0; y < FIELD_H; y++) {
    const ltr = y % 2 === 0;
    const step = ltr ? 1 : -1;
    for (let x = ltr ? 0 : FIELD_W - 1; x !== (ltr ? FIELD_W : -1); x += step) {
      const i = y * FIELD_W + x;
      const old = err[i];
      const on = old > DITHER_THRESHOLD;
      // 점 위치는 모양 좌표 공간으로 되돌려 저장
      if (on) points.push({ x: x / RES, y: y / RES, value: field[i] });
      const e = old - (on ? 255 : 0);
      spread(x + step, y, (e * 7) / 16);
      spread(x - step, y + 1, (e * 3) / 16);
      spread(x, y + 1, (e * 5) / 16);
      spread(x + step, y + 1, (e * 1) / 16);
    }
  }
  return points;
}

function buildParticles(
  points: { x: number; y: number; value: number }[],
  sprites: HTMLCanvasElement[],
  sf: number,
  ox: number,
  oy: number,
): Particles {
  const count = points.length;
  const baseX = new Float32Array(count);
  const baseY = new Float32Array(count);
  const buckets: number[][] = Array.from(
    { length: COLOR_STEPS * ALPHA_STEPS },
    () => [],
  );

  points.forEach((p, i) => {
    baseX[i] = ox + p.x * sf;
    baseY[i] = oy + p.y * sf;
    const c = Math.min(
      COLOR_STEPS - 1,
      Math.round((p.y / GRID_H) * (COLOR_STEPS - 1)),
    );
    const a = Math.min(
      ALPHA_STEPS - 1,
      Math.max(0, Math.round((p.value / 255) * (ALPHA_STEPS - 1))),
    );
    buckets[c * ALPHA_STEPS + a].push(i);
  });

  const groups = buckets.flatMap((ids, b) =>
    ids.length === 0
      ? []
      : [
          {
            sprite: sprites[Math.floor(b / ALPHA_STEPS)],
            // 가장자리 점은 옅게, 가운데 점은 진하게
            alpha: 0.45 + 0.55 * ((b % ALPHA_STEPS) / (ALPHA_STEPS - 1)),
            ids: Uint32Array.from(ids),
          },
        ],
  );

  return {
    count,
    baseX,
    baseY,
    offX: new Float32Array(count),
    offY: new Float32Array(count),
    // 격자 간격보다 약간 작게 → 점 사이 틈이 보여 입자 느낌이 남
    size: (sf / RES) * 0.9,
    groups,
  };
}

/**
 * 방금 화면에 있던 고양이의 색. 로딩 화면 → 분석 화면처럼 고양이가 다시 마운트돼도 잠깐 사이면 같은 색을 이어 씀.
 * releasedAt이 null이면 아직 화면에 있는 중
 */
let recentPalette: {
  palette: { top: Hsl; bottom: Hsl };
  releasedAt: number | null;
} | null = null;
const PALETTE_KEEP_MS = 3000;

function takePalette() {
  const now = performance.now();
  const reusable =
    recentPalette &&
    (recentPalette.releasedAt === null ||
      now - recentPalette.releasedAt < PALETTE_KEEP_MS);
  const palette = reusable && recentPalette ? recentPalette.palette : randomPalette();
  const entry = { palette, releasedAt: null as number | null };
  recentPalette = entry;
  return {
    palette,
    release: () => {
      if (recentPalette === entry) entry.releasedAt = performance.now();
    },
  };
}

/** 작은 크기(compact)일 때의 배율. 분석 결과가 나오면 이 크기로 줄어듦 */
const COMPACT_SCALE = 0.64;

export function DitheredCat({
  compact = false,
  className,
}: {
  /** true면 작게 줄어든 상태 (분석 결과 화면). 바뀔 때 부드럽게 줄어들고, 작아지는 순간 한 번 웃어 줌 */
  compact?: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cheerRef = useRef<(() => void) | null>(null);
  const prevCompactRef = useRef(compact);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const field = sampleSilhouette();
    if (!wrap || !canvas || !ctx || !field) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const {
      palette: { top, bottom },
      release: releasePalette,
    } = takePalette();
    const sprites = paletteSteps(top, bottom).map(makeDotSprite);
    wrap.style.setProperty("--cat-glow", hsl([top[0], 80, 84]));
    const points = ditherPoints(field);

    let sys: Particles | null = null;
    let layout = { sf: 1, ox: 0, oy: 0, dpr: 1 };
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false };
    const ripples: Ripple[] = [];
    const look = { x: 0, y: 0 };
    let pet = 0;
    let happyUntil = 0;
    let squishAt = -Infinity;
    let blinkAt = performance.now() + 2500 + Math.random() * 3000;
    let raf = 0;

    const gx = (x: number) => layout.ox + x * layout.sf;
    const gy = (y: number) => layout.oy + y * layout.sf;

    const isOnBody = (x: number, y: number) => {
      const dx = (x - gx(BODY.cx)) / (BODY.rx * layout.sf);
      const dy = (y - gy(BODY.cy)) / (BODY.ry * layout.sf);
      return dx * dx + dy * dy < 1.2;
    };

    function relayout() {
      if (!canvas) return;
      // CSS 배율(compact)의 영향을 받지 않는 원래 크기로 배치
      const rect = { width: canvas.clientWidth, height: canvas.clientHeight };
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const sf = Math.min(
        (rect.width * FIT) / GRID_W,
        (rect.height * FIT) / GRID_H,
      );
      const ox = (rect.width - GRID_W * sf) / 2;
      const oy = (rect.height - GRID_H * sf) / 2;
      layout = { sf, ox, oy, dpr };
      sys = buildParticles(points, sprites, sf, ox, oy);
      start();
    }

    function step(now: number): boolean {
      if (!sys) return false;
      for (let k = ripples.length - 1; k >= 0; k--) {
        if (now - ripples[k].start >= RIPPLE_DURATION) ripples.splice(k, 1);
      }
      pointer.vx *= 0.82;
      pointer.vy *= 0.82;
      pet *= 0.97;

      const { count, baseX, baseY, offX, offY } = sys;
      let hasMotion = false;

      for (let i = 0; i < count; i++) {
        let fx = 0;
        let fy = 0;

        if (pointer.active) {
          const vx = baseX[i] + offX[i] - pointer.x;
          const vy = baseY[i] + offY[i] - pointer.y;
          const d2 = vx * vx + vy * vy;
          if (d2 > 0.1 && d2 < CURSOR_RADIUS * CURSOR_RADIUS) {
            const d = Math.sqrt(d2);
            const fall = 1 - d / CURSOR_RADIUS;
            const push = fall ** 3 * CURSOR_FORCE;
            fx += (vx / d) * push + pointer.vx * fall * fall * STROKE_DRAG;
            fy += (vy / d) * push + pointer.vy * fall * fall * STROKE_DRAG;
          }
        }

        for (const ripple of ripples) {
          const elapsed = now - ripple.start;
          const radius = (elapsed / 1000) * RIPPLE_SPEED;
          const sx = baseX[i] - ripple.x;
          const sy = baseY[i] - ripple.y;
          const d = Math.sqrt(sx * sx + sy * sy);
          const band = Math.abs(d - radius);
          if (d > 0.1 && band < RIPPLE_WIDTH) {
            const f =
              (1 - band / RIPPLE_WIDTH) *
              (1 - elapsed / RIPPLE_DURATION) *
              RIPPLE_FORCE;
            fx += (sx / d) * f;
            fy += (sy / d) * f;
          }
        }

        offX[i] += (fx - offX[i]) * LERP;
        offY[i] += (fy - offY[i]) * LERP;
        if (Math.abs(offX[i]) < SNAP) offX[i] = 0;
        if (Math.abs(offY[i]) < SNAP) offY[i] = 0;
        if (offX[i] !== 0 || offY[i] !== 0) hasMotion = true;
      }

      return (
        hasMotion ||
        ripples.length > 0 ||
        pointer.active ||
        pet > 1 ||
        now < happyUntil ||
        now - squishAt < 1200
      );
    }

    function drawFace(now: number) {
      if (!ctx) return;
      const { sf } = layout;
      const happy = now < happyUntil || pet > PET_HAPPY;

      // 커서 쪽을 살짝 쳐다봄
      let tx = 0;
      let ty = 0;
      if (pointer.active) {
        const dx = pointer.x - gx(BODY.cx);
        const dy = pointer.y - gy(EYES[0][1]);
        const d = Math.hypot(dx, dy) || 1;
        const m = Math.min(1, d / LOOK_REACH) * LOOK_MAX * sf;
        tx = (dx / d) * m;
        ty = (dy / d) * m;
      }
      look.x += (tx - look.x) * 0.15;
      look.y += (ty - look.y) * 0.15;

      let blinking = false;
      if (!reduceMotion && now > blinkAt) {
        if (now < blinkAt + 140) blinking = true;
        else blinkAt = now + 2500 + Math.random() * 3500;
      }

      ctx.fillStyle = INK;
      ctx.strokeStyle = INK;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const r = EYE_R * sf;
      for (const [ex, ey] of EYES) {
        const x = gx(ex) + look.x;
        const y = gy(ey) + look.y;
        if (happy) {
          ctx.lineWidth = 1.6 * sf;
          ctx.beginPath();
          // 뾰족한 ^ 대신 위가 둥근 완만한 곡선 → 부드럽게 웃는 눈
          const h = r * HAPPY_EYE_ARCH;
          ctx.moveTo(x - r * 1.15, y + h * 0.5);
          ctx.bezierCurveTo(
            x - r * 0.6,
            y - h,
            x + r * 0.6,
            y - h,
            x + r * 1.15,
            y + h * 0.5,
          );
          ctx.stroke();
        } else if (blinking) {
          ctx.lineWidth = 1.5 * sf;
          ctx.beginPath();
          ctx.moveTo(x - r, y);
          ctx.lineTo(x + r, y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function draw(now: number) {
      if (!ctx || !canvas || !sys) return;
      const { dpr } = layout;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let sx = 1;
      let sy = 1;
      if (!reduceMotion) {
        const b = Math.sin(((now / 1000) * Math.PI * 2) / BREATH_PERIOD_S);
        sy += 0.022 * b;
        sx -= 0.011 * b;
      }
      // 톡 누르면 말랑하게 눌렸다 튀어 오름
      const e = (now - squishAt) / 1000;
      if (e >= 0 && e < 1.2) {
        const s = Math.exp(-e * 5) * Math.sin(e * 16) * 0.08;
        sy -= s;
        sx += s * 0.7;
      }
      const ax = gx(ANCHOR[0]);
      const ay = gy(ANCHOR[1]);
      ctx.setTransform(
        dpr * sx,
        0,
        0,
        dpr * sy,
        dpr * ax * (1 - sx),
        dpr * ay * (1 - sy),
      );

      const { baseX, baseY, offX, offY, size, groups } = sys;
      // 흐릿한 점 그림(스프라이트)을 찍어서 점이 번져 보이게 함
      const r = (size / 2) * DOT_BLUR;
      const d = r * 2;
      for (const { sprite, alpha, ids } of groups) {
        ctx.globalAlpha = alpha;
        for (let j = 0; j < ids.length; j++) {
          const i = ids[j];
          ctx.drawImage(
            sprite,
            baseX[i] + offX[i] - r,
            baseY[i] + offY[i] - r,
            d,
            d,
          );
        }
      }
      ctx.globalAlpha = 1;
      drawFace(now);
    }

    function frame(now: number) {
      raf = 0;
      const moving = step(now);
      draw(now);
      // 숨쉬기·깜빡임이 있으면 계속, 아니면 움직임이 끝날 때 멈춤
      if (!reduceMotion || moving) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    // 화면에 보이는 크기는 CSS 배율만큼 줄어 있으므로 캔버스 원래 좌표로 되돌림
    const toLocal = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const k = rect.width ? canvas.clientWidth / rect.width : 1;
      return [
        (event.clientX - rect.left) * k,
        (event.clientY - rect.top) * k,
      ] as const;
    };

    cheerRef.current = () => {
      const now = performance.now();
      happyUntil = now + TAP_HAPPY_MS * 1.5;
      squishAt = now;
      start();
    };

    const onPointerMove = (event: PointerEvent) => {
      const [x, y] = toLocal(event);
      if (pointer.active) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const clamp = (v: number) =>
          Math.max(-MAX_STROKE_SPEED, Math.min(MAX_STROKE_SPEED, v));
        pointer.vx += (clamp(dx) - pointer.vx) * 0.5;
        pointer.vy += (clamp(dy) - pointer.vy) * 0.5;
        if (isOnBody(x, y)) pet = Math.min(pet + Math.hypot(dx, dy) * 0.6, 200);
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      start();
    };

    // 처음 닿은 위치를 기억해 두어, 첫 움직임이 큰 속도로 튀지 않게 함
    const onPointerDown = (event: PointerEvent) => {
      const [x, y] = toLocal(event);
      pointer.x = x;
      pointer.y = y;
      pointer.vx = 0;
      pointer.vy = 0;
      pointer.active = true;
      start();
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.active = false;
      start();
    };

    const onPointerCancel = () => {
      pointer.active = false;
      start();
    };

    const onPointerUp = (event: PointerEvent) => {
      const [x, y] = toLocal(event);
      const now = performance.now();
      ripples.push({ x, y, start: now });
      if (isOnBody(x, y)) {
        happyUntil = now + TAP_HAPPY_MS;
        squishAt = now;
      }
      if (event.pointerType !== "mouse") pointer.active = false;
      start();
    };

    const resizeObserver = new ResizeObserver(relayout);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointerenter", onPointerDown);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("pointerup", onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      releasePalette();
      cheerRef.current = null;
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerenter", onPointerDown);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  useEffect(() => {
    if (compact && !prevCompactRef.current) cheerRef.current?.();
    prevCompactRef.current = compact;
  }, [compact]);

  // 바깥 상자는 높이만 줄여 아래 내용이 따라 올라오게 하고, 안쪽은 위 기준으로 배율만 줄여 캔버스를 다시 그리지 않음
  return (
    <div
      aria-hidden
      className={`relative mx-auto w-56 transition-[height] duration-700 ease-out motion-reduce:transition-none ${
        compact ? "h-36" : "h-56"
      } ${className ?? ""}`}
    >
      <div
        ref={wrapRef}
        className="absolute inset-x-0 top-0 h-56 origin-top transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `scale(${compact ? COMPACT_SCALE : 1})` }}
      >
      {/* 뒤쪽 은은한 빛과 바닥 그림자 */}
      <div className="absolute left-1/2 top-[50%] h-40 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--cat-glow) opacity-60 blur-2xl" />
      <div className="absolute bottom-5 left-1/2 h-3 w-36 -translate-x-1/2 rounded-full bg-ink/15 blur-md" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none cursor-grab active:cursor-grabbing"
      />
      </div>
    </div>
  );
}
