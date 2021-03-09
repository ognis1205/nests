/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { uint16, uint8 } from './types';

export interface APU {
  tick(): void;

  cpuRead(addr: uint16): uint8;

  cpuWrite(addr: uint16, data: uint8): void;
}
