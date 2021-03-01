/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { uint16, uint8 } from './types';

export const Flag = {
  C : 1 << 0,
  Z : 1 << 1,
  I : 1 << 2,
  D : 1 << 3,
  B : 1 << 4,
  U : 1 << 5,
  V : 1 << 6,
  N : 1 << 7
} as const;

export type Flag = typeof Flag[keyof typeof Flag];

export interface Registers {
  readonly PC: uint16;

  readonly SP:  uint8;

  readonly P:   uint8;

  readonly A:   uint8;

  readonly X:   uint8;

  readonly Y:   uint8;
}

export interface CPU {
  tick(): void;

  rst(): void;  

  irq(): void;

  nmi(): void;
}
