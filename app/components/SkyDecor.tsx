import { Cloud, Sparkle } from 'lucide-react';

export function SkyDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Cloud className="absolute top-[6%] left-[8%] text-white/70" size={54} strokeWidth={1.5} />
      <Cloud className="absolute top-[16%] right-[10%] text-white/60" size={38} strokeWidth={1.5} />
      <Cloud className="absolute bottom-[10%] left-[14%] text-white/50" size={44} strokeWidth={1.5} />
      <Sparkle className="absolute top-[30%] right-[16%] text-white/80" size={18} strokeWidth={1.5} />
      <Sparkle className="absolute bottom-[22%] right-[24%] text-white/70" size={14} strokeWidth={1.5} />
      <Sparkle className="absolute top-[45%] left-[9%] text-white/70" size={16} strokeWidth={1.5} />
    </div>
  );
}
