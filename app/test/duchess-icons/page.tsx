'use client';

/** Duchess icon picker — Tyler 2026-09-03: "not as good as the other ones." Current vs two new candidates. */

const NAVY = '#0f1c3f';
const GOLD_FRAME = 'linear-gradient(135deg,#b8852b,#6a4612 30%,#ffd87a 60%,#b8852b)';

const OPTIONS = [
  { label: 'Current', src: '/abilities/duchess-1.webp' },
  { label: 'C — encased, oval opal', src: '/abilities/concepts/duchess-4.webp' },
  { label: 'D — encased, cushion crystal', src: '/abilities/concepts/duchess-5.webp' },
  { label: 'E — encased, teardrop', src: '/abilities/concepts/duchess-6.webp' },
  { label: 'A — opal Mox (round 2)', src: '/abilities/concepts/duchess-2.webp' },
  { label: 'B — mother-of-pearl Mox (round 2)', src: '/abilities/concepts/duchess-3.webp' },
];

function Tile({ src, size }: { src: string; size: number }) {
  return (
    <div className="rounded-[12px] p-[3px]" style={{ width: size, height: size, background: GOLD_FRAME, boxShadow: '0 5px 12px rgba(0,0,0,0.45)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="w-full h-full object-cover rounded-[9px]" />
    </div>
  );
}

export default function DuchessIconsPage() {
  return (
    <div className="h-full overflow-auto text-white" style={{ background: NAVY }}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-black">Duchess icon — pick one</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Summon a rainbow queen you control. She does not stay long.</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {OPTIONS.map((o) => (
            <div key={o.src} className="flex flex-col items-center gap-3">
              <Tile src={o.src} size={200} />
              <div className="text-sm font-black" style={{ color: '#FFC800' }}>{o.label}</div>
              <div className="flex items-end gap-3">
                <Tile src={o.src} size={72} />
                <Tile src={o.src} size={44} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Sources: public/abilities/concepts/duchess-2.png and duchess-3.png (1024px). Rerun scripts/_gen-duchess.ts in chess-learning-tree for more.</p>
      </div>
    </div>
  );
}
