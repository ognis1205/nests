/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Status } from '../api/ppu';
import { uint8  } from '../api/types';

export class RP2A03Status implements Status {
  public isSpOverflow: boolean;

  public isZeroSpHit: boolean;

  public isVBlankStarted: boolean;

  public get data(): uint8 {
    return (this.isSpOverflow ? 0x20 : 0) | (this.isZeroSpHit ? 0x40 : 0) | (this.isVBlankStarted ? 0x80 : 0);
  }
}
