# Paste-ready snippets (runs.ts style)

Each block drops into a `RunDef.levels` array next to RUN_REVENGE_1. `STILL` / `FLEE` / `X()` are the helpers declared above RUN_REVENGE_1.

## swarm-L1-v1 — score 96

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

## swarm-L1-v2 — score 96

```
8 | . . . k . . . .
7 | . . p p p . . .
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
    // shell pc7 pd7 pe7.
    make(
      1,
      [
        pawn(3, 7), pawn(4, 7), pawn(5, 7),
        king(4, 8),
      ],
      STILL,
    ),
```

## royal-guard-L1-v1 — score 96

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

## royal-guard-L1-v2 — score 96

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

## double-key-L1-v1 — score 96

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

## double-key-L1-v2 — score 96

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

## open-flank-L1-v1 — score 96

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

## open-flank-L1-v2 — score 96

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

## corner-keep-L1-v1 — score 96

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

## corner-keep-L1-v2 — score 96

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
8 | . . . k . . . .
7 | . . p p p . . .
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
    // shell pc7 pd7 pe7.
    make(
      1,
      [
        pawn(3, 7), pawn(4, 7), pawn(5, 7),
        king(4, 8),
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

## swarm-L2-v2 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . p . . . p
5 | . . . . p . p .
4 | . . . . . . . p
3 | . . . . . . . .
2 | . . . p . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6 pe5 pg5; marchers pd2 ph4.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6), pawn(5, 5), pawn(7, 5),
        pawn(4, 2), pawn(8, 4),
        king(6, 8),
      ],
      STILL,
    ),
```

## royal-guard-L2-v1 — score 96

```
8 | . . . . k . . .
7 | . . . p p p . .
6 | . . p . . . p .
5 | . b . . . . . .
4 | p . . . . . . .
3 | . . . . . . . .
2 | . . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pd7 pe7 pf7 pc6 pg6; hunters bb5; marchers pc2 pa4.
    make(
      2,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7), pawn(3, 6), pawn(7, 6),
        bishop(2, 5),
        pawn(3, 2), pawn(1, 4),
        king(5, 8),
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
4 | . . p . . . . .
3 | . . . . . . . .
2 | p . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pd7 pe7 pf7 pc6 pg6; hunters bb5; marchers pc4 pa2.
    make(
      2,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7), pawn(3, 6), pawn(7, 6),
        bishop(2, 5),
        pawn(3, 4), pawn(1, 2),
        king(5, 8),
      ],
      STILL,
    ),
```

## double-key-L2-v1 — score 96

```
8 | . . . k . . . .
7 | . . p p p . . .
6 | . p . . . p . .
5 | . . . . . . . .
4 | . . . . . . n .
3 | p p . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pc7 pd7 pe7 pb6 pf6; hunters kg4; marchers pb3 pa3.
    make(
      2,
      [
        pawn(3, 7), pawn(4, 7), pawn(5, 7), pawn(2, 6), pawn(6, 6),
        knight(7, 4),
        pawn(2, 3), pawn(1, 3),
        king(4, 8),
      ],
      STILL,
    ),
```

## double-key-L2-v2 — score 96

```
8 | . . . . k . . .
7 | . . . p p p . .
6 | . . p . . . p .
5 | . . . . . . . .
4 | . n . . . . . .
3 | . p p . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pd7 pe7 pf7 pc6 pg6; hunters kb4; marchers pc3 pb3.
    make(
      2,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7), pawn(3, 6), pawn(7, 6),
        knight(2, 4),
        pawn(3, 3), pawn(2, 3),
        king(5, 8),
      ],
      STILL,
    ),
```

## corner-keep-L2-v1 — score 96

```
8 | . . k . . . . .
7 | . p p p . . . .
6 | p . . . p . . .
5 | . . . . . . . .
4 | p . . . . n . .
3 | . . . . . . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pb7 pc7 pd7 pa6 pe6; hunters kf4; marchers pa4 ph3.
    make(
      2,
      [
        pawn(2, 7), pawn(3, 7), pawn(4, 7), pawn(1, 6), pawn(5, 6),
        knight(6, 4),
        pawn(1, 4), pawn(8, 3),
        king(3, 8),
      ],
      STILL,
    ),
```

## corner-keep-L2-v2 — score 96

```
8 | . . . k . . . .
7 | . . p p p . . .
6 | . p . . . p . .
5 | . . . . . . . .
4 | . . . . . . n .
3 | p . . . . . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pc7 pd7 pe7 pb6 pf6; hunters kg4; marchers ph3 pa3.
    make(
      2,
      [
        pawn(3, 7), pawn(4, 7), pawn(5, 7), pawn(2, 6), pawn(6, 6),
        knight(7, 4),
        pawn(8, 3), pawn(1, 3),
        king(4, 8),
      ],
      STILL,
    ),
```

## walled-court-L2-v1 — score 96

```
8 | . . . . k . . .
7 | . . . p p p . .
6 | . . p . . . p .
5 | . b . . . . . .
4 | . . . . . . p .
3 | p . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pd7 pe7 pf7 pc6 pg6; hunters bb5; marchers pg4 pa3.
    make(
      2,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7), pawn(3, 6), pawn(7, 6),
        bishop(2, 5),
        pawn(7, 4), pawn(1, 3),
        king(5, 8),
      ],
      STILL,
    ),
```

## walled-court-L2-v2 — score 96

```
8 | . . k . . . . .
7 | . p p p . . . .
6 | p . . . p . . .
5 | . . . . . b . .
4 | p . . . . . . .
3 | . . . . . p . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pb7 pc7 pd7 pa6 pe6; hunters bf5; marchers pa4 pf3.
    make(
      2,
      [
        pawn(2, 7), pawn(3, 7), pawn(4, 7), pawn(1, 6), pawn(5, 6),
        bishop(6, 5),
        pawn(1, 4), pawn(6, 3),
        king(3, 8),
      ],
      STILL,
    ),
```

## swarm-L2-v1 — score 92

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . p . . . p
5 | . . . . p . p .
4 | . . . p . . . .
3 | . . p . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6 pe5 pg5; marchers pc3 pd4.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6), pawn(5, 5), pawn(7, 5),
        pawn(3, 3), pawn(4, 4),
        king(6, 8),
      ],
      STILL,
    ),
```

## open-flank-L2-v1 — score 92

```
8 | . . k . . . . .
7 | . p p p . . . .
6 | p . . . p . . .
5 | . . . . . . . .
4 | . . . . . n p .
3 | . . . . . . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pb7 pc7 pd7 pa6 pe6; hunters kf4; marchers pg4 ph3.
    make(
      2,
      [
        pawn(2, 7), pawn(3, 7), pawn(4, 7), pawn(1, 6), pawn(5, 6),
        knight(6, 4),
        pawn(7, 4), pawn(8, 3),
        king(3, 8),
      ],
      STILL,
    ),
```

## open-flank-L2-v2 — score 92

```
8 | . . . k . . . .
7 | . . p p p . . .
6 | . p . . . p . .
5 | . . . . . . . .
4 | . p . . . . n .
3 | p . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pc7 pd7 pe7 pb6 pf6; hunters kg4; marchers pa3 pb4.
    make(
      2,
      [
        pawn(3, 7), pawn(4, 7), pawn(5, 7), pawn(2, 6), pawn(6, 6),
        knight(7, 4),
        pawn(1, 3), pawn(2, 4),
        king(4, 8),
      ],
      STILL,
    ),
```

## swarm-L3-v1 — score 96

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . . . . . . . .
5 | . . p . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE DOOR. 1 pawns. 0-ring shell around the c5 key; dismantle the chain from the outside in.
    // Key pc5.
    make(
      3,
      [
        pawn(3, 5),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## swarm-L3-v2 — score 96

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . . . . . . . .
5 | . . p . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE DOOR. 1 pawns. 0-ring shell around the c5 key; dismantle the chain from the outside in.
    // Key pc5.
    make(
      3,
      [
        pawn(3, 5),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## royal-guard-L3-v1 — score 96

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . . . . . . . .
5 | . . p . . . . .
4 | . . . . . . . .
3 | . . . . . . . n
2 | . . . . . . . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE PAGE. 1 heavy hunter (knight) — sightlines, not bodies. Key c5.
    // Key pc5; hunters kh3; marchers ph2.
    make(
      3,
      [
        pawn(3, 5),
        knight(8, 3),
        pawn(8, 2),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## royal-guard-L3-v2 — score 96

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . . . . . .
5 | . . . . p . . .
4 | . . . . . . . .
3 | n . . . . . . .
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE PAGE. 1 heavy hunter (knight) — sightlines, not bodies. Key e5.
    // Key pe5; hunters ka3; marchers pb2.
    make(
      3,
      [
        pawn(5, 5),
        knight(1, 3),
        pawn(2, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## open-flank-L3-v1 — score 96

```
8 | . . # : k : # .
7 | . . . : : : # .
6 | . . . . . . . .
5 | . . . . p . . .
4 | . . n . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — SIDE DOOR. left flank open; 1 knight posted to cover it. Key e5.
    // Key pe5; hunters kc4.
    make(
      3,
      [
        pawn(5, 5),
        knight(3, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## open-flank-L3-v2 — score 96

```
8 | # : k : # . . .
7 | # : : : . . . .
6 | . . . . . . . .
5 | . . p . . . . .
4 | . . . . . . n .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — SIDE DOOR. right flank open; 1 knight posted to cover it. Key c5.
    // Key pc5; hunters kg4.
    make(
      3,
      [
        pawn(3, 5),
        knight(7, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## corner-keep-L3-v1 — score 96

```
8 | k : # . . . . .
7 | : : # . . . . .
6 | . . . . . . . .
5 | p . . . . . . .
4 | . . . . . . . .
3 | . . . . n . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — CORNER OFFICE. 2x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; hunters ke3.
    make(
      3,
      [
        pawn(1, 5),
        knight(5, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(3, 8)],
        kingPen: ['a8', 'b8', 'a7', 'b7'],
      },
    ),
```

## corner-keep-L3-v2 — score 96

```
8 | k : # . . . . .
7 | : : # . . . . .
6 | . . . . . . . .
5 | p . . . . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . n . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — CORNER OFFICE. 2x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; hunters kc2.
    make(
      3,
      [
        pawn(1, 5),
        knight(3, 2),
        king(1, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(3, 8)],
        kingPen: ['a8', 'b8', 'a7', 'b7'],
      },
    ),
```

## walled-court-L3-v1 — score 96

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . # . # . .
5 | . . . . p . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE GATE. 6 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe5.
    make(
      3,
      [
        pawn(5, 5),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(4, 6), X(6, 6)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## walled-court-L3-v2 — score 96

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

## swarm-L4-v1 — score 100

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . . . .
5 | . . . . p . . .
4 | . . n . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — ONE GUARD. 2 pawns. 0-ring shell around the e5 key; dismantle the chain from the outside in.
    // Key pe5; defended by pd6; hunters kc4.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        knight(3, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## swarm-L4-v2 — score 100

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . . . p . . .
5 | n . . p . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — ONE GUARD. 2 pawns. 0-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pe6; hunters ka5.
    make(
      4,
      [
        pawn(4, 5),
        pawn(5, 6),
        knight(1, 5),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## royal-guard-L4-v1 — score 100

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . . . p . . . .
5 | . . p . . . . .
4 | . . . . . . . .
3 | p . . . . . b .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE BISHOP. 1 heavy hunter (bishop) — sightlines, not bodies. Key c5.
    // Key pc5; defended by pd6; hunters bg3; marchers pa3.
    make(
      4,
      [
        pawn(3, 5),
        pawn(4, 6),
        bishop(7, 3),
        pawn(1, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## royal-guard-L4-v2 — score 100

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . . .
5 | . . . . . p . .
4 | . . . . . . . .
3 | p b . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE BISHOP. 1 heavy hunter (bishop) — sightlines, not bodies. Key f5.
    // Key pf5; defended by pe6; hunters bb3; marchers pa3.
    make(
      4,
      [
        pawn(6, 5),
        pawn(5, 6),
        bishop(2, 3),
        pawn(1, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## open-flank-L4-v1 — score 100

```
8 | . . # : k : # .
7 | . . . : : : # .
6 | . . . p . . . .
5 | . . . . p . . .
4 | . . n . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE PICKET. left flank open; 1 knight posted to cover it. Key e5.
    // Key pe5; defended by pd6; hunters kc4.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        knight(3, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## open-flank-L4-v2 — score 100

```
8 | . # : k : # . .
7 | . # : : : . . .
6 | . . . . p . . .
5 | . . . p . . . .
4 | . . . . . . . n
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE PICKET. right flank open; 1 knight posted to cover it. Key d5.
    // Key pd5; defended by pe6; hunters kh4.
    make(
      4,
      [
        pawn(4, 5),
        pawn(5, 6),
        knight(8, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## walled-court-L4-v1 — score 100

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . # . p . . . .
5 | . . p . . . . .
4 | . . . . . . b .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE PORTCULLIS. 5 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc5; defended by pd6; hunters bg4.
    make(
      4,
      [
        pawn(3, 5),
        pawn(4, 6),
        bishop(7, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(2, 6)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## walled-court-L4-v2 — score 100

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . # . .
5 | . . . . p . . .
4 | b . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE PORTCULLIS. 5 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe5; defended by pd6; hunters ba4.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        bishop(1, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(6, 6)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## double-key-L4-v1 — score 96

```
8 | # : : : . . . .
7 | # : k : . p . .
6 | . p . p . . . .
5 | . . p . . . . .
4 | . . . . n . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — TWO DOORS. two keys — c5 on his file, f7 on his rank; the right wall is gone.
    // Keys pc5 pf7; defended by pb6 pd6; hunters ke4.
    make(
      4,
      [
        pawn(3, 5), pawn(6, 7),
        pawn(2, 6), pawn(4, 6),
        knight(5, 4),
        king(3, 7),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(1, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## double-key-L4-v2 — score 96

```
8 | . # : : : . . .
7 | . # : k : . p .
6 | . . p . p . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | . . . . . . . n
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — TWO DOORS. two keys — d5 on his file, g7 on his rank; the right wall is gone.
    // Keys pd5 pg7; defended by pc6 pe6; hunters kh3.
    make(
      4,
      [
        pawn(4, 5), pawn(7, 7),
        pawn(3, 6), pawn(5, 6),
        knight(8, 3),
        king(4, 7),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(2, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## corner-keep-L4-v1 — score 96

```
8 | k : # . . . . .
7 | : : # . . . . .
6 | . . . . . . . .
5 | p . . . . . . .
4 | . . . . . n . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE CLOSET. 2x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; hunters kf4.
    make(
      4,
      [
        pawn(1, 5),
        knight(6, 4),
        king(1, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(3, 8)],
        kingPen: ['a8', 'b8', 'a7', 'b7'],
      },
    ),
```

## corner-keep-L4-v2 — score 96

```
8 | . . . . . # : k
7 | . . . . . # : :
6 | . . . . . . . .
5 | . . . . . . . p
4 | . n . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE CLOSET. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; hunters kb4.
    make(
      4,
      [
        pawn(8, 5),
        knight(2, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        hazards: [X(6, 7), X(6, 8)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
```

## swarm-L5-v2 — score 97.5

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . p . .
5 | . . p . p . p .
4 | . . n . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE HEDGE. 5 pawns. 1-ring shell around the e5 key; dismantle the chain from the outside in.
    // Key pe5; defended by pd6 pf6; shell pc5 pg5; hunters kc4.
    make(
      5,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        pawn(3, 5), pawn(7, 5),
        knight(3, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## swarm-L5-v1 — score 85

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . p . p . p . .
4 | . . . . . n . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE HEDGE. 5 pawns. 1-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kf4.
    make(
      5,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 4),
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

## double-key-L5-v1 — score 85

```
8 | . # : : : p . p
7 | . # : k : . p .
6 | . . p . p . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | . n . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — TWO LOCKS. two keys — d5 on his file, g7 on his rank; the right wall is gone.
    // Keys pd5 pg7; defended by pc6 pe6 pf8 ph8; hunters kb3.
    make(
      5,
      [
        pawn(4, 5), pawn(7, 7),
        pawn(3, 6), pawn(5, 6), pawn(6, 8), pawn(8, 8),
        knight(2, 3),
        king(4, 7),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 7), X(2, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## double-key-L5-v2 — score 85

```
8 | . # : : : p . p
7 | . # : k : . p .
6 | . . p . p . . .
5 | . . . p . . . .
4 | n . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — TWO LOCKS. two keys — d5 on his file, g7 on his rank; the right wall is gone.
    // Keys pd5 pg7; defended by pc6 pe6 pf8 ph8; hunters ka4.
    make(
      5,
      [
        pawn(4, 5), pawn(7, 7),
        pawn(3, 6), pawn(5, 6), pawn(6, 8), pawn(8, 8),
        knight(1, 4),
        king(4, 7),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 7), X(2, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## open-flank-L5-v1 — score 85

```
8 | # : k : # . . .
7 | # : : : . . . .
6 | . . . p . . n .
5 | . . p . . . . .
4 | . . . . . . n .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — HORSE GUARD. right flank open; 2 knights posted to cover it. Key c5.
    // Key pc5; defended by pd6; hunters kg4 kg6.
    make(
      5,
      [
        pawn(3, 5),
        pawn(4, 6),
        knight(7, 4), knight(7, 6),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(1, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## open-flank-L5-v2 — score 85

```
8 | # : k : # . . .
7 | # : : : . . . .
6 | . . . p n . . .
5 | . . p . . . . .
4 | . . . . . . n .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — HORSE GUARD. right flank open; 2 knights posted to cover it. Key c5.
    // Key pc5; defended by pd6; hunters kg4 ke6.
    make(
      5,
      [
        pawn(3, 5),
        pawn(4, 6),
        knight(7, 4), knight(5, 6),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(1, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## corner-keep-L5-v1 — score 85

```
8 | . . . . . # : k
7 | . . . . . # : :
6 | . . . . . . p .
5 | . . . . . . . p
4 | . . b . . . . .
3 | . . n . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE TOWER. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; defended by pg6; hunters kc3 bc4.
    make(
      5,
      [
        pawn(8, 5),
        pawn(7, 6),
        knight(3, 3), bishop(3, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(6, 7), X(6, 8)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
```

## corner-keep-L5-v2 — score 85

```
8 | k : # . . . . .
7 | : : # . . . . .
6 | . p . . . . . .
5 | p . . . . b . .
4 | . . . . . . . .
3 | . . . . n . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE TOWER. 2x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters ke3 bf5.
    make(
      5,
      [
        pawn(1, 5),
        pawn(2, 6),
        knight(5, 3), bishop(6, 5),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 7), X(3, 8)],
        kingPen: ['a8', 'b8', 'a7', 'b7'],
      },
    ),
```

## walled-court-L5-v1 — score 85

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . # . p . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | . . . . . n . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — INNER WARD. 5 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd5; defended by pe6; hunters kf3.
    make(
      5,
      [
        pawn(4, 5),
        pawn(5, 6),
        knight(6, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(3, 6)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## walled-court-L5-v2 — score 85

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . # .
5 | . . . . . p . .
4 | . . . . . . . .
3 | . . . . . . . n
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — INNER WARD. 5 walls — side walls plus an inner wall with one door on the f-file.
    // Key pf5; defended by pe6; hunters kh3.
    make(
      5,
      [
        pawn(6, 5),
        pawn(5, 6),
        knight(8, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
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
4 | q . . . . . . .
3 | . . . . . . . .
2 | . . . . p . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — HER MAJESTY. 1 heavy hunter (queen) — sightlines, not bodies. Key c5.
    // Key pc5; defended by pb6 pd6; hunters qa4; marchers pe2.
    make(
      5,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        queen(1, 4),
        pawn(5, 2),
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

## royal-guard-L5-v1 — score -22.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . p .
5 | . . . . . p . .
4 | . . . . . . . .
3 | q . . . . . . .
2 | . . . . . . . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — HER MAJESTY. 1 heavy hunter (queen) — sightlines, not bodies. Key f5.
    // Key pf5; defended by pe6 pg6; hunters qa3; marchers ph2.
    make(
      5,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        queen(1, 3),
        pawn(8, 2),
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

## walled-court-L6-v2 — score 87.5

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # p . p # .
5 | . . . . p . . .
4 | . . q . . . p .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE COURTYARD. 6 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe5; defended by pd6 pf6; hunters qc4; marchers pg4.
    make(
      6,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        queen(3, 4),
        pawn(7, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(3, 6), X(7, 6)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## walled-court-L6-v1 — score 62.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # p . p # . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | . . . . . . q .
2 | . . . . . p . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE COURTYARD. 6 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd5; defended by pc6 pe6; hunters qg3; marchers pf2.
    make(
      6,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        queen(7, 3),
        pawn(6, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(2, 6), X(6, 6)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## royal-guard-L6-v1 — score 50

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . p . .
5 | b . . . p . . .
4 | . p . . . . . p
3 | . . . . . . . .
2 | . . . . . . q .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — TWO COURTIERS. 2 heavy hunters (queen, bishop) — sightlines, not bodies. Key e5.
    // Key pe5; defended by pd6 pf6; hunters qg2 ba5; marchers ph4 pb4.
    make(
      6,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        queen(7, 2), bishop(1, 5),
        pawn(8, 4), pawn(2, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## royal-guard-L6-v2 — score 50

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . p . p . . . .
5 | . . p . . . . .
4 | . . . . . b . p
3 | . . . . . . . .
2 | q . . . p . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — TWO COURTIERS. 2 heavy hunters (queen, bishop) — sightlines, not bodies. Key c5.
    // Key pc5; defended by pb6 pd6; hunters qa2 bf4; marchers ph4 pe2.
    make(
      6,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        queen(1, 2), bishop(6, 4),
        pawn(8, 4), pawn(5, 2),
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

## swarm-L6-v1 — score 25

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . p . p . p . .
4 | . . . . . . . .
3 | . p . . . n . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THICKET. 6 pawns. 1-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kf3; marchers pb3.
    make(
      6,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 3),
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

## swarm-L6-v2 — score 25

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . p . p . p . .
4 | . . . . . . . .
3 | . . . . . p . n
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THICKET. 6 pawns. 1-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kh3; marchers pf3.
    make(
      6,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(8, 3),
        pawn(6, 3),
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

## double-key-L6-v1 — score 25

```
8 | p . p : : : # .
7 | . p . : k : # .
6 | . . . p . p . .
5 | . . . . p . . .
4 | . . . . . . . .
3 | n . . . . . b .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE CROSSING. two keys — e5 on his file, b7 on his rank; the left wall is gone.
    // Keys pe5 pb7; defended by pd6 pf6 pa8 pc8; hunters ka3 bg3.
    make(
      6,
      [
        pawn(5, 5), pawn(2, 7),
        pawn(4, 6), pawn(6, 6), pawn(1, 8), pawn(3, 8),
        knight(1, 3), bishop(7, 3),
        king(5, 7),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(7, 7), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## double-key-L6-v2 — score 25

```
8 | # : : : p . p .
7 | # : k : . p . .
6 | . p . p . . . .
5 | . . p . . . . .
4 | . . . . . . . .
3 | . . . . n . . b
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE CROSSING. two keys — c5 on his file, f7 on his rank; the right wall is gone.
    // Keys pc5 pf7; defended by pb6 pd6 pe8 pg8; hunters ke3 bh3.
    make(
      6,
      [
        pawn(3, 5), pawn(6, 7),
        pawn(2, 6), pawn(4, 6), pawn(5, 8), pawn(7, 8),
        knight(5, 3), bishop(8, 3),
        king(3, 7),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(1, 7), X(1, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## open-flank-L6-v1 — score 25

```
8 | . . . # : k : #
7 | . . . . : : : #
6 | . n . . p . p .
5 | . n . . . p . .
4 | . . . . . . . .
3 | . . . b . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE FLANK. left flank open; 2 knights posted to cover it. Key f5.
    // Key pf5; defended by pe6 pg6; hunters kb6 kb5 bd3.
    make(
      6,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        knight(2, 6), knight(2, 5), bishop(4, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(8, 7), X(8, 8), X(4, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## open-flank-L6-v2 — score 25

```
8 | . # : k : # . .
7 | . # : : : . . .
6 | . . p . p . . n
5 | . . . p . n . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . b . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE FLANK. right flank open; 2 knights posted to cover it. Key d5.
    // Key pd5; defended by pc6 pe6; hunters kf5 kh6 bb2.
    make(
      6,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        knight(6, 5), knight(8, 6), bishop(2, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(2, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## corner-keep-L6-v1 — score 25

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . . . . . .
4 | . . . . n . b .
3 | . . . . . . . .
2 | . . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE KEEP. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters ke4 bg4; marchers pc2.
    make(
      6,
      [
        pawn(1, 5),
        pawn(2, 6),
        knight(5, 4), bishop(7, 4),
        pawn(3, 2),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7'],
      },
    ),
```

## corner-keep-L6-v2 — score 25

```
8 | . . . . # : : k
7 | . . . . # : : :
6 | . . . . . . p .
5 | . . . . . . . p
4 | . . . . . . . .
3 | . p n . . . . .
2 | . . . b . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE KEEP. 3x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; defended by pg6; hunters kc3 bd2; marchers pb3.
    make(
      6,
      [
        pawn(8, 5),
        pawn(7, 6),
        knight(3, 3), bishop(4, 2),
        pawn(2, 3),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(5, 7), X(5, 8)],
        kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7'],
      },
    ),
```

## corner-keep-L7-v2 — score 95

```
8 | . . . . # : : k
7 | . . . . # : : :
6 | . . . . . . p .
5 | n . . . . . . p
4 | . . . q . . . .
3 | . p . . . . . .
2 | . b . . . p . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE DONJON. 3x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; defended by pg6; hunters qd4 bb2 ka5; marchers pf2 pb3.
    make(
      7,
      [
        pawn(8, 5),
        pawn(7, 6),
        queen(4, 4), bishop(2, 2), knight(1, 5),
        pawn(6, 2), pawn(2, 3),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(5, 7), X(5, 8)],
        kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7'],
      },
    ),
```

## corner-keep-L7-v1 — score 92.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . b . . . .
4 | . . . . . . . p
3 | . . . . n . . .
2 | . . . . . q p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE DONJON. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters qf2 bd5 ke3; marchers ph4 pg2.
    make(
      7,
      [
        pawn(1, 5),
        pawn(2, 6),
        queen(6, 2), bishop(4, 5), knight(5, 3),
        pawn(8, 4), pawn(7, 2),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7'],
      },
    ),
```

## royal-guard-L7-v2 — score 80

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . p . .
5 | n b . . p . . .
4 | . . . . . . . .
3 | p . . . . . . q
2 | . . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE RETINUE. 3 heavy hunters (queen, bishop, knight) — sightlines, not bodies. Key e5.
    // Key pe5; defended by pd6 pf6; hunters qh3 bb5 ka5; marchers pc2 pa3.
    make(
      7,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        queen(8, 3), bishop(2, 5), knight(1, 5),
        pawn(3, 2), pawn(1, 3),
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

## swarm-L7-v1 — score 70

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . p . p . p . .
4 | p . . . . . . .
3 | . . . . . n . .
2 | . . . . . . p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — BRAMBLE. 7 pawns. 2-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kf3; marchers pa4 pg2.
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 3),
        pawn(1, 4), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## walled-court-L7-v1 — score 63.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . . # p . p #
4 | . . . . . p . .
3 | n . p p . . . q
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE BAILEY. 8 walls — side walls plus an inner wall with one door on the f-file.
    // Key pf4; defended by pe5 pg5; hunters qh3 ka3; marchers pd3 pc3.
    make(
      7,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        queen(8, 3), knight(1, 3),
        pawn(4, 3), pawn(3, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8), X(4, 5), X(8, 5)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## walled-court-L7-v2 — score 63.5

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . # p . p # .
4 | q . . . p . p p
3 | n . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE BAILEY. 8 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe4; defended by pd5 pf5; hunters qa4 ka3; marchers ph4 pg4.
    make(
      7,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        queen(1, 4), knight(1, 3),
        pawn(8, 4), pawn(7, 4),
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

## double-key-L7-v2 — score 45

```
8 | . # : : : p . p
7 | . # : k : . p .
6 | . . p . p . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | q . . . . b . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — BOTH HANDS. two keys — d5 on his file, g7 on his rank; the right wall is gone.
    // Keys pd5 pg7; defended by pc6 pe6 pf8 ph8; hunters bf3 qa3; marchers ph3.
    make(
      7,
      [
        pawn(4, 5), pawn(7, 7),
        pawn(3, 6), pawn(5, 6), pawn(6, 8), pawn(8, 8),
        bishop(6, 3), queen(1, 3),
        pawn(8, 3),
        king(4, 7),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(2, 7), X(2, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## open-flank-L7-v2 — score 45

```
8 | . # : k : # . .
7 | . # : : : . . .
6 | . . p . p n . .
5 | . . . p . . . .
4 | . p . . . n . .
3 | . . . . . . . .
2 | . . . . . b . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THREE HORSES. right flank open; 2 knights posted to cover it. Key d5.
    // Key pd5; defended by pc6 pe6; hunters kf6 kf4 bf2; marchers pb4.
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        knight(6, 6), knight(6, 4), bishop(6, 2),
        pawn(2, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## swarm-L7-v2 — score 41

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . p . p . . . .
5 | p . p . p . . .
4 | . . . . . . p .
3 | . . . . . n . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — BRAMBLE. 7 pawns. 2-ring shell around the c5 key; dismantle the chain from the outside in.
    // Key pc5; defended by pb6 pd6; shell pa5 pe5; hunters kf3; marchers pg4 ph3.
    make(
      7,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        pawn(1, 5), pawn(5, 5),
        knight(6, 3),
        pawn(7, 4), pawn(8, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## double-key-L7-v1 — score 32.5

```
8 | # : : : p . p .
7 | # : k : . p . .
6 | . p . p . . . .
5 | . . p . . . . .
4 | . . . . . . . p
3 | b . . . . . q .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — BOTH HANDS. two keys — c5 on his file, f7 on his rank; the right wall is gone.
    // Keys pc5 pf7; defended by pb6 pd6 pe8 pg8; hunters ba3 qg3; marchers ph4.
    make(
      7,
      [
        pawn(3, 5), pawn(6, 7),
        pawn(2, 6), pawn(4, 6), pawn(5, 8), pawn(7, 8),
        bishop(1, 3), queen(7, 3),
        pawn(8, 4),
        king(3, 7),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(1, 7), X(1, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## open-flank-L7-v1 — score 32.5

```
8 | . . # : k : # .
7 | . . . : : : # .
6 | n . . p . p . .
5 | . . . . p . . .
4 | . . n . . . . .
3 | . . . . . . p b
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THREE HORSES. left flank open; 2 knights posted to cover it. Key e5.
    // Key pe5; defended by pd6 pf6; hunters kc4 ka6 bh3; marchers pg3.
    make(
      7,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        knight(3, 4), knight(1, 6), bishop(8, 3),
        pawn(7, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## royal-guard-L7-v1 — score 17.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . p .
5 | q . . . . p . .
4 | . . . . . . . p
3 | . n . b . . . .
2 | . . . p . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE RETINUE. 3 heavy hunters (queen, bishop, knight) — sightlines, not bodies. Key f5.
    // Key pf5; defended by pe6 pg6; hunters qa5 bd3 kb3; marchers pd2 ph4.
    make(
      7,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        queen(1, 5), bishop(4, 3), knight(2, 3),
        pawn(4, 2), pawn(8, 4),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## double-key-L8-v2 — score 87.5

```
8 | p . p : : : # .
7 | . p . : k : # .
6 | . . . p . p . .
5 | . . p . p . p .
4 | . . . . . . n .
3 | . . . . . . b p
2 | q . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — DOUBLE BOLT. two keys — e5 on his file, b7 on his rank; the left wall is gone.
    // Keys pe5 pb7; defended by pd6 pf6 pa8 pc8; shell pc5 pg5; hunters kg4 bg3 qa2; marchers pc2 ph3.
    make(
      8,
      [
        pawn(5, 5), pawn(2, 7),
        pawn(4, 6), pawn(6, 6), pawn(1, 8), pawn(3, 8),
        pawn(3, 5), pawn(7, 5),
        knight(7, 4), bishop(7, 3), queen(1, 2),
        pawn(3, 2), pawn(8, 3),
        king(5, 7),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(7, 7), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## corner-keep-L8-v2 — score 83.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . . . . . .
4 | . . . . . . n .
3 | . . p . . p q .
2 | . . b . p . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE BASTION. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters qg3 bc2 kg4; marchers pf3 pe2 pc3.
    make(
      8,
      [
        pawn(1, 5),
        pawn(2, 6),
        queen(7, 3), bishop(3, 2), knight(7, 4),
        pawn(6, 3), pawn(5, 2), pawn(3, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7'],
      },
    ),
```

## swarm-L8-v2 — score 75

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . p . .
5 | . . p . p . p .
4 | . p . . . . . p
3 | . . n . . . b .
2 | . . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE WALL OF PAWNS. 8 pawns. 2-ring shell around the e5 key; dismantle the chain from the outside in.
    // Key pe5; defended by pd6 pf6; shell pc5 pg5; hunters kc3 bg3; marchers ph4 pb4 pc2.
    make(
      8,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        pawn(3, 5), pawn(7, 5),
        knight(3, 3), bishop(7, 3),
        pawn(8, 4), pawn(2, 4), pawn(3, 2),
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

## swarm-L8-v1 — score 71

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . p . p . p . .
4 | . b . . . . . p
3 | p n . . . . p .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE WALL OF PAWNS. 8 pawns. 2-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kb3 bb4; marchers pg3 pa3 ph4.
    make(
      8,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(2, 3), bishop(2, 4),
        pawn(7, 3), pawn(1, 3), pawn(8, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## double-key-L8-v1 — score 62.5

```
8 | p . p : : : # .
7 | . p . : k : # .
6 | . . . p . p . .
5 | . . p . p . p .
4 | p . . . . . . .
3 | . . q . . . p .
2 | n . . . . . . b
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — DOUBLE BOLT. two keys — e5 on his file, b7 on his rank; the left wall is gone.
    // Keys pe5 pb7; defended by pd6 pf6 pa8 pc8; shell pc5 pg5; hunters ka2 bh2 qc3; marchers pg3 pa4.
    make(
      8,
      [
        pawn(5, 5), pawn(2, 7),
        pawn(4, 6), pawn(6, 6), pawn(1, 8), pawn(3, 8),
        pawn(3, 5), pawn(7, 5),
        knight(1, 2), bishop(8, 2), queen(3, 3),
        pawn(7, 3), pawn(1, 4),
        king(5, 7),
      ],
      {
        ...FLEE,
        moveLimit: 16,
        hazards: [X(7, 7), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## royal-guard-L8-v1 — score 58.5

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | . p . p b . . q
4 | . . p . . p . .
3 | p . . . q . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — TWIN QUEENS. 3 heavy hunters (queen, queen, bishop) — sightlines, not bodies. Key c4.
    // Key pc4; defended by pb5 pd5; hunters qh5 qe3 be5; marchers pf4 pa3.
    make(
      8,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        queen(8, 5), queen(5, 3), bishop(5, 5),
        pawn(6, 4), pawn(1, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```

## royal-guard-L8-v2 — score 46

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . . p . p . .
4 | . . . . p . . .
3 | p q b . . . q .
2 | . . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — TWIN QUEENS. 3 heavy hunters (queen, queen, bishop) — sightlines, not bodies. Key e4.
    // Key pe4; defended by pd5 pf5; hunters qg3 qb3 bc3; marchers pa3 pc2.
    make(
      8,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        queen(7, 3), queen(2, 3), bishop(3, 3),
        pawn(1, 3), pawn(3, 2),
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

## open-flank-L8-v1 — score 33.5

```
8 | . . # : k : # .
7 | . . . : : : # .
6 | . n . : : : # .
5 | . . n p . p . .
4 | n . . . p . . p
3 | . . . . . . . .
2 | . . . . . . b .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — CAVALRY POST. left flank open; 3 knights posted to cover it. Key e4.
    // Key pe4; defended by pd5 pf5; hunters ka4 kb6 kc5 bg2; marchers ph4.
    make(
      8,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        knight(1, 4), knight(2, 6), knight(3, 5), bishop(7, 2),
        pawn(8, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(7, 6), X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## open-flank-L8-v2 — score 33.5

```
8 | # : k : # . . .
7 | # : : : . . . .
6 | # : : : . n n .
5 | . p . p . . n .
4 | p . p . . . . .
3 | . . . . b . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — CAVALRY POST. right flank open; 3 knights posted to cover it. Key c4.
    // Key pc4; defended by pb5 pd5; hunters kg6 kg5 kf6 be3; marchers pa4 ph3.
    make(
      8,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        knight(7, 6), knight(7, 5), knight(6, 6), bishop(5, 3),
        pawn(1, 4), pawn(8, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(1, 6), X(1, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```

## walled-court-L8-v1 — score 13

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | . p . p . p . .
3 | p q . . . p . .
2 | b . . . . . p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — CURTAIN WALL. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qb3 ba2; marchers pf3 pa3 pg2.
    make(
      8,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(2, 3), bishop(1, 2),
        pawn(6, 3), pawn(1, 3), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8), X(2, 5), X(6, 5)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```

## walled-court-L8-v2 — score -2.8

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | . p . p . p p b
3 | p . . . . . . .
2 | q p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — CURTAIN WALL. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qa2 bh4; marchers pb2 pa3 pg4.
    make(
      8,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(1, 2), bishop(8, 4),
        pawn(2, 2), pawn(1, 3), pawn(7, 4),
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

## corner-keep-L8-v1 — score -49.2

```
8 | . . . . # : : k
7 | . . . . # : : :
6 | . . . . . . p .
5 | . . . . . . . p
4 | p . . . b n . .
3 | . . . . . q . .
2 | . p . . . p . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE BASTION. 3x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; defended by pg6; hunters qf3 be4 kf4; marchers pf2 pb2 pa4.
    make(
      8,
      [
        pawn(8, 5),
        pawn(7, 6),
        queen(6, 3), bishop(5, 4), knight(6, 4),
        pawn(6, 2), pawn(2, 2), pawn(1, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(5, 7), X(5, 8)],
        kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7'],
      },
    ),
```

## royal-guard-L9-v2 — score 91

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | q p . p . . . n
4 | p . p . p . . .
3 | p . . . p . . .
2 | . . . . q . . b
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE PRIVY COUNCIL. 4 heavy hunters (queen, queen, bishop, knight) — sightlines, not bodies. Key c4.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4; hunters qe2 qa5 bh2 kh5; marchers pa3 pe3.
    make(
      9,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4),
        queen(5, 2), queen(1, 5), bishop(8, 2), knight(8, 5),
        pawn(1, 3), pawn(5, 3),
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

## walled-court-L9-v1 — score 88.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . . # p . p #
4 | p b q p . p . p
3 | . . n . . . . .
2 | . . . p . . . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE INNER KEEP. 8 walls — side walls plus an inner wall with one door on the f-file.
    // Key pf4; defended by pe5 pg5; shell pd4 ph4; hunters qc4 bb4 kc3; marchers pa4 ph2 pd2.
    make(
      9,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        pawn(4, 4), pawn(8, 4),
        queen(3, 4), bishop(2, 4), knight(3, 3),
        pawn(1, 4), pawn(8, 2), pawn(4, 2),
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

## open-flank-L9-v2 — score 78.5

```
8 | . . . # : k : #
7 | . . . . : : : #
6 | . . n . : : : #
5 | . n n . p . p .
4 | p . . . . p . .
3 | . q . . . . . .
2 | . b . . . . . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE OUTFLANK. left flank open; 3 knights posted to cover it. Key f4.
    // Key pf4; defended by pe5 pg5; hunters kb5 kc6 kc5 bb2 qb3; marchers ph2 pa4.
    make(
      9,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        knight(2, 5), knight(3, 6), knight(3, 5), bishop(2, 2), queen(2, 3),
        pawn(8, 2), pawn(1, 4),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(8, 6), X(8, 7), X(8, 8), X(4, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## royal-guard-L9-v1 — score 76

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | . p . p . . . .
4 | p . p . p . p .
3 | . . . . p . q .
2 | b . . . n q . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE PRIVY COUNCIL. 4 heavy hunters (queen, queen, bishop, knight) — sightlines, not bodies. Key c4.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4; hunters qg3 qf2 ba2 ke2; marchers pe3 pg4.
    make(
      9,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4),
        queen(7, 3), queen(6, 2), bishop(1, 2), knight(5, 2),
        pawn(5, 3), pawn(7, 4),
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

## open-flank-L9-v1 — score 76

```
8 | . . # : k : # .
7 | . . . : : : # .
6 | . n . : : : # .
5 | . . n p . p . .
4 | . . n . p . . .
3 | . . . . . . q b
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE OUTFLANK. left flank open; 3 knights posted to cover it. Key e4.
    // Key pe4; defended by pd5 pf5; hunters kb6 kc4 kc5 bh3 qg3.
    make(
      9,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        knight(2, 6), knight(3, 4), knight(3, 5), bishop(8, 3), queen(7, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(7, 6), X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## double-key-L9-v1 — score 50

```
8 | . # : : : p . p
7 | . # : k : . p .
6 | . . p . p . . .
5 | . p . p . p . .
4 | p . . . . b . p
3 | . q . . . n . .
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE INTERSECTION. two keys — d5 on his file, g7 on his rank; the right wall is gone.
    // Keys pd5 pg7; defended by pc6 pe6 pf8 ph8; shell pb5 pf5; hunters qb3 bf4 kf3; marchers ph4 pb2 pa4.
    make(
      9,
      [
        pawn(4, 5), pawn(7, 7),
        pawn(3, 6), pawn(5, 6), pawn(6, 8), pawn(8, 8),
        pawn(2, 5), pawn(6, 5),
        queen(2, 3), bishop(6, 4), knight(6, 3),
        pawn(8, 4), pawn(2, 2), pawn(1, 4),
        king(4, 7),
      ],
      {
        ...FLEE,
        moveLimit: 16,
        hazards: [X(2, 7), X(2, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## corner-keep-L9-v2 — score 28.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | : : : # . . . .
5 | . p . . . . . .
4 | p . . . . . p n
3 | . p b . . q . b
2 | . . . . p . . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE CITADEL. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qf3 bh3 bc3 kh4; marchers pg4 pe2 ph2.
    make(
      9,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(6, 3), bishop(8, 3), bishop(3, 3), knight(8, 4),
        pawn(7, 4), pawn(5, 2), pawn(8, 2),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(4, 6), X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7', 'a6', 'b6', 'c6'],
      },
    ),
```

## swarm-L9-v2 — score 16.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . . p . p n . .
4 | p p . p . p . .
3 | . . . p . b p .
2 | . . . . . p . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — PAWN STORM. 10 pawns. 3-ring shell around the d4 key; dismantle the chain from the outside in.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4 pd3; hunters kf5 bf3; marchers pf2 pa4 pg3 ph2.
    make(
      9,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4), pawn(4, 3),
        knight(6, 5), bishop(6, 3),
        pawn(6, 2), pawn(1, 4), pawn(7, 3), pawn(8, 2),
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

## double-key-L9-v2 — score 7.5

```
8 | # : : : p . p .
7 | # : k : . p . .
6 | . p . p . . . .
5 | p . p . p . . .
4 | b . . . q . p p
3 | . . . . . . . n
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE INTERSECTION. two keys — c5 on his file, f7 on his rank; the right wall is gone.
    // Keys pc5 pf7; defended by pb6 pd6 pe8 pg8; shell pa5 pe5; hunters qe4 ba4 kh3; marchers ph4 pg4.
    make(
      9,
      [
        pawn(3, 5), pawn(6, 7),
        pawn(2, 6), pawn(4, 6), pawn(5, 8), pawn(7, 8),
        pawn(1, 5), pawn(5, 5),
        queen(5, 4), bishop(1, 4), knight(8, 3),
        pawn(8, 4), pawn(7, 4),
        king(3, 7),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(1, 7), X(1, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## swarm-L9-v1 — score 0

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | . p . p . . . b
4 | p . p . p n . .
3 | . . p . . p p .
2 | . . . . p . . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — PAWN STORM. 10 pawns. 3-ring shell around the c4 key; dismantle the chain from the outside in.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4 pc3; hunters kf4 bh5; marchers ph2 pe2 pg3 pf3.
    make(
      9,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4), pawn(3, 3),
        knight(6, 4), bishop(8, 5),
        pawn(8, 2), pawn(5, 2), pawn(7, 3), pawn(6, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 16,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```

## walled-court-L9-v2 — score -2.2

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . # p . p # .
4 | p . p . p . p .
3 | . . n . . . . p
2 | . . p . . . b q
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE INNER KEEP. 8 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4; hunters qh2 bg2 kc3; marchers ph3 pa4 pc2.
    make(
      9,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4),
        queen(8, 2), bishop(7, 2), knight(3, 3),
        pawn(8, 3), pawn(1, 4), pawn(3, 2),
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

## corner-keep-L9-v1 — score -70.5

```
8 | . . . . # : : k
7 | . . . . # : : :
6 | . . . . # : : :
5 | . . . . . . p .
4 | . b q . b . . p
3 | . . p . . p p .
2 | . p . . . n . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE CITADEL. 3x3 corner room on h8; key h4 on his file, chain runs inward.
    // Key ph4; defended by pg5; shell pg3; hunters qc4 be4 bb4 kf2; marchers pf3 pb2 pc3.
    make(
      9,
      [
        pawn(8, 4),
        pawn(7, 5),
        pawn(7, 3),
        queen(3, 4), bishop(5, 4), bishop(2, 4), knight(6, 2),
        pawn(6, 3), pawn(2, 2), pawn(3, 3),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(5, 6), X(5, 7), X(5, 8)],
        kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7', 'f6', 'g6', 'h6'],
      },
    ),
```

## double-key-L10-v2 — score 82.5

```
8 | # : : : p . p .
7 | # : k : . p . .
6 | . p . p . . . .
5 | p . p . p . . .
4 | b . . . . . q p
3 | p . . . p . . n
2 | . . . . . . q .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — CROSSHAIRS. two keys — c5 on his file, f7 on his rank; the right wall is gone.
    // Keys pc5 pf7; defended by pb6 pd6 pe8 pg8; shell pa5 pe5; hunters qg4 qg2 ba4 kh3; marchers ph4 pa3 pe3.
    make(
      10,
      [
        pawn(3, 5), pawn(6, 7),
        pawn(2, 6), pawn(4, 6), pawn(5, 8), pawn(7, 8),
        pawn(1, 5), pawn(5, 5),
        queen(7, 4), queen(7, 2), bishop(1, 4), knight(8, 3),
        pawn(8, 4), pawn(1, 3), pawn(5, 3),
        king(3, 7),
      ],
      {
        ...FLEE,
        moveLimit: 19,
        hazards: [X(1, 7), X(1, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## corner-keep-L10-v1 — score 80.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | : : : # . . . .
5 | . p . . . . . .
4 | p . p . . . p .
3 | . p . b q p . .
2 | . . n . . q . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE LAST TOWER. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qe3 qf2 bd3 kc2; marchers pc4 pf3 pg4.
    make(
      10,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(5, 3), queen(6, 2), bishop(4, 3), knight(3, 2),
        pawn(3, 4), pawn(6, 3), pawn(7, 4),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(4, 6), X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7', 'a6', 'b6', 'c6'],
      },
    ),
```

## double-key-L10-v1 — score 67.5

```
8 | . p . p : : : #
7 | . . p . : k : #
6 | . . . . p . p .
5 | . . . p . p . p
4 | p q . . . . . n
3 | q b . p . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — CROSSHAIRS. two keys — f5 on his file, c7 on his rank; the left wall is gone.
    // Keys pf5 pc7; defended by pe6 pg6 pb8 pd8; shell pd5 ph5; hunters qa3 qb4 bb3 kh4; marchers pd3 pa4.
    make(
      10,
      [
        pawn(6, 5), pawn(3, 7),
        pawn(5, 6), pawn(7, 6), pawn(2, 8), pawn(4, 8),
        pawn(4, 5), pawn(8, 5),
        queen(1, 3), queen(2, 4), bishop(2, 3), knight(8, 4),
        pawn(4, 3), pawn(1, 4),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 21,
        hazards: [X(8, 7), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## royal-guard-L10-v2 — score 63.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . . p . p . . .
4 | p p . p . p b .
3 | b n . . . q . p
2 | q . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE ROYAL GUARD. 5 heavy hunters (queen, queen, bishop, bishop, knight) — sightlines, not bodies. Key d4.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qf3 qa2 ba3 bg4 kb3; marchers ph3 pa4.
    make(
      10,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(6, 3), queen(1, 2), bishop(1, 3), bishop(7, 4), knight(2, 3),
        pawn(8, 3), pawn(1, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```

## royal-guard-L10-v1 — score 59.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . . . p . p .
4 | p . . p . p . p
3 | . . p n . . . .
2 | b q q b . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE ROYAL GUARD. 5 heavy hunters (queen, queen, bishop, bishop, knight) — sightlines, not bodies. Key f4.
    // Key pf4; defended by pe5 pg5; shell pd4 ph4; hunters qb2 qc2 ba2 bd2 kd3; marchers pa4 pc3.
    make(
      10,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        pawn(4, 4), pawn(8, 4),
        queen(2, 2), queen(3, 2), bishop(1, 2), bishop(4, 2), knight(4, 3),
        pawn(1, 4), pawn(3, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 17,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## open-flank-L10-v1 — score 53.5

```
8 | . . . # : k : #
7 | . . . . : : : #
6 | . n . . : : : #
5 | . . n . p . p .
4 | . . . n . p . p
3 | p b . q . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE GAUNTLET. left flank open; 3 knights posted to cover it. Key f4.
    // Key pf4; defended by pe5 pg5; hunters kd4 kc5 kb6 bb3 qd3; marchers ph4 pa3.
    make(
      10,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        knight(4, 4), knight(3, 5), knight(2, 6), bishop(2, 3), queen(4, 3),
        pawn(8, 4), pawn(1, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(8, 6), X(8, 7), X(8, 8), X(4, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## corner-keep-L10-v2 — score 32.8

```
8 | . . . . # : : k
7 | . . . . # : : :
6 | . . . . # : : :
5 | . . q . . . p .
4 | p . b . n q . p
3 | . p . . . p p .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE LAST TOWER. 3x3 corner room on h8; key h4 on his file, chain runs inward.
    // Key ph4; defended by pg5; shell pg3; hunters qf4 qc5 bc4 ke4; marchers pf3 pa4 pb3.
    make(
      10,
      [
        pawn(8, 4),
        pawn(7, 5),
        pawn(7, 3),
        queen(6, 4), queen(3, 5), bishop(3, 4), knight(5, 4),
        pawn(6, 3), pawn(1, 4), pawn(2, 3),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(5, 6), X(5, 7), X(5, 8)],
        kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7', 'f6', 'g6', 'h6'],
      },
    ),
```

## walled-court-L10-v2 — score 24.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | . p . p . p . q
3 | q p . . . b p p
2 | n . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE FORTRESS. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qa3 qh4 ka2 bf3; marchers ph3 pg3 pb3.
    make(
      10,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(1, 3), queen(8, 4), knight(1, 2), bishop(6, 3),
        pawn(8, 3), pawn(7, 3), pawn(2, 3),
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

## swarm-L10-v2 — score 20.5

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | . p . p . . . .
4 | p . p . p n . p
3 | p . p . p b p .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE SWARM. 10 pawns. 3-ring shell around the c4 key; dismantle the chain from the outside in.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4 pc3; hunters kf4 bf3; marchers ph4 pe3 pa3 pg3.
    make(
      10,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4), pawn(3, 3),
        knight(6, 4), bishop(6, 3),
        pawn(8, 4), pawn(5, 3), pawn(1, 3), pawn(7, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 20,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```

## open-flank-L10-v2 — score 16

```
8 | # : k : # . . .
7 | # : : : . . . .
6 | # : : : . . . .
5 | . p . p . . n .
4 | . . p . n n . .
3 | p . . . . . . .
2 | . . . . b . q p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE GAUNTLET. right flank open; 3 knights posted to cover it. Key c4.
    // Key pc4; defended by pb5 pd5; hunters kf4 ke4 kg5 be2 qg2; marchers pa3 ph2.
    make(
      10,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        knight(6, 4), knight(5, 4), knight(7, 5), bishop(5, 2), queen(7, 2),
        pawn(1, 3), pawn(8, 2),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 19,
        hazards: [X(1, 6), X(1, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
```

## walled-court-L10-v1 — score 4.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . # p . p # . .
4 | p p . p . p . .
3 | . b . . . q p p
2 | . q . . . . n .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE FORTRESS. 8 walls — side walls plus an inner wall with one door on the d-file.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4; hunters qf3 qb2 kg2 bb3; marchers ph3 pg3 pa4.
    make(
      10,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4),
        queen(6, 3), queen(2, 2), knight(7, 2), bishop(2, 3),
        pawn(8, 3), pawn(7, 3), pawn(1, 4),
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

## swarm-L10-v1 — score -17

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | . . p . p . . .
4 | p p . p . p . .
3 | . b . p . n p p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE SWARM. 9 pawns. 3-ring shell around the d4 key; dismantle the chain from the outside in.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4 pd3; hunters kf3 bb3; marchers pa4 pg3 ph3.
    make(
      10,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4), pawn(4, 3),
        knight(6, 3), bishop(2, 3),
        pawn(1, 4), pawn(7, 3), pawn(8, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 21,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```
