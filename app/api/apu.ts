/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Bus           } from '../api/bus';
import { Interrupt     } from '../api/interrupt';
import { uint16, uint8 } from './types';

export interface Channel {
  readonly volume: uint8;

  isEnabled: boolean;

  lengthCounter: uint8;
  
  tick(): void;

  envelope(): void;

  countLinear(): void;

  countLength(): void;

  sweep(): void;

  cpuWrite(addr: uint16, data: uint8): void;
}

export interface DMC {
  readonly volume: uint8;

  isEnabled: boolean;

  cpuBus: Bus;

  bytesRemaining: number;

  interrupt: Interrupt;

  isInterrupted: boolean;

  tick(): void;

  cpuWrite(addr: uint16, data: uint8): void;
}

export interface APU {
  tick(): void;

  cpuRead(addr: uint16): uint8;

  cpuWrite(addr: uint16, data: uint8): void;
}
