# Paste-ready snippets (runs.ts style)

Each block drops into a `RunDef.levels` array next to RUN_REVENGE_1. `STILL` / `FLEE` / `X()` are the helpers declared above RUN_REVENGE_1.

## royal-guard-L1-v1 — score 96

```
8 | . . k . . . . .
7 | . p p p . . . .
6 | . . . . . . . .
5 | . . . . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pb7 pc7 pd7.
    make(
      1,
      [
        pawn(2, 7), pawn(3, 7), pawn(4, 7),
        king(3, 8),
      ],
      STILL,
    ),
```

## royal-guard-L1-v2 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . . . . . .
5 | . . . . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pe7 pf7 pg7.
    make(
      1,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7),
        king(6, 8),
      ],
      STILL,
    ),
```

## royal-guard-L1-v3 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . . . . . .
5 | . . . . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pe7 pf7 pg7.
    make(
      1,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7),
        king(6, 8),
      ],
      STILL,
    ),
```

## walled-court-L1-v1 — score 96

```
8 | . . k . . . . .
7 | . p p p . . . .
6 | . . . . . . . .
5 | . . . . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pb7 pc7 pd7.
    make(
      1,
      [
        pawn(2, 7), pawn(3, 7), pawn(4, 7),
        king(3, 8),
      ],
      STILL,
    ),
```

## walled-court-L1-v2 — score 96

```
8 | . . . . k . . .
7 | . . . p p p . .
6 | . . . . . . . .
5 | . . . . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pd7 pe7 pf7.
    make(
      1,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7),
        king(5, 8),
      ],
      STILL,
    ),
```

## walled-court-L1-v3 — score 96

```
8 | . . . . k . . .
7 | . . . p p p . .
6 | . . . . . . . .
5 | . . . . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pd7 pe7 pf7.
    make(
      1,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7),
        king(5, 8),
      ],
      STILL,
    ),
```

## royal-guard-L2-v1 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . p . . . p
5 | . . b . . . . .
4 | . . . . . . . .
3 | . . p . . . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6; hunters bc5; marchers ph3 pc3.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6),
        bishop(3, 5),
        pawn(8, 3), pawn(3, 3),
        king(6, 8),
      ],
      STILL,
    ),
```

## royal-guard-L2-v2 — score 96

```
8 | . . . . k . . .
7 | . . . p p p . .
6 | . . p . . . p .
5 | . b . . . . . .
4 | . . . . . . p .
3 | . p . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pd7 pe7 pf7 pc6 pg6; hunters bb5; marchers pg4 pb3.
    make(
      2,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7), pawn(3, 6), pawn(7, 6),
        bishop(2, 5),
        pawn(7, 4), pawn(2, 3),
        king(5, 8),
      ],
      STILL,
    ),
```

## royal-guard-L2-v3 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . p . . . p
5 | . . b . . . . .
4 | . . p . . . . .
3 | . . . . . . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6; hunters bc5; marchers ph3 pc4.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6),
        bishop(3, 5),
        pawn(8, 3), pawn(3, 4),
        king(6, 8),
      ],
      STILL,
    ),
```

## walled-court-L2-v1 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . p . . . p
5 | . . b . . . . .
4 | . . . . . . . .
3 | . . p . . . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6; hunters bc5; marchers ph3 pc3.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6),
        bishop(3, 5),
        pawn(8, 3), pawn(3, 3),
        king(6, 8),
      ],
      STILL,
    ),
```

## walled-court-L2-v2 — score 96

```
8 | . . . k . . . .
7 | . . p p p . . .
6 | . p . . . p . .
5 | . . . . . . b .
4 | . . . . . . . .
3 | . p . . . . . .
2 | . . . . . . p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pc7 pd7 pe7 pb6 pf6; hunters bg5; marchers pg2 pb3.
    make(
      2,
      [
        pawn(3, 7), pawn(4, 7), pawn(5, 7), pawn(2, 6), pawn(6, 6),
        bishop(7, 5),
        pawn(7, 2), pawn(2, 3),
        king(4, 8),
      ],
      STILL,
    ),
```

## walled-court-L2-v3 — score 96

```
8 | . . . . k . . .
7 | . . . p p p . .
6 | . . p . . . p .
5 | . b . . . . . .
4 | . . . . . . . .
3 | p . . . . . p .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pd7 pe7 pf7 pc6 pg6; hunters bb5; marchers pg3 pa3.
    make(
      2,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7), pawn(3, 6), pawn(7, 6),
        bishop(2, 5),
        pawn(7, 3), pawn(1, 3),
        king(5, 8),
      ],
      STILL,
    ),
```

## royal-guard-L3-v1 — score 96

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . . . . .
5 | . . . n . p . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | p . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE PAGE. 1 heavy hunter (knight) — sightlines, not bodies. Key f5.
    // Key pf5; hunters kd5; marchers pa2.
    make(
      3,
      [
        pawn(6, 5),
        knight(4, 5),
        pawn(1, 2),
        king(6, 8),
      ],
      {
        ...FLEE,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## royal-guard-L3-v2 — score 96

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . . . . . . . .
5 | . . p . . . . .
4 | n . . . . . . .
3 | . . . . . . . .
2 | . . . . . p . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE PAGE. 1 heavy hunter (knight) — sightlines, not bodies. Key c5.
    // Key pc5; hunters ka4; marchers pf2.
    make(
      3,
      [
        pawn(3, 5),
        knight(1, 4),
        pawn(6, 2),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## royal-guard-L3-v3 — score 96

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . . . . . .
5 | . . . . p . . .
4 | . . . . . . . .
3 | . . . . . . n .
2 | . . . . . . p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE PAGE. 1 heavy hunter (knight) — sightlines, not bodies. Key e5.
    // Key pe5; hunters kg3; marchers pg2.
    make(
      3,
      [
        pawn(5, 5),
        knight(7, 3),
        pawn(7, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## walled-court-L3-v1 — score 96

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . # . # . . . .
5 | . . p . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE GATE. 6 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc5.
    make(
      3,
      [
        pawn(3, 5),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(2, 6), X(4, 6)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## walled-court-L3-v2 — score 96

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . # . # .
5 | . . . . . p . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE GATE. 6 walls — side walls plus an inner wall with one door on the f-file.
    // Key pf5.
    make(
      3,
      [
        pawn(6, 5),
        king(6, 8),
      ],
      {
        ...FLEE,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8), X(5, 6), X(7, 6)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## walled-court-L3-v3 — score 96

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . # . # . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE GATE. 6 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd5.
    make(
      3,
      [
        pawn(4, 5),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(3, 6), X(5, 6)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## royal-guard-L4-v1 — score 100

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . . . p . . .
5 | . . . p . . . .
4 | . . . . . . b .
3 | . . . . . . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE BISHOP. 1 heavy hunter (bishop) — sightlines, not bodies. Key d5.
    // Key pd5; defended by pe6; hunters bg4; marchers ph3.
    make(
      4,
      [
        pawn(4, 5),
        pawn(5, 6),
        bishop(7, 4),
        pawn(8, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## royal-guard-L4-v2 — score 100

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . . . .
5 | . . . . p . . .
4 | . . . . . . . .
3 | . . . . . . . p
2 | . . b . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE BISHOP. 1 heavy hunter (bishop) — sightlines, not bodies. Key e5.
    // Key pe5; defended by pd6; hunters bc2; marchers ph3.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        bishop(3, 2),
        pawn(8, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## walled-court-L4-v1 — score 100

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . # . p . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | . b . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE PORTCULLIS. 5 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd5; defended by pe6; hunters bb3.
    make(
      4,
      [
        pawn(4, 5),
        pawn(5, 6),
        bishop(2, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(3, 6)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## walled-court-L4-v2 — score 100

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . # . p . . .
5 | . . . p . . . .
4 | b . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE PORTCULLIS. 5 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd5; defended by pe6; hunters ba4.
    make(
      4,
      [
        pawn(4, 5),
        pawn(5, 6),
        bishop(1, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(3, 6)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## walled-court-L4-v3 — score 100

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . # . p . . . .
5 | . . p . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . b .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE PORTCULLIS. 5 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc5; defended by pd6; hunters bg2.
    make(
      4,
      [
        pawn(3, 5),
        pawn(4, 6),
        bishop(7, 2),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(2, 6)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## royal-guard-L4-v3 — score 75

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . . . .
5 | . . . . p . . .
4 | . . . . . . . .
3 | . p . . . . . .
2 | . . b . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE BISHOP. 1 heavy hunter (bishop) — sightlines, not bodies. Key e5.
    // Key pe5; defended by pd6; hunters bc2; marchers pb3.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        bishop(3, 2),
        pawn(2, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## walled-court-L5-v1 — score 85

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . # . p . . . .
5 | . . p . . . . .
4 | . . . . . . . .
3 | . . . . . n . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — INNER WARD. 5 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc5; defended by pd6; hunters kf3.
    make(
      5,
      [
        pawn(3, 5),
        pawn(4, 6),
        knight(6, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(2, 6)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## walled-court-L5-v2 — score 85

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . # . p . . . .
5 | . . p . . . . .
4 | . . . . . . . n
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — INNER WARD. 5 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc5; defended by pd6; hunters kh4.
    make(
      5,
      [
        pawn(3, 5),
        pawn(4, 6),
        knight(8, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(2, 6)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## walled-court-L5-v3 — score 85

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . # .
5 | . . . . . p . .
4 | . . . . . . . n
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — INNER WARD. 5 walls — side walls plus an inner wall with one door on the f-file.
    // Key pf5; defended by pe6; hunters kh4.
    make(
      5,
      [
        pawn(6, 5),
        pawn(5, 6),
        knight(8, 4),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8), X(7, 6)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## royal-guard-L5-v2 — score 65

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . p . p . . . .
5 | . . p . . . . .
4 | . . . . q . . .
3 | p . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — HER MAJESTY. 1 heavy hunter (queen) — sightlines, not bodies. Key c5.
    // Key pc5; defended by pb6 pd6; hunters qe4; marchers pa3.
    make(
      5,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        queen(5, 4),
        pawn(1, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## royal-guard-L5-v3 — score 65

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . p . .
5 | . . . . p . . .
4 | . . q . . . . .
3 | . . . . . . . .
2 | . . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — HER MAJESTY. 1 heavy hunter (queen) — sightlines, not bodies. Key e5.
    // Key pe5; defended by pd6 pf6; hunters qc4; marchers pc2.
    make(
      5,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        queen(3, 4),
        pawn(3, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## royal-guard-L5-v1 — score 15

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | q p . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — HER MAJESTY. 1 heavy hunter (queen) — sightlines, not bodies. Key d5.
    // Key pd5; defended by pc6 pe6; hunters qa3; marchers pb3.
    make(
      5,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        queen(1, 3),
        pawn(2, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## walled-court-L6-v1 — score 75

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # p . p # .
5 | . . . . p . . .
4 | . . . . . . . .
3 | . q p . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE COURTYARD. 6 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe5; defended by pd6 pf6; hunters qb3; marchers pc3.
    make(
      6,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        queen(2, 3),
        pawn(3, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(3, 6), X(7, 6)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## walled-court-L6-v3 — score 75

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # p . p # . . .
5 | . . p . . . . .
4 | . . . . . q . .
3 | . . . . . . . .
2 | . . . . . p . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE COURTYARD. 6 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc5; defended by pb6 pd6; hunters qf4; marchers pf2.
    make(
      6,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        queen(6, 4),
        pawn(6, 2),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(1, 6), X(5, 6)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## royal-guard-L6-v2 — score 62.5

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . p . p . . . .
5 | . . p . . . . .
4 | p . . . p . q .
3 | . . . . . . . .
2 | . . . . . b . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — TWO COURTIERS. 2 heavy hunters (queen, bishop) — sightlines, not bodies. Key c5.
    // Key pc5; defended by pb6 pd6; hunters qg4 bf2; marchers pe4 pa4.
    make(
      6,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        queen(7, 4), bishop(6, 2),
        pawn(5, 4), pawn(1, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## walled-court-L6-v2 — score 62.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # p . p # . .
5 | . . . p . . . .
4 | . . . . . p . .
3 | . . . . . . . .
2 | q . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE COURTYARD. 6 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd5; defended by pc6 pe6; hunters qa2; marchers pf4.
    make(
      6,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        queen(1, 2),
        pawn(6, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(2, 6), X(6, 6)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## royal-guard-L6-v1 — score 50

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . . . p . . . .
4 | b . . . . . . .
3 | . p . . . q . .
2 | . . . . . p . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — TWO COURTIERS. 2 heavy hunters (queen, bishop) — sightlines, not bodies. Key d5.
    // Key pd5; defended by pc6 pe6; hunters qf3 ba4; marchers pb3 pf2.
    make(
      6,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        queen(6, 3), bishop(1, 4),
        pawn(2, 3), pawn(6, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## royal-guard-L6-v3 — score 50

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . p .
5 | . . . . . p . q
4 | . . . . . . . .
3 | . p . b . . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — TWO COURTIERS. 2 heavy hunters (queen, bishop) — sightlines, not bodies. Key f5.
    // Key pf5; defended by pe6 pg6; hunters qh5 bd3; marchers ph3 pb3.
    make(
      6,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        queen(8, 5), bishop(4, 3),
        pawn(8, 3), pawn(2, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## walled-court-L7-v2 — score 88.5

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | # p . p # . . .
4 | p . p . . p . .
3 | . . . . . . . n
2 | . . . . . q . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE BAILEY. 8 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc4; defended by pb5 pd5; hunters qf2 kh3; marchers pa4 pf4.
    make(
      7,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        queen(6, 2), knight(8, 3),
        pawn(1, 4), pawn(6, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(1, 5), X(5, 5)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```

## royal-guard-L7-v1 — score 67.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . . . p . . b .
4 | n . . . . p p .
3 | q . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE RETINUE. 3 heavy hunters (queen, bishop, knight) — sightlines, not bodies. Key d5.
    // Key pd5; defended by pc6 pe6; hunters qa3 bg5 ka4; marchers pf4 pg4.
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        queen(1, 3), bishop(7, 5), knight(1, 4),
        pawn(6, 4), pawn(7, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## royal-guard-L7-v2 — score 57.5

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . p . p . . . .
5 | . . p . . . . .
4 | . . . . . . p p
3 | b . . . . . . .
2 | n . . . . . . q
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE RETINUE. 3 heavy hunters (queen, bishop, knight) — sightlines, not bodies. Key c5.
    // Key pc5; defended by pb6 pd6; hunters qh2 ba3 ka2; marchers ph4 pg4.
    make(
      7,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        queen(8, 2), bishop(1, 3), knight(1, 2),
        pawn(8, 4), pawn(7, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## walled-court-L7-v1 — score 53.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | . p . p . . n .
3 | . . . . . q . .
2 | . . . . . . p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE BAILEY. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; hunters qf3 kg4; marchers pb4 pg2.
    make(
      7,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        queen(6, 3), knight(7, 4),
        pawn(2, 4), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(2, 5), X(6, 5)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```

## walled-court-L7-v3 — score 38.5

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . # p . p # .
4 | n . . . p . . .
3 | q . . . . . p .
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE BAILEY. 8 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe4; defended by pd5 pf5; hunters qa3 ka4; marchers pg3 pb2.
    make(
      7,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        queen(1, 3), knight(1, 4),
        pawn(7, 3), pawn(2, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(3, 5), X(7, 5)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## royal-guard-L7-v3 — score 30

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . b . p . . . .
4 | . . . . . . . .
3 | . . . . . p p .
2 | n q . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE RETINUE. 3 heavy hunters (queen, bishop, knight) — sightlines, not bodies. Key d5.
    // Key pd5; defended by pc6 pe6; hunters qb2 bb5 ka2; marchers pg3 pf3.
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        queen(2, 2), bishop(2, 5), knight(1, 2),
        pawn(7, 3), pawn(6, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## walled-court-L8-v2 — score 96

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . . # p . p #
4 | q . . p . p . p
3 | . . b . . . . .
2 | . p p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — CURTAIN WALL. 8 walls — side walls plus an inner wall with one door on the f-file.
    // Key pf4; defended by pe5 pg5; shell pd4 ph4; hunters qa4 bc3; marchers pc2 pb2.
    make(
      8,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        pawn(4, 4), pawn(8, 4),
        queen(1, 4), bishop(3, 3),
        pawn(3, 2), pawn(2, 2),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8), X(4, 5), X(8, 5)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## walled-court-L8-v3 — score 92

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | . p . p . p p .
3 | . . . . . b q p
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — CURTAIN WALL. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qg3 bf3; marchers pg4 ph3 pb2.
    make(
      8,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(7, 3), bishop(6, 3),
        pawn(7, 4), pawn(8, 3), pawn(2, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(2, 5), X(6, 5)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```

## walled-court-L8-v1 — score 71

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . . # p . p #
4 | q p . p . p . p
3 | . . . p . . . .
2 | p . . . . . . b
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — CURTAIN WALL. 8 walls — side walls plus an inner wall with one door on the f-file.
    // Key pf4; defended by pe5 pg5; shell pd4 ph4; hunters qa4 bh2; marchers pd3 pa2 pb4.
    make(
      8,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        pawn(4, 4), pawn(8, 4),
        queen(1, 4), bishop(8, 2),
        pawn(4, 3), pawn(1, 2), pawn(2, 4),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8), X(4, 5), X(8, 5)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## royal-guard-L8-v1 — score 46

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . . . p . p .
4 | . . p . . p . p
3 | b . . . . . . q
2 | . . . . . . . q
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — TWIN QUEENS. 3 heavy hunters (queen, queen, bishop) — sightlines, not bodies. Key f4.
    // Key pf4; defended by pe5 pg5; hunters qh2 qh3 ba3; marchers pc4 ph4.
    make(
      8,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        queen(8, 2), queen(8, 3), bishop(1, 3),
        pawn(3, 4), pawn(8, 4),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## royal-guard-L8-v2 — score 33.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . . . p . p .
4 | . p p . . p . .
3 | q . . b . . . .
2 | . . . q . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — TWIN QUEENS. 3 heavy hunters (queen, queen, bishop) — sightlines, not bodies. Key f4.
    // Key pf4; defended by pe5 pg5; hunters qa3 qd2 bd3; marchers pc4 pb4.
    make(
      8,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        queen(1, 3), queen(4, 2), bishop(4, 3),
        pawn(3, 4), pawn(2, 4),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## royal-guard-L8-v3 — score 6.8

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . . p . p . . .
4 | . . . p . q . q
3 | . . . . . b . .
2 | p p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — TWIN QUEENS. 3 heavy hunters (queen, queen, bishop) — sightlines, not bodies. Key d4.
    // Key pd4; defended by pc5 pe5; hunters qh4 qf4 bf3; marchers pa2 pb2.
    make(
      8,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        queen(8, 4), queen(6, 4), bishop(6, 3),
        pawn(1, 2), pawn(2, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```

## royal-guard-L9-v3 — score 91

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . . p . p . .
4 | . b p . p . p p
3 | . n q . . . . .
2 | . p . . . . q .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE PRIVY COUNCIL. 4 heavy hunters (queen, queen, bishop, knight) — sightlines, not bodies. Key e4.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4; hunters qg2 qc3 bb4 kb3; marchers ph4 pb2.
    make(
      9,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4),
        queen(7, 2), queen(3, 3), bishop(2, 4), knight(2, 3),
        pawn(8, 4), pawn(2, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## royal-guard-L9-v1 — score 63.5

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . . p . p . .
4 | . n p . p . p p
3 | b . p . . . q q
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE PRIVY COUNCIL. 4 heavy hunters (queen, queen, bishop, knight) — sightlines, not bodies. Key e4.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4; hunters qh3 qg3 ba3 kb4; marchers pc3 ph4.
    make(
      9,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4),
        queen(8, 3), queen(7, 3), bishop(1, 3), knight(2, 4),
        pawn(3, 3), pawn(8, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## royal-guard-L9-v2 — score 58

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | . p . p . . . .
4 | p . p . p . p q
3 | . . . . b p . .
2 | . . . . n q . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE PRIVY COUNCIL. 4 heavy hunters (queen, queen, bishop, knight) — sightlines, not bodies. Key c4.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4; hunters qf2 qh4 be3 ke2; marchers pf3 pg4.
    make(
      9,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4),
        queen(6, 2), queen(8, 4), bishop(5, 3), knight(5, 2),
        pawn(6, 3), pawn(7, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```

## walled-court-L9-v2 — score 45.5

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . # p . p # .
4 | p . p . p . p n
3 | . p . . . . q .
2 | b . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE INNER KEEP. 8 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4; hunters qg3 ba2 kh4; marchers pa4 pb3.
    make(
      9,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4),
        queen(7, 3), bishop(1, 2), knight(8, 4),
        pawn(1, 4), pawn(2, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(3, 5), X(7, 5)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## walled-court-L9-v3 — score -24.7

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | . p . p . p p .
3 | b q . . . n . p
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE INNER KEEP. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qb3 ba3 kf3; marchers ph3 pg4 pb2.
    make(
      9,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(2, 3), bishop(1, 3), knight(6, 3),
        pawn(8, 3), pawn(7, 4), pawn(2, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(2, 5), X(6, 5)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```

## walled-court-L9-v1 — score -52

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | . p . p . p . p
3 | p q . . . n . b
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE INNER KEEP. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qb3 bh3 kf3; marchers pb2 pa3 ph4.
    make(
      9,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(2, 3), bishop(8, 3), knight(6, 3),
        pawn(2, 2), pawn(1, 3), pawn(8, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(2, 5), X(6, 5)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```

## royal-guard-L10-v2 — score 91

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . q . p . p . .
4 | p . p . p . p q
3 | . n b . . . p .
2 | . b . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE ROYAL GUARD. 5 heavy hunters (queen, queen, bishop, bishop, knight) — sightlines, not bodies. Key e4.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4; hunters qh4 qb5 bc3 bb2 kb3; marchers pg3 pa4.
    make(
      10,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4),
        queen(8, 4), queen(2, 5), bishop(3, 3), bishop(2, 2), knight(2, 3),
        pawn(7, 3), pawn(1, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## walled-court-L10-v1 — score 91

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | . p . p . p . p
3 | b p . . . p . q
2 | . . . . . n . q
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE FORTRESS. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qh3 qh2 kf2 ba3; marchers pf3 pb3 ph4.
    make(
      10,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(8, 3), queen(8, 2), knight(6, 2), bishop(1, 3),
        pawn(6, 3), pawn(2, 3), pawn(8, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 17,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(2, 5), X(6, 5)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```

## royal-guard-L10-v3 — score 88.5

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | . p . p . . . n
4 | p . p . p p . .
3 | q . . . . . . q
2 | b . . . . . b .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE ROYAL GUARD. 5 heavy hunters (queen, queen, bishop, bishop, knight) — sightlines, not bodies. Key c4.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4; hunters qh3 qa3 ba2 bg2 kh5; marchers pf4.
    make(
      10,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4),
        queen(8, 3), queen(1, 3), bishop(1, 2), bishop(7, 2), knight(8, 5),
        pawn(6, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```

## royal-guard-L10-v1 — score 4.5

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . n p . p . .
4 | . . p . p . p p
3 | . p . . . . q b
2 | . b q . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE ROYAL GUARD. 5 heavy hunters (queen, queen, bishop, bishop, knight) — sightlines, not bodies. Key e4.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4; hunters qc2 qg3 bb2 bh3 kc5; marchers ph4 pb3.
    make(
      10,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4),
        queen(3, 2), queen(7, 3), bishop(2, 2), bishop(8, 3), knight(3, 5),
        pawn(8, 4), pawn(2, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 17,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## walled-court-L10-v2 — score 3.5

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . # p . p # .
4 | p . p . p . p q
3 | b q p . . . . .
2 | . n . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE FORTRESS. 8 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4; hunters qb3 qh4 kb2 ba3; marchers pa4 pc3.
    make(
      10,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4),
        queen(2, 3), queen(8, 4), knight(2, 2), bishop(1, 3),
        pawn(1, 4), pawn(3, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 17,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(3, 5), X(7, 5)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## walled-court-L10-v3 — score -52.2

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | # p . p # . . .
4 | p . p . p p q q
3 | p . . . n . p .
2 | b . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE FORTRESS. 8 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4; hunters qh4 qg4 ke3 ba2; marchers pf4 pa3 pg3.
    make(
      10,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4),
        queen(8, 4), queen(7, 4), knight(5, 3), bishop(1, 2),
        pawn(6, 4), pawn(1, 3), pawn(7, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(1, 5), X(5, 5)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```
