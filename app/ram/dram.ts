/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { RAM           } from '../api/ram';
import { uint16, uint8 } from '../api/types';

export class DRAM implements RAM {
  private readonly data: Uint8Array;

  constructor(size: number, private readonly offset = 0x0000) {
    this.data = new Uint8Array(size);
  }

  public read(addr: uint16): uint8 {
    return this.data[(addr - this.offset) & 0xFFFF];
  }

  public write(addr: uint16, data: uint8): void {
    this.data[(addr - this.offset) & 0xFFFF] = data;
  }
}
