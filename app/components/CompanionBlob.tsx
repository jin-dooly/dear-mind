/** animated면 글을 읽는 동안 숨쉬듯 천천히 움직임 */
export function CompanionBlob({ animated = false }: { animated?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center h-28 w-28 mx-auto ${
        animated ? 'animate-breathe motion-reduce:animate-none' : ''
      }`}
    >
      <div className="absolute inset-0 rounded-full bg-folder-purple-front blur-xl opacity-60" />
      <svg viewBox="0 0 120 120" className="relative h-24 w-24">
        <path
          d="M60 12c22 0 40 10 46 30 5 17-4 33-20 42-15 9-34 10-49 1C21 76 12 58 16 40 21 20 38 12 60 12Z"
          fill="#C9B8EA"
          stroke="#2E2A45"
          strokeWidth={3}
        />
        <circle cx={48} cy={58} r={4} fill="#2E2A45" />
        <circle cx={74} cy={58} r={4} fill="#2E2A45" />
        <path d="M50 72c4 4 16 4 20 0" stroke="#2E2A45" strokeWidth={3} strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
