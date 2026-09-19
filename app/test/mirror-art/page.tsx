/**
 * /test/mirror-art — pick the Mirror card face. Three gpt-image-1 concepts in
 * the deck's jeweled-relic style (prompts: chess-learning-tree
 * scripts/_gen-mirror-art.ts). The pinned one lives in lib/run/ability-art.ts.
 */
const OPTIONS = [
  { n: 1, note: 'Standing looking-glass. Ivory rook in front, opal rook in the glass.' },
  { n: 2, note: 'Two rooks across a pane. Reads the rule at a glance. PINNED for now.' },
  { n: 3, note: 'Compass mirror, cracked glass, a tower rising out of silver water.' },
];

export default function MirrorArtPage() {
  return (
    <div className="h-full overflow-auto bg-[#0f1b2d] text-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold">Mirror card art</h1>
        <p className="mt-1 text-sm text-white/70">Tell Claude the number you want. Option 2 is on the card right now.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {OPTIONS.map((o) => (
            <div key={o.n} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/abilities/mirror-${o.n}.webp`} alt={`Mirror concept ${o.n}`} className="w-full rounded-lg" />
              <div className="mt-3 text-lg font-semibold">Option {o.n}</div>
              <div className="text-sm text-white/70">{o.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
