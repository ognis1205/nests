/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Controller, SpriteSize } from '../api/ppu';
import { uint8, uint16          } from '../api/types';

const BaseNameTableAddressList = [0x2000, 0x2400, 0x2800, 0x2C00];

export class RP2A03Controller implements Controller {
  public ntableAddr: uint16 = BaseNameTableAddressList[0];

  public vramInc: uint8 = 1;

  public spPttrAddr: uint16 = 0;

  public bgPttrAddr: uint16 = 0;

  public spSize: SpriteSize = SpriteSize.SIZE_8X8;

  public isNMIEnabled: boolean = false;

  public set data(data: uint8) {
    this.ntableAddr   = BaseNameTableAddressList[data & 0x03];
    this.vramInc      = data & 0x04 ? 32 : 1;
    this.spPttrAddr   = data & 0x08 ? 0x1000 : 0;
    this.bgPttrAddr   = data & 0x10 ? 0x1000 : 0;
    this.spSize       = data & 0x20 ? SpriteSize.SIZE_8X16 : SpriteSize.SIZE_8X8;
    this.isNMIEnabled = !!(data & 0x80);
  }

  public get data(): uint8 {
    return BaseNameTableAddressList.indexOf(this.ntableAddr) |
           (this.vramInc === 1 ? 0 : 1) << 2 |
           (this.spPttrAddr ? 1 : 0) << 3 |
           (this.bgPttrAddr ? 1 : 0) << 4 |
           (this.spSize === SpriteSize.SIZE_8X8 ? 0 : 1) << 5 |
           (this.isNMIEnabled ? 1 : 0) << 7;
  }
}
