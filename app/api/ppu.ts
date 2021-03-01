/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { uint16, uint8 } from './types';

export const SpriteSize = {
  SIZE_8X8  : 8,
  SIZE_8X16 : 16
} as const;

export type SpriteSize = typeof SpriteSize[keyof typeof SpriteSize];

export interface Controller {
  data: uint8;

  readonly ntableAddr: uint16;

  readonly vramInc: uint8;

  readonly spPttrAddr: uint16;

  readonly bgPttrAddr: uint16;

  readonly spSize: number;

  readonly isNMIEnabled: boolean;
}

export interface Mask {
  data: uint8;

  readonly isColorful: boolean;

  readonly isShowBgLeft8px: boolean;

  readonly isShowSpLeft8px: boolean;

  readonly isShowBg: boolean;

  readonly isShowSp: boolean;

  readonly emphasizeRed: boolean;

  readonly emphasizeGreen: boolean;

  readonly emphasizeBlue: boolean;
}

export interface Status {
  readonly data: uint8;

  isSpOverflow: boolean;

  isZeroSpHit: boolean;

  isVBlankStarted: boolean;
}

export interface PPU {
  pixels: Uint8Array;

  tick(): void;

  cpuRead(address: uint16): uint8;

  cpuWrite(address: uint16, data: uint8): void;

  dma(data: Uint8Array): void;
}
