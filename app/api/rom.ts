/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Mapper } from './mapper';

export const Mirror = {
  HORIZONTAL               : 0,
  VERTICAL                 : 1,
  FOUR_SCREEN              : 2,
  SINGLE_SCREEN_LOWER_BANK : 3,
  SINGLE_SCREEN_UPPER_BANK : 4,
} as const;

export type Mirror = typeof Mirror[keyof typeof Mirror];

export interface Header {
  prg: number;

  chr: number;

  mapper: number;

  mirror: Mirror;

  hasBattery: boolean;

  isTrained: boolean;
}

export interface ROM {
  readonly header: Header;

  readonly mapper: Mapper;
}
