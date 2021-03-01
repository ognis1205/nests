/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Interrupt     } from '../api/interrupt';
import { Mapper        } from '../api/mapper';
import { ROM, Mirror   } from '../api/rom';
import { uint16, uint8 } from '../api/types';

export class Mapper001 implements Mapper {
  public interrupt: Interrupt;

  private shifter = 0x10;

  private chrBankMode = 0;

  private chrBanks = [0, 0];

  private prgBankMode = 0;

  private prgBank = 0;

  constructor(
    private readonly rom: ROM,
    private readonly ram: Uint8Array,
    private readonly prg: Uint8Array,
    private readonly chr: Uint8Array,
    private readonly prgBanks = prg.length >> 14) {
    this.chr = new Uint8Array(128 * 1024);
    this.chr.set(chr);
    this.prgBankMode = 3;
  }

  public read(addr: uint16): uint8 {
    addr &= 0xFFFF;
    if (addr  < 0x2000) return this.readChr(addr);
    if (addr >= 0x8000) return this.readPrg(addr);
    if (addr >= 0x6000) return this.ram[addr - 0x6000];
    return 0x00;
  }

  public write(addr: uint16, data: uint8): void {
    addr &= 0xFFFF;
    if (addr  < 0x2000) {
      this.writeChr(addr, data);
      return;
    }
    if (addr >= 0x8000) {
      this.readReg(addr, data);
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

  private readReg(addr: uint16, data: uint8): void {
    if (data & 0x80) {
      this.shifter = 0x10;
      this.prgBankMode = 3;
    } else {
      const isOnFifthWrite = !!(this.shifter & 0x01);
      this.shifter >>= 1;
      this.shifter |= data & 0x01 ? 0x10 : 0;
      if (isOnFifthWrite) {
        this.writeReg(addr, this.shifter);
        this.shifter = 0x10;
      }
    }
  }

  private writeReg(addr: uint16, data: uint8): void {
    if (addr < 0xA000) {
      switch (data & 0x03) {
        case 0: this.rom.header.mirror = Mirror.SINGLE_SCREEN_LOWER_BANK; break;
        case 1: this.rom.header.mirror = Mirror.SINGLE_SCREEN_UPPER_BANK; break;
        case 2: this.rom.header.mirror = Mirror.VERTICAL;                 break;
        case 3: this.rom.header.mirror = Mirror.HORIZONTAL;               break;
      }
      this.prgBankMode = data >> 2 & 0x03;
      this.chrBankMode = data >> 4 & 0x01;
      return;
    }
    if (addr < 0xC000) {
      this.chrBanks[0] = data & 0x1F;
      return;
    }
    if (addr < 0xE000) {
      this.chrBanks[1] = data & 0x1F;
      return;
    }
    this.prgBank = data & 0x0F;
  }

  private readChr(addr: uint16): uint8 {
    return this.chr[this.chrOffset(addr)];
  }

  private writeChr(addr: uint16, data: uint8): void {
    this.chr[this.chrOffset(addr)] = data;
  }

  private readPrg(addr: uint16): uint8 {
    return this.prg[this.prgOffset(addr)];
  }

  private chrOffset(addr: uint16): uint16 {
    if (this.chrBankMode) return (this.chrBanks[addr >> 12] << 12) + (addr & 0x0FFF);
    else return ((this.chrBanks[0] & 0x1E) << 12) + addr;
  }

  private prgOffset(addr: uint16): uint16 {
    addr -= 0x8000;
    switch (this.prgBankMode) {
      case 0: case 1: return ((this.prgBank & 0x0E) << 14) + addr;
      case 2:         return (addr >> 14) === 0 ? (addr & 0x3FFF) : (this.prgBank << 14) + (addr & 0x3FFF);
      case 3:         return (addr >> 14) === 0 ? (this.prgBank << 14) + (addr & 0x3FFF) : ((this.prgBanks - 1) << 14) + (addr & 0x3FFF);
    }
  }
}
