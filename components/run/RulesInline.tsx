'use client';

import { useEffect, useState } from 'react';

const RULES: { n: number; text: string }[] = [
  { n: 1, text: 'Reach the 8th rank' },
  { n: 2, text: 'Capture to charge tempo' },
  { n: 3, text: 'Show no mercy' },
];

export function RulesInline({ winCondition }: { winCondition?: 'rank8' | 'king' } = {}) {
  // The run id comes from the URL / localStorage, so the server always renders
  // the default rules. Swap the label only after mount to avoid a hydration
  // text mismatch (only ever differs for the 'king' prototype).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const rules =
    mounted && winCondition === 'king'
      ? RULES.map((r) => (r.n === 1 ? { ...r, text: 'Capture the king' } : r))
      : RULES;
  return (
    <ul className="flex flex-col gap-[1px] sm:gap-1">
      {rules.map((r) => (
        <li key={r.n} className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-indigo-500 text-white text-[7px] sm:text-[8px] font-black flex items-center justify-center shrink-0 leading-none">
            {r.n}
          </span>
          <span className="text-[9.5px] sm:text-[10.5px] font-bold text-chess-text leading-[1.1]">
            {r.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
