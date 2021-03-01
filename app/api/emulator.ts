/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Controller } from './controller';

export interface Options {
  sampleRate: number;

  onSample: (volume: number) => void;

  onFrame: (frame: Uint32Array) => void;

  sramLoad?: Uint8Array;
}

export interface Emulator {
  readonly player1: Controller,

  readonly player2: Controller,

  readonly sram: Uint8Array;

  tick(): void;

  frame(): void;
}
