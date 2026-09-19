/**
 * /test/puppet-art — pick the Puppet card face. Three gpt-image-1 concepts in
 * the antique-amulet treatment Tyler picked for Mirror (prompts:
 * chess-learning-tree scripts/_gen-puppet-art.ts). Pinned in lib/run/ability-art.ts.
 */
const OPTIONS = [
  { n: 6, note: 'Edit of 1: bold braided gold cords, glassy rubies, violet amethyst. PINNED for now.' },
  { n: 7, note: 'Edit of 1: same, thinner cords with a bridle on the knight.' },
  { n: 5, note: 'First edit pass: shinier jewels, strings still thin, gem went sapphire.' },
  { n: 1, note: 'Jeweled crossbar, a black knight dangling at a tilt, lifted off its plinth. The original.' },
  { n: 2, note: 'Amethyst medallion, a gold pawn hanging from the strings on its face.' },
  { n: 3, note: 'A knight and a pawn swinging over a little gold stage.' },
];

export default function PuppetArtPage() {
  return (
    <div className="h-full overflow-auto bg-[#0f1b2d] text-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold">Puppet card art</h1>
        <p className="mt-1 text-sm text-white/70">Tell Claude the number you want. Option 6 is on the card right now.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {OPTIONS.map((o) => (
            <div key={o.n} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/abilities/puppet-${o.n}.webp`} alt={`Puppet concept ${o.n}`} className="w-full rounded-lg" />
              <div className="mt-3 text-lg font-semibold">Option {o.n}</div>
              <div className="text-sm text-white/70">{o.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
