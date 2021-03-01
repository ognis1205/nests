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

export class Mapper002 implements Mapper {
  public interrupt: Interrupt;

  private bankSelect = 0;

  constructor(
    private readonly rom: ROM,
    private readonly ram: Uint8Array,
    private readonly prg: Uint8Array,
    private readonly chr: Uint8Array) {
    this.chr = new Uint8Array(8 * 1024);
    this.chr.set(chr);
  }

  public read(addr: uint16): uint8 {
    addr &= 0xFFFF;
    if (addr  < 0x2000) return this.chr[addr];
    if (addr >= 0x8000) return addr < 0xC000 ?
        this.prg[(this.bankSelect << 14) + addr - 0x8000] :
        this.prg[this.prg.length - 0x4000 + (addr - 0xC000)];
    if (addr >= 0x6000) return this.ram[addr - 0x6000];
    return 0x00;
  }

  public write(addr: uint16, data: uint8): void {
    addr &= 0xFFFF;
    if (addr < 0x2000) {
      this.chr[addr] = data;
      return;
    }
    if (addr >= 0x8000) {
      this.bankSelect = data & 0x0F;
      return;
    }
    if (addr >= 0x6000) {
      this.ram[addr - 0x6000] = data;
      return;
    }
  }

  public handlePPUClock(scanLine: number, cycle: number) {
    /* do nothing */
  }
}
