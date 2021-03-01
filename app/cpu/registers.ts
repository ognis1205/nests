/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Registers     } from '../api/cpu';
import { uint16, uint8 } from '../api/types';

export class MOS6502Registers implements Registers {
  public PC: uint16 = 0x0000;

  public SP:  uint8 = 0x00;

  public P:   uint8 = 0x00;

  public A:   uint8 = 0x00;

  public X:   uint8 = 0x00;

  public Y:   uint8 = 0x00;
}
