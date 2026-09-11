'use client';

import { RevengeLoader, LOADER_ANIMATIONS } from '@/components/run/RevengeLoader';
import { RevengeMarkSvg, RookiesRevengeLogo, RookiesRevengeLogoStacked } from '@/components/run/RookiesRevengeLogo';
import { SPLASH_BG } from '@/components/run/NativeSplash';

export default function Page() {
  return (
    <div className="h-full overflow-auto p-6 font-sans text-slate-800" style={{ background: SPLASH_BG }}>
      <h1 className="mb-1 text-xl font-bold">Rookie&apos;s Revenge — new mark + loader animations</h1>
      <p className="mb-6 text-sm text-slate-500">Static mark, then every loader animation. The real loader picks one at random each load.</p>
      <div className="mb-8 flex flex-wrap items-center gap-8">
        <RevengeMarkSvg size={160} />
        <RevengeMarkSvg size={60} />
        <RevengeMarkSvg size={32} />
        <RookiesRevengeLogo scale={0.6} />
        <RookiesRevengeLogoStacked scale={0.6} />
      </div>
      <div className="flex flex-wrap gap-8">
        {LOADER_ANIMATIONS.map((a) => (
          <div key={a} className="flex flex-col items-center gap-2">
            <RevengeLoader size={140} animation={a} />
            <div className="text-xs font-semibold">{a}</div>
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <RevengeLoader size={140} />
          <div className="text-xs font-semibold">random (reload)</div>
        </div>
      </div>
    </div>
  );
}
