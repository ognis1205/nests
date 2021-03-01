/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Interrupt     } from './interrupt';
import { uint16, uint8 } from './types';

export interface Mapper {
  read(addr: uint16): uint8;

  write(addr: uint16, data: uint8): void;

  handlePPUClock(scanLine: number, cycle: number): void;

  interrupt: Interrupt;
}
