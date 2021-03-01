/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Bus                } from '../api/bus';
import { RAM                } from '../api/ram';
import { ROM, Mirror        } from '../api/rom';
import { uint16, uint8      } from '../api/types';

export class PPUBus implements Bus {
  public rom: ROM;

  public ram: RAM;

  public bgPalette: RAM;

  public spPalette: RAM;

  public readByte(addr: uint16): uint8 {
    addr &= 0x3FFF;
    if (addr < 0x2000)  return this.rom.mapper.read(addr);
    if (addr < 0x3000)  return this.ram.read(this.mirrored(addr));
    if (addr < 0x3F00)  return this.readByte(addr - 0x1000);
    addr &= 0x3F1F;
    if (addr < 0x3F10)  return this.bgPalette.read(addr);
    if (!(addr & 0b11)) return this.bgPalette.read(addr - 0x10);
    return this.spPalette.read(addr);
  }

  public writeByte(addr: uint16, data: uint8): void {
    addr &= 0x3FFF;
    if (addr < 0x2000)  return this.rom.mapper.write(addr, data);
    if (addr < 0x3000)  return this.ram.write(this.mirrored(addr), data);
    if (addr < 0x3F00)  return this.writeByte(addr - 0x1000, data);
    addr &= 0x3F1F;
    if (addr < 0x3F10)  return this.bgPalette.write(addr, data);
    if (!(addr & 0b11)) return this.bgPalette.write(addr - 0x10, data);
    return this.spPalette.write(addr, data);
  }

  public readWord(addr: uint16): uint16 {
    return this.readByte(addr + 1) << 8 | this.readByte(addr);
  }

  public writeWord(addr: uint16, data: uint16): void {
    this.writeByte(addr,     data     );
    this.writeByte(addr + 1, data >> 8)
  }

  private mirrored(addr: uint16): uint16 {
    switch (this.rom.header.mirror) {
      case Mirror.HORIZONTAL:
        return (addr & 0b0010_0011_1111_1111) | (addr & 0b0000_1000_0000_0000 ? 0b0000_0100_0000_0000 : 0);
      case Mirror.VERTICAL:
        return addr & 0x27FF;
      case Mirror.FOUR_SCREEN:
        return addr;
      case Mirror.SINGLE_SCREEN_LOWER_BANK:
        return addr & 0x23FF;
      case Mirror.SINGLE_SCREEN_UPPER_BANK:
        return addr & 0x23FF + 0x0400;
      default:
        throw new Error(`invalid mirror type: '${this.rom.header.mirror}'`);
    }
  }
}
