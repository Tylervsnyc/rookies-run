/**
 * /test/card-art — every new card face generated 2026-09-19/20 (gpt-image-1,
 * jewel / antique-relic treatment), one row per card. PINNED = what the card
 * shows in the game right now (lib/run/ability-art.ts).
 */
const SETS: { id: string; title: string; pinned: number; options: number[] }[] = [
  { id: 'hourglass', title: 'Wait a Sec (new name for Hourglass)', pinned: 1, options: [1, 2, 3] },
  { id: 'mirror', title: 'Mirror', pinned: 9, options: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
  { id: 'puppet', title: 'Puppet', pinned: 13, options: [13, 14, 15, 11, 12, 10, 8, 9, 6, 7, 5, 1, 2, 3] },
  { id: 'ricochet', title: 'Ricochet', pinned: 1, options: [1, 2, 3] },
  { id: 'avalanche', title: 'Avalanche', pinned: 1, options: [1, 2, 3] },
];

export default function CardArtPage() {
  return (
    <div className="h-full overflow-auto bg-[#0f1b2d] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold">New card art</h1>
        <p className="mt-1 text-sm text-white/70">Tell Claude the card and the number. Gold ring = on the card right now.</p>
        {SETS.map((set) => (
          <div key={set.id} className="mt-7">
            <h2 className="text-xl font-semibold text-amber-300">{set.title}</h2>
            <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {set.options.map((n) => (
                <div
                  key={n}
                  className={`rounded-xl bg-white/5 p-2 ring-1 ${n === set.pinned ? 'ring-2 ring-amber-300' : 'ring-white/10'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/abilities/${set.id}-${n}.webp`} alt={`${set.title} option ${n}`} className="w-full rounded-lg" />
                  <div className="mt-2 text-sm font-semibold">
                    Option {n}
                    {n === set.pinned ? ' · on the card' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
