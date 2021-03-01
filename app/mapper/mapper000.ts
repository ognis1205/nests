/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Interrupt     } from '../api/interrupt';
import { Mapper        } from '../api/mapper';
import { ROM           } from '../api/rom';
import { uint16, uint8 } from '../api/types';

export class Mapper000 implements Mapper {
  public interrupt: Interrupt;

  private readonly isMirrored: boolean;

  constructor(
    private readonly rom: ROM,
    private readonly ram: Uint8Array,
    private readonly prg: Uint8Array,
    private readonly chr: Uint8Array) {
    this.isMirrored = prg.length === 16 * 1024;
    if (chr.length === 0) this.chr = new Uint8Array(0x2000);
  }

  public read(addr: uint16): uint8 {
    addr &= 0xFFFF;
    if (addr  < 0x2000) return this.chr[this.map(addr)];
    if (addr >= 0x8000) return this.prg[this.map(addr)];
    if (addr >= 0x6000) return this.ram[addr - 0x6000 ];
    return 0x00;
  }

  public write(addr: uint16, data: uint8): void {
    addr &= 0xFFFF;
    if (addr  < 0x2000) {
      this.chr[this.map(addr)] = data;
      return;
    }
    if (addr >= 0x8000) {
      this.prg[this.map(addr)] = data;
      return;
    }
    if (addr >= 0x6000) {
      this.ram[addr - 0x6000] = data;
      return;
    }
  }

  public handlePPUClock(scanLine: number, cycle: number): void {
    /* do nothing */
  }

  private map(addr: uint16): uint16 {
    if (addr < 0x2000) return addr;
    else return (this.isMirrored ? addr & 0b1011111111111111 : addr) - 0x8000;
  }
}
