/**
 * The Daisy Chain (revenge-57) — WORK IN PROGRESS.
 */
import { type RunDef, make, FLEE, STILL } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE PLAN. A level is drawn as eight strings, rank 8 first, file a first:
 *   #  fixed stone (a post, a wall — Shove may never push it)
 *   o  LOOSE stone (Shove may push it)
 *   ~  lava
 *   p n b q k  his men
 *   +  an empty square of his pen (his own square is always in the pen)
 *   .  open ground
 */
function plan(level: number, rows: string[], opts: { moveLimit: number; still?: boolean; enemiesPerTurn?: number }) {
  if (rows.length !== 8 || rows.some((r) => r.replace(/ /g, '').length !== 8)) {
    throw new Error(`revenge-57 L${level}: a plan is 8 rows of 8`);
  }
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  const pen: string[] = [];
  const TYPES = { p: 'pawn', n: 'knight', b: 'bishop', q: 'queen', k: 'king' } as const;
  rows.forEach((row, i) => {
    const rank = 8 - i;
    [...row.replace(/ /g, '')].forEach((ch, j) => {
      const file = j + 1;
      const name = `${String.fromCharCode(96 + file)}${rank}`;
      if (ch === '#') hazards.push({ file, rank, fixed: true });
      else if (ch === 'o') hazards.push({ file, rank });
      else if (ch === '~') hazards.push({ file, rank, kind: 'lava' });
      else if (ch === '+') pen.push(name);
      else if (ch in TYPES) {
        const type = TYPES[ch as keyof typeof TYPES];
        pieces.push({ type, color: 'black', file, rank });
        if (type === 'king') pen.push(name);
      } else if (ch !== '.') throw new Error(`revenge-57 L${level}: bad plan char "${ch}"`);
    });
  });
  return make(level, pieces, {
    ...(opts.still ? STILL : FLEE),
    moveLimit: opts.moveLimit,
    hazards,
    kingPen: pen,
    ...(opts.enemiesPerTurn ? { enemiesPerTurn: opts.enemiesPerTurn } : {}),
  });
}

const STUB = (n: number) =>
  plan(
    n,
    [
      '........',
      '........',
      '........',
      '...k....',
      '........',
      '........',
      '........',
      '........',
    ],
    { moveLimit: 12, still: true },
  );

export const RUN_REVENGE_57: RunDef = {
  id: 'revenge-57',
  name: 'The Daisy Chain',
  blurb: 'Stub.',
  allowedAbilities: ['chain', 'magnet', 'shove', 'hourglass'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    plan(
      1,
      [
        '........',
        '....k...',
        '........',
        '.p.p....',
        '.#p#....',
        '..~.....',
        '........',
        '........',
      ],
      { moveLimit: 12, still: true },
    ),
    plan(
      2,
      [
        '########',
        '########',
        '##p#p###',
        '##~p~###',
        '###~###+',
        '....p.k#',
        '....~###',
        '....####',
      ],
      { moveLimit: 10 },
    ),
    plan(
      3,
      [
        '########',
        '########',
        '########',
        '#####p##',
        '..p.pk##',
        '.#~p~#+#',
        '.##~####',
        '..######',
      ],
      { moveLimit: 8 },
    ),
    plan(
      4,
      [
        '###+####',
        '##k#####',
        '##.#####',
        '##.#####',
        '....p###',
        '.###~###',
        '.#######',
        '..######',
      ],
      { moveLimit: 8 },
    ),
    plan(
      5,
      [
        '########',
        '########',
        '#p#.####',
        '#~#o..k#',
        '###.####',
        '###.####',
        '###.####',
        '..... ###'.replace(' ', ''),
      ],
      { moveLimit: 8 },
    ),
    plan(
      6,
      [
        '########',
        '###ppp##',
        '####p###',
        '##.pk###',
        '##.~####',
        '##.#####',
        '##.#####',
        '....####',
      ],
      { moveLimit: 8 },
    ),
    plan(
      7,
      [
        '########',
        '#####n##',
        'p#######',
        '#p..p#n#',
        '##p.pk##',
        '###.####',
        '###.####',
        '##...###',
      ],
      { moveLimit: 7 },
    ),
    plan(
      8,
      [
        '########',
        '##p#####',
        '#n######',
        '#.###p##',
        '#.p.pk##',
        '#.~p~#+#',
        '#.#~####',
        '...#####',
      ],
      { moveLimit: 7 },
    ),
    plan(
      9,
      [
        '########',
        '########',
        '########',
        '##p#n###',
        '..ppk###',
        '.####+##',
        '.#######',
        '..######',
      ],
      { moveLimit: 6 },
    ),
    plan(
      10,
      [
        '########',
        '###+####',
        '####kp##',
        '###pp###',
        '...ppn##',
        '.##~~~##',
        '.#######',
        '..######',
      ],
      { moveLimit: 8 },
    ),
  ],
};

export default RUN_REVENGE_57;
