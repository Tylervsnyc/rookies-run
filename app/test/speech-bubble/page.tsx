'use client';

import { BoardOverlay } from '@/components/run/BoardOverlay';

/** Speech bubbles at the board's edges — they must wrap and stay inside. */
export default function SpeechBubbleTest() {
  const text = 'I have been waiting the whole game for that.';
  const cases: Array<[string, string]> = [['a1', text], ['h1', text], ['d4', text], ['h7', 'Two of them?!']];
  return (
    <div className="h-full overflow-auto bg-[#12223a] p-4 flex flex-col gap-10 items-center">
      {cases.map(([sq, t]) => (
        <div key={sq} className="relative w-full max-w-[343px] aspect-square mt-12" style={{ background: 'repeating-conic-gradient(#769656 0 25%, #eeeed2 0 50%) 0 0 / 25% 25%' }}>
          <BoardOverlay bursts={[{ square: sq, text: t, speech: true }]} />
        </div>
      ))}
    </div>
  );
}
