/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Mask  } from '../api/ppu';
import { uint8 } from '../api/types';

export class RP2A03Mask implements Mask {
  public isColorful: boolean;

  public isShowBgLeft8px: boolean;

  public isShowSpLeft8px: boolean;

  public isShowBg: boolean;

  public isShowSp: boolean;

  public emphasizeRed: boolean;

  public emphasizeGreen: boolean;

  public emphasizeBlue: boolean;

  public set data(data: uint8) {
    this.isColorful = !(data & 0x01);
    this.isShowBgLeft8px = !!(data & 0x02);
    this.isShowSpLeft8px = !!(data & 0x04);
    this.isShowBg        = !!(data & 0x08);
    this.isShowSp        = !!(data & 0x10);
    this.emphasizeRed    = !!(data & 0x20);
    this.emphasizeGreen  = !!(data & 0x40);
    this.emphasizeBlue   = !!(data & 0x80);
  }

  public get data(): uint8 {
    return (this.isColorful ? 0 : 1) |
      (this.isShowBgLeft8px ? 1 : 0) << 1 |
      (this.isShowSpLeft8px ? 1 : 0) << 2 |
      (this.isShowBg ? 1 : 0) << 3 |
      (this.isShowSp ? 1 : 0) << 4 |
      (this.emphasizeRed ? 1 : 0) << 5 |
      (this.emphasizeGreen ? 1 : 0) << 6 |
      (this.emphasizeBlue ? 1 : 0) << 7;
  }
}
