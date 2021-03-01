/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Mapper              } from '../api/mapper';
import { ROM, Header, Mirror } from '../api/rom';
import { Mapper000           } from '../mapper/mapper000';
import { Mapper001           } from '../mapper/mapper001';
import { Mapper002           } from '../mapper/mapper002';
import { Mapper003           } from '../mapper/mapper003';

export class INES implements ROM {
  public readonly mapper: Mapper;

  public readonly header: Header = {} as any;

  constructor(data: Uint8Array, sram: Uint8Array) {
    INES.check(data);
    this.parse(data);
    const prg = data.slice(
      (this.header.isTrained ? 16 + 512 : 16),
      (this.header.isTrained ? 16 + 512 : 16) + this.header.prg * 16 * 1024);
    const chr = data.slice(
      ((this.header.isTrained ? 16 + 512 : 16) + prg.length),
      ((this.header.isTrained ? 16 + 512 : 16) + prg.length) + this.header.chr * 8 * 1024);
    switch (this.header.mapper) {
      case   0: this.mapper = new Mapper000(this, sram, prg, chr); break;
      case   1: this.mapper = new Mapper001(this, sram, prg, chr); break;
      case   2: this.mapper = new Mapper002(this, sram, prg, chr); break;
      case   3: this.mapper = new Mapper003(this, sram, prg, chr); break;
      default : throw new Error(`unsupported mapper: ${this.header.mapper}`);
    }
  }

  private parse(data: Uint8Array): void {
    this.header.prg        = data[4];
    this.header.chr        = data[5];
    this.header.mapper     = (data[7] >> 4) << 4 | (data[6] >> 4);
    this.header.mirror     = data[6] & 0x08 ? Mirror.FOUR_SCREEN : data[6] & 0x01 ? Mirror.VERTICAL : Mirror.HORIZONTAL;
    this.header.hasBattery = !!(data[6] & 0x02);
    this.header.isTrained  = !!(data[6] & 0x04);
  }

  private static check(data: Uint8Array): void {
    const magic = 'NES\u001a';
    for (let i = 0; i < magic.length; i++) if (data[i] !== magic.charCodeAt(i)) throw new Error('Invalid nes file');
    if ((data[7] & 0x0C) === 0x08) throw new Error('NES2.0 is not currently supported');
  }
}
