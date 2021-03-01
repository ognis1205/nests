/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { uint8 } from './types';

export const Button = {
  A      : 0x80,
  B      : 0x40,
  SELECT : 0x20,
  START  : 0x10,
  UP     : 0x08,
  DOWN   : 0x04,
  LEFT   : 0x02,
  RIGHT  : 0x01
} as const;

export type Button = typeof Button[keyof typeof Button];

export interface Controller {
  write(data: uint8): void;

  read(): uint8;

  update(button: Button, isPressDown: boolean): void;
}
