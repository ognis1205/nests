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

export class Mapper003 implements Mapper {
  public interrupt: Interrupt;

  private chrBankSelect = 0;

  constructor(
    private readonly rom: ROM,
    private readonly ram: Uint8Array,
    private readonly prg: Uint8Array,
    private readonly chr: Uint8Array) {
    this.chr = new Uint8Array(32 * 1024);
    this.chr.set(chr);
    this.prg = new Uint8Array(32 * 1024);
    this.prg.set(prg);
    if (prg.length === 16 * 1024) this.prg.set(prg, 16 * 1024);
  }

  public read(addr: uint16): uint8 {
    addr &= 0xFFFF;
    if (addr  < 0x2000) return this.chr[(this.chrBankSelect << 13) + addr];
    if (addr >= 0x8000) return this.prg[addr - 0x8000];
    if (addr >= 0x6000) return this.ram[addr - 0x6000];
    return 0x00;
  }

  public write(addr: uint16, data: uint8): void {
    addr &= 0xFFFF;
    if (addr < 0x2000) {
      this.chr[(this.chrBankSelect << 13) + addr] = data;
      return;
    }
    if (addr >= 0x8000) {
      this.chrBankSelect = data & 0x03;
      return;
    }
    if (addr >= 0x6000) {
      this.ram[addr - 0x6000] = data;
    }
  }

  public handlePPUClock(scanLine: number, cycle: number): void {
    /* do nothing */
  }
}
