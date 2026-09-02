# Paste-ready snippets (runs.ts style)

Each block drops into a `RunDef.levels` array next to RUN_REVENGE_1. `STILL` / `FLEE` / `X()` are the helpers declared above RUN_REVENGE_1.

## swarm-L1-v1 — score 96

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

## swarm-L1-v2 — score 96

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

## swarm-L1-v3 — score 96

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

## corner-keep-L1-v1 — score 96

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

## corner-keep-L1-v3 — score 96

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

## swarm-L2-v1 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . p . . . p
5 | . . . . p . p .
4 | . . . . . . . .
3 | . . . . . . . p
2 | . . . p . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6 pe5 pg5; marchers pd2 ph3.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6), pawn(5, 5), pawn(7, 5),
        pawn(4, 2), pawn(8, 3),
        king(6, 8),
      ],
      STILL,
    ),
```

## swarm-L2-v2 — score 96

```
8 | . . . . k . . .
7 | . . . p p p . .
6 | . . p . . . p .
5 | . . . p . p . .
4 | p . . . . . . p
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pd7 pe7 pf7 pc6 pg6 pd5 pf5; marchers pa4 ph4.
    make(
      2,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7), pawn(3, 6), pawn(7, 6), pawn(4, 5), pawn(6, 5),
        pawn(1, 4), pawn(8, 4),
        king(5, 8),
      ],
      STILL,
    ),
```

## swarm-L2-v3 — score 96

```
8 | . . . k . . . .
7 | . . p p p . . .
6 | . p . . . p . .
5 | . . p . p . . .
4 | . . . . . . . .
3 | . . . . . p . .
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pc7 pd7 pe7 pb6 pf6 pc5 pe5; marchers pf3 pb2.
    make(
      2,
      [
        pawn(3, 7), pawn(4, 7), pawn(5, 7), pawn(2, 6), pawn(6, 6), pawn(3, 5), pawn(5, 5),
        pawn(6, 3), pawn(2, 2),
        king(4, 8),
      ],
      STILL,
    ),
```

## corner-keep-L2-v1 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . p . . . p
5 | . . . . . . . .
4 | . . n . . . . p
3 | . . . p . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6; hunters kc4; marchers ph4 pd3.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6),
        knight(3, 4),
        pawn(8, 4), pawn(4, 3),
        king(6, 8),
      ],
      STILL,
    ),
```

## corner-keep-L2-v2 — score 96

```
8 | . . . . . k . .
7 | . . . . p p p .
6 | . . . p . . . p
5 | . . . . . . . .
4 | p . n . . . . .
3 | . . . . . . . .
2 | . . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6; hunters kc4; marchers pa4 pc2.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6),
        knight(3, 4),
        pawn(1, 4), pawn(3, 2),
        king(6, 8),
      ],
      STILL,
    ),
```

## corner-keep-L2-v3 — score 96

```
8 | . . k . . . . .
7 | . p p p . . . .
6 | p . . . p . . .
5 | . . . . . . . .
4 | p . . . . n . .
3 | . . . . p . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pb7 pc7 pd7 pa6 pe6; hunters kf4; marchers pe3 pa4.
    make(
      2,
      [
        pawn(2, 7), pawn(3, 7), pawn(4, 7), pawn(1, 6), pawn(5, 6),
        knight(6, 4),
        pawn(5, 3), pawn(1, 4),
        king(3, 8),
      ],
      STILL,
    ),
```

## swarm-L3-v1 — score 96

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . . . . .
5 | . . . . . p . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE DOOR. 1 pawns. 0-ring shell around the f5 key; dismantle the chain from the outside in.
    // Key pf5.
    make(
      3,
      [
        pawn(6, 5),
        king(6, 8),
      ],
      {
        ...FLEE,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## swarm-L3-v2 — score 96

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . . . . . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE DOOR. 1 pawns. 0-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5.
    make(
      3,
      [
        pawn(4, 5),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## swarm-L3-v3 — score 96

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . . . . . . .
5 | . . . p . . . .
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — THE DOOR. 1 pawns. 0-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5.
    make(
      3,
      [
        pawn(4, 5),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## corner-keep-L3-v1 — score 96

```
8 | k : # . . . . .
7 | : : # . . . . .
6 | . . . . . . . .
5 | p . . . . . . .
4 | . . . . . . . n
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — CORNER OFFICE. 2x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; hunters kh4.
    make(
      3,
      [
        pawn(1, 5),
        knight(8, 4),
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
8 | . . . . . # : k
7 | . . . . . # : :
6 | . . . . . . . .
5 | . . . . . . . p
4 | . . . . . . . .
3 | . n . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — CORNER OFFICE. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; hunters kb3.
    make(
      3,
      [
        pawn(8, 5),
        knight(2, 3),
        king(8, 8),
      ],
      {
        ...FLEE,
        hazards: [X(6, 7), X(6, 8)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
```

## corner-keep-L3-v3 — score 96

```
8 | k : # . . . . .
7 | : : # . . . . .
6 | . . . . . . . .
5 | p . . . . . . .
4 | . . . . . . . .
3 | . . . . . n . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L3 — CORNER OFFICE. 2x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; hunters kf3.
    make(
      3,
      [
        pawn(1, 5),
        knight(6, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(3, 8)],
        kingPen: ['a8', 'b8', 'a7', 'b7'],
      },
    ),
```

## swarm-L4-v1 — score 100

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . . . p . . .
5 | . . . p . . . n
4 | . . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — ONE GUARD. 2 pawns. 0-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pe6; hunters kh5.
    make(
      4,
      [
        pawn(4, 5),
        pawn(5, 6),
        knight(8, 5),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
```

## swarm-L4-v2 — score 100

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . . . .
5 | . . . . p . . .
4 | . n . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — ONE GUARD. 2 pawns. 0-ring shell around the e5 key; dismantle the chain from the outside in.
    // Key pe5; defended by pd6; hunters kb4.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        knight(2, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## swarm-L4-v3 — score 100

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . . . .
5 | . . . . p . . .
4 | . . . . . . . .
3 | n . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — ONE GUARD. 2 pawns. 0-ring shell around the e5 key; dismantle the chain from the outside in.
    // Key pe5; defended by pd6; hunters ka3.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        knight(1, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
```

## corner-keep-L4-v1 — score 96

```
8 | . . . . . # : k
7 | . . . . . # : :
6 | . . . . . . . .
5 | . . . . . . . p
4 | . . . . . n . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE CLOSET. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; hunters kf4.
    make(
      4,
      [
        pawn(8, 5),
        knight(6, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        hazards: [X(6, 7), X(6, 8)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
```

## corner-keep-L4-v2 — score 96

```
8 | . . . . . # : k
7 | . . . . . # : :
6 | . . . . . . . .
5 | . . . . . . . p
4 | . . . . n . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE CLOSET. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; hunters ke4.
    make(
      4,
      [
        pawn(8, 5),
        knight(5, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        hazards: [X(6, 7), X(6, 8)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
```

## corner-keep-L4-v3 — score 96

```
8 | . . . . . # : k
7 | . . . . . # : :
6 | . . . . . . . .
5 | . . . . . . . p
4 | . . . . . . . .
3 | . . . n . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L4 — THE CLOSET. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; hunters kd3.
    make(
      4,
      [
        pawn(8, 5),
        knight(4, 3),
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
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . p .
5 | . . . p . p . p
4 | . . . . . . . .
3 | . . n . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE HEDGE. 5 pawns. 1-ring shell around the f5 key; dismantle the chain from the outside in.
    // Key pf5; defended by pe6 pg6; shell pd5 ph5; hunters kc3.
    make(
      5,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        pawn(4, 5), pawn(8, 5),
        knight(3, 3),
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

## swarm-L5-v1 — score 85

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . p . p . p . .
4 | n . . . . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE HEDGE. 5 pawns. 1-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters ka4.
    make(
      5,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(1, 4),
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

## swarm-L5-v3 — score 85

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . p . p . . . .
5 | p . p . p . . .
4 | . . . . . . . .
3 | . . . . . . . n
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE HEDGE. 5 pawns. 1-ring shell around the c5 key; dismantle the chain from the outside in.
    // Key pc5; defended by pb6 pd6; shell pa5 pe5; hunters kh3.
    make(
      5,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        pawn(1, 5), pawn(5, 5),
        knight(8, 3),
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

## corner-keep-L5-v1 — score 85

```
8 | . . . . . # : k
7 | . . . . . # : :
6 | . . . . . . p .
5 | . . . . . n . p
4 | . . . . . b . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE TOWER. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; defended by pg6; hunters kf5 bf4.
    make(
      5,
      [
        pawn(8, 5),
        pawn(7, 6),
        knight(6, 5), bishop(6, 4),
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
8 | . . . . . # : k
7 | . . . . . # : :
6 | . . . . . . p .
5 | n . . . . . . p
4 | . . . b . . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE TOWER. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; defended by pg6; hunters ka5 bd4.
    make(
      5,
      [
        pawn(8, 5),
        pawn(7, 6),
        knight(1, 5), bishop(4, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(6, 7), X(6, 8)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
```

## corner-keep-L5-v3 — score 85

```
8 | k : # . . . . .
7 | : : # . . . . .
6 | . p . . . . . .
5 | p . . . . . . .
4 | . . b . . . . .
3 | . . . . . . . n
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L5 — THE TOWER. 2x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters kh3 bc4.
    make(
      5,
      [
        pawn(1, 5),
        pawn(2, 6),
        knight(8, 3), bishop(3, 4),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(3, 7), X(3, 8)],
        kingPen: ['a8', 'b8', 'a7', 'b7'],
      },
    ),
```

## swarm-L6-v1 — score 25

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . . p . p . .
5 | . . p . p . p .
4 | n . . . . . . .
3 | . . p . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THICKET. 6 pawns. 1-ring shell around the e5 key; dismantle the chain from the outside in.
    // Key pe5; defended by pd6 pf6; shell pc5 pg5; hunters ka4; marchers pc3.
    make(
      6,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        pawn(3, 5), pawn(7, 5),
        knight(1, 4),
        pawn(3, 3),
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

## swarm-L6-v2 — score 25

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . p .
5 | . . . p . p . p
4 | n . . . . . . .
3 | . p . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THICKET. 6 pawns. 1-ring shell around the f5 key; dismantle the chain from the outside in.
    // Key pf5; defended by pe6 pg6; shell pd5 ph5; hunters ka4; marchers pb3.
    make(
      6,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        pawn(4, 5), pawn(8, 5),
        knight(1, 4),
        pawn(2, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## swarm-L6-v3 — score 25

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . p . p . . . .
5 | p . p . p . . n
4 | . . . . p . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THICKET. 6 pawns. 1-ring shell around the c5 key; dismantle the chain from the outside in.
    // Key pc5; defended by pb6 pd6; shell pa5 pe5; hunters kh5; marchers pe4.
    make(
      6,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        pawn(1, 5), pawn(5, 5),
        knight(8, 5),
        pawn(5, 4),
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

## corner-keep-L6-v1 — score 25

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . b . n . .
4 | . . . . p . . .
3 | . . . . . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE KEEP. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters kf5 bd5; marchers pe4.
    make(
      6,
      [
        pawn(1, 5),
        pawn(2, 6),
        knight(6, 5), bishop(4, 5),
        pawn(5, 4),
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
4 | . n . p . . . .
3 | . . . . . . . .
2 | . . b . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE KEEP. 3x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; defended by pg6; hunters kb4 bc2; marchers pd4.
    make(
      6,
      [
        pawn(8, 5),
        pawn(7, 6),
        knight(2, 4), bishop(3, 2),
        pawn(4, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(5, 7), X(5, 8)],
        kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7'],
      },
    ),
```

## corner-keep-L6-v3 — score 25

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . . . . . .
4 | . . . . . . n .
3 | . . p . . . . .
2 | . . . . . b . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L6 — THE KEEP. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters kg4 bf2; marchers pc3.
    make(
      6,
      [
        pawn(1, 5),
        pawn(2, 6),
        knight(7, 4), bishop(6, 2),
        pawn(3, 3),
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

## swarm-L7-v2 — score 92.5

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . p . p . p . .
4 | . . . . . p . .
3 | . . . . . n . .
2 | . . . . . . p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — BRAMBLE. 7 pawns. 2-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kf3; marchers pf4 pg2.
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 3),
        pawn(6, 4), pawn(7, 2),
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

## corner-keep-L7-v1 — score 82.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . . . . b .
4 | . . . . . q . .
3 | . . . . p p . .
2 | . . . . . . n .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE DONJON. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters qf4 bg5 kg2; marchers pe3 pf3.
    make(
      7,
      [
        pawn(1, 5),
        pawn(2, 6),
        queen(6, 4), bishop(7, 5), knight(7, 2),
        pawn(5, 3), pawn(6, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7'],
      },
    ),
```

## swarm-L7-v1 — score 80

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . . p . p . . .
5 | . p . p . p . .
4 | n . . . . . . .
3 | . p . . . . . .
2 | . . . . . . p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — BRAMBLE. 7 pawns. 2-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters ka4; marchers pg2 pb3.
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(1, 4),
        pawn(7, 2), pawn(2, 3),
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

## swarm-L7-v3 — score 70

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . p .
5 | . . . p . p . p
4 | . . p . . . . .
3 | p . . n . . . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — BRAMBLE. 7 pawns. 2-ring shell around the f5 key; dismantle the chain from the outside in.
    // Key pf5; defended by pe6 pg6; shell pd5 ph5; hunters kd3; marchers pc4 pa3.
    make(
      7,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        pawn(4, 5), pawn(8, 5),
        knight(4, 3),
        pawn(3, 4), pawn(1, 3),
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

## corner-keep-L7-v2 — score 67.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . n . . . . b
4 | . . . . . . . .
3 | . . p . q . . p
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE DONJON. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters qe3 bh5 kc5; marchers ph3 pc3.
    make(
      7,
      [
        pawn(1, 5),
        pawn(2, 6),
        queen(5, 3), bishop(8, 5), knight(3, 5),
        pawn(8, 3), pawn(3, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7'],
      },
    ),
```

## corner-keep-L7-v3 — score 42.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . . n . . .
4 | . . . . . p . q
3 | . . . . . . . p
2 | . . . . . b . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L7 — THE DONJON. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters qh4 bf2 ke5; marchers pf4 ph3.
    make(
      7,
      [
        pawn(1, 5),
        pawn(2, 6),
        queen(8, 4), bishop(6, 2), knight(5, 5),
        pawn(6, 4), pawn(8, 3),
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

## corner-keep-L8-v1 — score 100

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . . . . . .
4 | . . . . . p p .
3 | . . . . q b . n
2 | . . . p . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE BASTION. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters qe3 bf3 kh3; marchers pf4 pd2 pg4.
    make(
      8,
      [
        pawn(1, 5),
        pawn(2, 6),
        queen(5, 3), bishop(6, 3), knight(8, 3),
        pawn(6, 4), pawn(4, 2), pawn(7, 4),
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

## swarm-L8-v3 — score 83.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . p .
5 | b . . p . p . p
4 | . . . n . . . p
3 | . . p . . . . .
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE WALL OF PAWNS. 8 pawns. 2-ring shell around the f5 key; dismantle the chain from the outside in.
    // Key pf5; defended by pe6 pg6; shell pd5 ph5; hunters kd4 ba5; marchers ph4 pb2 pc3.
    make(
      8,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        pawn(4, 5), pawn(8, 5),
        knight(4, 4), bishop(1, 5),
        pawn(8, 4), pawn(2, 2), pawn(3, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## swarm-L8-v1 — score 62.5

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | . p . p . . . .
5 | p . p . p . . .
4 | . . . . . p p .
3 | p . . . . n . b
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE WALL OF PAWNS. 8 pawns. 2-ring shell around the c5 key; dismantle the chain from the outside in.
    // Key pc5; defended by pb6 pd6; shell pa5 pe5; hunters kf3 bh3; marchers pf4 pa3 pg4.
    make(
      8,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        pawn(1, 5), pawn(5, 5),
        knight(6, 3), bishop(8, 3),
        pawn(6, 4), pawn(1, 3), pawn(7, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
```

## corner-keep-L8-v3 — score 50

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | . p . . . . . .
5 | p . . b . . . n
4 | . . p . . . p .
3 | . . . q . . . .
2 | . . . . . p . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE BASTION. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters qd3 bd5 kh5; marchers pg4 pc4 pf2.
    make(
      8,
      [
        pawn(1, 5),
        pawn(2, 6),
        queen(4, 3), bishop(4, 5), knight(8, 5),
        pawn(7, 4), pawn(3, 4), pawn(6, 2),
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

## swarm-L8-v2 — score 37.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . . p . p .
5 | . . . p . p . p
4 | b . . . . . . p
3 | . n . p . . . .
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE WALL OF PAWNS. 8 pawns. 2-ring shell around the f5 key; dismantle the chain from the outside in.
    // Key pf5; defended by pe6 pg6; shell pd5 ph5; hunters kb3 ba4; marchers pd3 pb2 ph4.
    make(
      8,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        pawn(4, 5), pawn(8, 5),
        knight(2, 3), bishop(1, 4),
        pawn(4, 3), pawn(2, 2), pawn(8, 4),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
```

## corner-keep-L8-v2 — score 33.5

```
8 | . . . . # : : k
7 | . . . . # : : :
6 | . . . . . . p .
5 | . . . . . b . p
4 | . . . . . p . .
3 | n . p q . . . .
2 | . p . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L8 — THE BASTION. 3x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; defended by pg6; hunters qd3 bf5 ka3; marchers pb2 pf4 pc3.
    make(
      8,
      [
        pawn(8, 5),
        pawn(7, 6),
        queen(4, 3), bishop(6, 5), knight(1, 3),
        pawn(2, 2), pawn(6, 4), pawn(3, 3),
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

## corner-keep-L9-v1 — score 87

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | : : : # . . . .
5 | . p . . . . . .
4 | p . b . . p . .
3 | . p . . p n . p
2 | . . . . . q b .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE CITADEL. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qf2 bg2 bc4 kf3; marchers pe3 ph3 pf4.
    make(
      9,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(6, 2), bishop(7, 2), bishop(3, 4), knight(6, 3),
        pawn(5, 3), pawn(8, 3), pawn(6, 4),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 6), X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7', 'a6', 'b6', 'c6'],
      },
    ),
```

## corner-keep-L9-v2 — score 78.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | : : : # . . . .
5 | . p . . q . . .
4 | p . b . . b . .
3 | . p p p p . . n
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE CITADEL. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qe5 bc4 bf4 kh3; marchers pc3 pd3 pe3.
    make(
      9,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(5, 5), bishop(3, 4), bishop(6, 4), knight(8, 3),
        pawn(3, 3), pawn(4, 3), pawn(5, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(4, 6), X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7', 'a6', 'b6', 'c6'],
      },
    ),
```

## swarm-L9-v1 — score 41.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . b . p . p .
4 | p p . p . p . p
3 | . . p n . p . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — PAWN STORM. 9 pawns. 3-ring shell around the f4 key; dismantle the chain from the outside in.
    // Key pf4; defended by pe5 pg5; shell pd4 ph4 pf3; hunters kd3 bc5; marchers pa4 pc3 pb4.
    make(
      9,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        pawn(4, 4), pawn(8, 4), pawn(6, 3),
        knight(4, 3), bishop(3, 5),
        pawn(1, 4), pawn(3, 3), pawn(2, 4),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 16,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## swarm-L9-v2 — score 12

```
8 | # : k : # . . .
7 | # : : : # . . .
6 | # : : : # . . .
5 | . p . p b . . .
4 | p . p . p p n .
3 | . . p . . . . .
2 | . . . . . . p p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — PAWN STORM. 9 pawns. 3-ring shell around the c4 key; dismantle the chain from the outside in.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4 pc3; hunters kg4 be5; marchers pg2 pf4 ph2.
    make(
      9,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4), pawn(3, 3),
        knight(7, 4), bishop(5, 5),
        pawn(7, 2), pawn(6, 4), pawn(8, 2),
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

## swarm-L9-v3 — score -8.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | . . . . p . p .
4 | . . . p . p . p
3 | p n p b . p . .
2 | . . . p . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — PAWN STORM. 9 pawns. 3-ring shell around the f4 key; dismantle the chain from the outside in.
    // Key pf4; defended by pe5 pg5; shell pd4 ph4 pf3; hunters kb3 bd3; marchers pa3 pd2 pc3.
    make(
      9,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        pawn(4, 4), pawn(8, 4), pawn(6, 3),
        knight(2, 3), bishop(4, 3),
        pawn(1, 3), pawn(4, 2), pawn(3, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 16,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## corner-keep-L9-v3 — score -123

```
8 | . . . . # : : k
7 | . . . . # : : :
6 | . . . . # : : :
5 | . . . . . . p .
4 | p q . . b b . p
3 | . . . p n . p .
2 | . . p . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L9 — THE CITADEL. 3x3 corner room on h8; key h4 on his file, chain runs inward.
    // Key ph4; defended by pg5; shell pg3; hunters qb4 bf4 be4 ke3; marchers pa4 pd3 pc2.
    make(
      9,
      [
        pawn(8, 4),
        pawn(7, 5),
        pawn(7, 3),
        queen(2, 4), bishop(6, 4), bishop(5, 4), knight(5, 3),
        pawn(1, 4), pawn(4, 3), pawn(3, 2),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(5, 6), X(5, 7), X(5, 8)],
        kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7', 'f6', 'g6', 'h6'],
      },
    ),
```

## corner-keep-L10-v3 — score 83

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | : : : # . . . .
5 | . p . . . b . .
4 | p . n q p . p .
3 | . p q . . p . .
2 | . . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE LAST TOWER. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qd4 qc3 bf5 kc4; marchers pe4 pg4 pf3.
    make(
      10,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(4, 4), queen(3, 3), bishop(6, 5), knight(3, 4),
        pawn(5, 4), pawn(7, 4), pawn(6, 3),
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

## corner-keep-L10-v2 — score 49.5

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | : : : # . . . .
5 | . p . . . . . .
4 | p . . q n . . .
3 | . p . . p b q p
2 | . . . . . . p .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE LAST TOWER. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qd4 qg3 bf3 ke4; marchers ph3 pe3 pg2.
    make(
      10,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(4, 4), queen(7, 3), bishop(6, 3), knight(5, 4),
        pawn(8, 3), pawn(5, 3), pawn(7, 2),
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

## swarm-L10-v2 — score 16.5

```
8 | . . . # : k : #
7 | . . . # : : : #
6 | . . . # : : : #
5 | b . . . p . p .
4 | . p . p . p . p
3 | n . p p . p . .
2 | . . . . . . . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE SWARM. 10 pawns. 3-ring shell around the f4 key; dismantle the chain from the outside in.
    // Key pf4; defended by pe5 pg5; shell pd4 ph4 pf3; hunters ka3 ba5; marchers pc3 pb4 pd3 ph2.
    make(
      10,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        pawn(4, 4), pawn(8, 4), pawn(6, 3),
        knight(1, 3), bishop(1, 5),
        pawn(3, 3), pawn(2, 4), pawn(4, 3), pawn(8, 2),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 19,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
```

## corner-keep-L10-v1 — score 16

```
8 | k : : # . . . .
7 | : : : # . . . .
6 | : : : # . . . .
5 | . p . . . . . .
4 | p . . q . . . .
3 | . p . p p b . p
2 | . . . n . . . q
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE LAST TOWER. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qh2 qd4 bf3 kd2; marchers ph3 pd3 pe3.
    make(
      10,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(8, 2), queen(4, 4), bishop(6, 3), knight(4, 2),
        pawn(8, 3), pawn(4, 3), pawn(5, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 19,
        hazards: [X(4, 6), X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7', 'a6', 'b6', 'c6'],
      },
    ),
```

## swarm-L10-v1 — score 8

```
8 | . . # : k : # .
7 | . . # : : : # .
6 | . . # : : : # .
5 | . . . p . p . .
4 | . n p . p . p .
3 | . . b . p . . p
2 | p . . . . . . .
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE SWARM. 8 pawns. 3-ring shell around the e4 key; dismantle the chain from the outside in.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4 pe3; hunters kb4 bc3; marchers ph3 pa2.
    make(
      10,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4), pawn(5, 3),
        knight(2, 4), bishop(3, 3),
        pawn(8, 3), pawn(1, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 20,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
```

## swarm-L10-v3 — score 8

```
8 | . # : k : # . .
7 | . # : : : # . .
6 | . # : : : # . .
5 | b . p . p . . .
4 | . p . p . p n .
3 | . p . p . p . .
2 | p . . . . . . p
1 | . . . . . . . .
    a b c d e f g h
```

```ts
    // L10 — THE SWARM. 10 pawns. 3-ring shell around the d4 key; dismantle the chain from the outside in.
    // Key pd4; defended by pc5 pe5; shell pb4 pf4 pd3; hunters kg4 ba5; marchers ph2 pa2 pf3 pb3.
    make(
      10,
      [
        pawn(4, 4),
        pawn(3, 5), pawn(5, 5),
        pawn(2, 4), pawn(6, 4), pawn(4, 3),
        knight(7, 4), bishop(1, 5),
        pawn(8, 2), pawn(1, 2), pawn(6, 3), pawn(2, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 19,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
```
