/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { APU           } from '../api/apu';
import { Bus           } from '../api/bus';
import { Controller    } from '../api/controller';
import { DMA           } from '../api/dma';
import { PPU           } from '../api/ppu';
import { RAM           } from '../api/ram';
import { ROM           } from '../api/rom';
import { uint16, uint8 } from '../api/types';

export class CPUBus implements Bus {
  public rom: ROM;

  public ram: RAM;

  public ppu: PPU;

  public apu: APU;

  public dma: DMA;

  public player1: Controller;

  public player2: Controller;

  public writeByte(addr: uint16, data: uint8): void {
    const writeControllers = (data: uint8) => {
      this.player1.write(data);
      this.player2.write(data);
      return;
    }
    if (addr  <  0x2000) return this.ram.write(addr & 0x07FF, data);
    if (addr  <  0x4000) return this.ppu.cpuWrite(addr & 0x2007, data);
    if (addr === 0x4014) return this.dma.copy(data << 8);
    if (addr === 0x4016) return writeControllers(data);
    if (addr  <  0x4018) return this.apu.cpuWrite(addr, data);
    if (addr  <  0x4020) return;
    return this.rom.mapper.write(addr, data);
  }

  public writeWord(addr: uint16, data: uint16): void {
    this.writeByte(addr,     (data     ) & 0xFF);
    this.writeByte(addr + 1, (data >> 8) & 0xFF)
  }

  public readByte(addr: uint16): uint8 {
    if (addr  <  0x2000) return this.ram.read(addr & 0x07FF);
    if (addr  <  0x4000) return this.ppu.cpuRead(addr & 0x2007);
    if (addr === 0x4014) return 0x00;
    if (addr === 0x4016) return this.player1.read();
    if (addr === 0x4017) return this.player2.read();
    if (addr  <  0x4018) return this.apu.cpuRead(addr);
    if (addr  <  0x4020) return 0x00;
    return this.rom.mapper.read(addr);
  }

  public readWord(addr: uint16): uint16 {
    return (this.readByte(addr + 1) << 8 | this.readByte(addr)) & 0xFFFF;
  }
}
