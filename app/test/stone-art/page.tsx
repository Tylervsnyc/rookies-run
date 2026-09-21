/**
 * /test/stone-art — pick the Ricochet and Avalanche card faces. gpt-image-1,
 * jewel-encased antique treatment (prompts: chess-learning-tree
 * scripts/_gen-stone-cards-art.ts). Both default to `<id>-1.webp`.
 */
const SETS = [
  {
    id: 'ricochet',
    title: 'Ricochet',
    options: [
      { n: 1, note: 'Emerald on a stand: rook, one clean banked line, sparks at the corner. ON THE CARD now.' },
      { n: 2, note: 'Emerald medallion: rook with a zig-zag double bounce off two stones.' },
      { n: 3, note: 'Octagon emerald with a crown: rook in mid-flight, stone chips flying.' },
    ],
  },
  {
    id: 'avalanche',
    title: 'Avalanche',
    options: [
      { n: 1, note: 'Amber on a stand: a sweep of boulders sliding down onto one tiny pawn. ON THE CARD now.' },
      { n: 2, note: 'Amber medallion: rows of stone blocks all sliding the same way, streaks behind them.' },
      { n: 3, note: 'Gold orb: a whole mountainside collapsing, pawn and knight tumbling.' },
    ],
  },
];

export default function StoneArtPage() {
  return (
    <div className="h-full overflow-auto bg-[#0f1b2d] text-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold">Ricochet + Avalanche card art</h1>
        <p className="mt-1 text-sm text-white/70">Tell Claude the card and the number you want.</p>
        {SETS.map((set) => (
          <div key={set.id} className="mt-6">
            <h2 className="text-xl font-semibold text-amber-300">{set.title}</h2>
            <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-3">
              {set.options.map((o) => (
                <div key={o.n} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/abilities/${set.id}-${o.n}.webp`} alt={`${set.title} concept ${o.n}`} className="w-full rounded-lg" />
                  <div className="mt-3 text-lg font-semibold">Option {o.n}</div>
                  <div className="text-sm text-white/70">{o.note}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
