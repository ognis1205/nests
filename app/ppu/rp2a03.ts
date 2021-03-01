/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Bus                                       } from '../api/bus';
import { Interrupt                                 } from '../api/interrupt';
import { Mapper                                    } from '../api/mapper';
import { Controller, Mask, PPU, Status, SpriteSize } from '../api/ppu';
import { uint16, uint8                             } from '../api/types';
import { RP2A03Controller                          } from './controller';
import { RP2A03Mask                                } from './mask';
import { RP2A03Status                              } from './status';

interface Loopy {
  vramaddr: uint16;
  tramaddr: uint16;
  fineX: uint8;
  toggle: boolean;
}

interface Shifter {
  bgLo: uint16;
  bgHi: uint16;
  bgAttrLo: uint16;
  bgAttrHi: uint16;
}

interface Latch {
  ntable: uint8;
  attr: uint8;
  bgLo: uint8;
  bgHi: uint8;
  status: uint8;
}

interface Sprite {
  x: uint8;
  y: uint8;
  tile: uint8;
  attr: uint8;
  isZero: boolean;
}

export class RP2A03 implements PPU {
  public bus: Bus;

  public mapper: Mapper;

  public interrupt: Interrupt;

  public pixels: Uint8Array = new Uint8Array(256 * 240);

  public oam1: Uint8Array = new Uint8Array(256);

  private controller: Controller = new RP2A03Controller();

  private mask: Mask = new RP2A03Mask();

  private status: Status = new RP2A03Status();

  private register: Loopy = { vramaddr: 0x0000, tramaddr: 0x0000, fineX: 0x00, toggle: false };

  private shifter: Shifter = {} as any;

  private latch: Latch = {} as any;

  private nmiDelay = 0;

  private frame = 0;

  private scanLine = 240;

  private cycle = 340;

  private oamAddr = 0;

  private oam2: Sprite[] = Array(8).fill(0).map(() => Object.create(null));

  private spritePixels: number[] = new Array(256);

  constructor(private readonly onFrame: (frame: Uint8Array) => void) {}

  public tick(): void {
    if (this.scanLine === 261
        && this.cycle === 339
        && this.frame & 0x01
        && (this.mask.isShowBg || this.mask.isShowSp)) this.ticked();

    this.ticked();

    if (!this.mask.isShowBg && !this.mask.isShowSp) return;

    if (0 <= this.scanLine && this.scanLine <= 239) {
      if ( 1 === this.cycle) this.clearSp();
      if (65 === this.cycle) this.evaluateSp();
      if (1 <= this.cycle && this.cycle <= 256) {
        this.shiftBg();
        this.draw();
        this.fetchBg();
      }
      if (this.cycle === 256) this.scrollY();
      if (this.cycle === 257) this.copyHBits();
      if (this.cycle === 257) this.fetchSp();
      if (321 <= this.cycle && this.cycle <= 336) {
        this.shiftBg();
        this.fetchBg();
      }
    }

    if (this.scanLine === 261) {
      if (1 <= this.cycle && this.cycle <= 256) {
        this.shiftBg();
        this.fetchBg();
      }
      if (this.cycle === 256) this.scrollY();
      if (this.cycle === 257) this.copyHBits();
      if (this.cycle === 280) this.copyVBits();
      if (321 <= this.cycle && this.cycle <= 336) {
        this.shiftBg();
        this.fetchBg();
      }
    }
  }

  public cpuRead(addr: uint16): uint8 {
    switch (addr) {
      case 0x2000: {
        return this.controller.data;
      }
      case 0x2001: {
        return this.mask.data;
      }
      case 0x2002: {
        const data = this.status.data | this.latch.status;
        this.status.isVBlankStarted = false;
        this.register.toggle = false;
        return data;
      }
      case 0x2003: {
        return 0x00;
      }
      case 0x2004: {
        return this.oam1[this.oamAddr];
      }
      case 0x2005: {
        return 0x00;
      }
      case 0x2006: {
        return 0x00;
      }
      case 0x2007: {
        let data = this.bus.readByte(this.register.vramaddr);
        if (this.register.vramaddr <= 0x3EFF) {
          const tmp = this.register.tramaddr;
          this.register.tramaddr = data;
          data = tmp;
        } else {
          this.register.tramaddr = this.bus.readByte(this.register.vramaddr - 0x1000);
        }
        this.register.vramaddr += this.controller.vramInc;
        this.register.vramaddr &= 0x7FFF;
        return data;
      }
    }
    return 0x00;
  }

  public cpuWrite(address: uint16, data: uint8): void {
    data &= 0xFF;
    this.latch.status = data & 0x1F;
    switch (address) {
      case 0x2000: {
        this.controller.data = data;
        this.register.tramaddr = this.register.tramaddr & 0xF3FF | (data & 0x03) << 10;
        break;
      }
      case 0x2001: {
        this.mask.data = data;
        break;
      }
      case 0x2002: {
        break;
      }
      case 0x2003: {
        this.oamAddr = data;
        break;
      }
      case 0x2004: {
        this.oam1[this.oamAddr++ & 0xFF] = data;
        break;
      }
      case 0x2005: {
        if (!this.register.toggle) {
          this.register.tramaddr = this.register.tramaddr & 0xFFE0 | data >> 3;
          this.register.fineX    = data & 0x07;
          this.register.toggle   = true;
        } else {
          this.register.tramaddr = this.register.tramaddr & 0x0C1F | (data & 0x07) << 12 | (data & 0xF8) << 2;
          this.register.toggle   = false;
        }
        break;
      }
      case 0x2006: {
        if (!this.register.toggle) {
          this.register.tramaddr = this.register.tramaddr & 0x80FF | (data & 0x3F) << 8;
          this.register.toggle   = true;
        } else {
          this.register.tramaddr = this.register.tramaddr & 0xFF00 | data;
          this.register.vramaddr = this.register.tramaddr;
          this.register.toggle   = false;
        }
        break;
      }
      case 0x2007: {
        this.bus.writeByte(this.register.vramaddr, data);
        this.register.vramaddr += this.controller.vramInc;
        break;
      }
    }
  }

  public dma(data: Uint8Array) {
    for (let i = 0; i < 256; i++) this.oam1[(i + this.oamAddr) & 0xFF] = data[i];
  }

  private ticked(): void {
    if (this.status.isVBlankStarted
        && this.controller.isNMIEnabled
        && this.nmiDelay-- === 0) this.interrupt.nmi();

    this.cycle++;

    if (this.cycle > 340) {
      this.cycle = 0;
      this.scanLine++;
      if (this.scanLine > 261) {
        this.scanLine = 0;
        this.frame++;
        this.onFrame(this.pixels);
      }
    }

    if (this.scanLine === 241 && this.cycle === 1) {
      this.status.isVBlankStarted = true;
      if (this.controller.isNMIEnabled) this.nmiDelay = 15;
    }

    if (this.scanLine === 261 && this.cycle === 1) {
      this.status.isVBlankStarted = false;
      this.status.isZeroSpHit = false;
      this.status.isSpOverflow = false;
    }

    if (this.mask.isShowBg || this.mask.isShowSp) this.mapper.handlePPUClock(this.scanLine, this.cycle);
  }

  private fetchBg(): void {
    if (!this.mask.isShowBg) return;
    switch (this.cycle & 0x07) {
      case 1: {
        this.shifter.bgLo     |= this.latch.bgLo;
        this.shifter.bgHi     |= this.latch.bgHi;
        this.shifter.bgAttrLo |= (this.latch.attr & 0x01) ? 0xFF : 0;
        this.shifter.bgAttrHi |= (this.latch.attr & 0x02) ? 0xFF : 0;
        const addr = 0x2000 | (this.register.vramaddr & 0x0FFF);
        this.latch.ntable = this.bus.readByte(addr);
        break;
      }
      case 3: {
        const addr = 0x23C0
                   | (this.register.vramaddr & 0x0C00)
                   | ((this.register.vramaddr >> 4) & 0x38)
                   | ((this.register.vramaddr >> 2) & 0x07);
        const isRight   = !!(this.register.vramaddr & 0x02);
        const isBottom  = !!(this.register.vramaddr & 0x40);
        const offset    = (isBottom ? 0x02 : 0) | (isRight ? 0x01 : 0);
        this.latch.attr = this.bus.readByte(addr) >> (offset << 1) & 0x03;
        break;
      }
      case 5: {
        const addr = this.controller.bgPttrAddr
                   + this.latch.ntable * 16
                   + (this.register.vramaddr >> 12 & 0x07);
        this.latch.bgLo = this.bus.readByte(addr);
        break;
      }
      case 7: {
        const addr = this.controller.bgPttrAddr
                   + this.latch.ntable * 16
                   + (this.register.vramaddr >> 12 & 0x07) + 8;
        this.latch.bgHi = this.bus.readByte(addr);
        break;
      }
      case 0: {
        if ((this.register.vramaddr & 0x001F) === 31) {
          this.register.vramaddr &= ~0x001F;
          this.register.vramaddr ^= 0x0400;
        } else {
          this.register.vramaddr += 1;
        }
        break;
      }
    }
  }

  private shiftBg(): void {
    if (!this.mask.isShowBg) return;
    this.shifter.bgLo <<= 1;
    this.shifter.bgHi <<= 1;
    this.shifter.bgAttrLo <<= 1;
    this.shifter.bgAttrHi <<= 1;
  }

  private scrollY(): void {
    if ((this.register.vramaddr & 0x7000) !== 0x7000) {
      this.register.vramaddr += 0x1000;
    } else {
      this.register.vramaddr &= ~0x7000;
      let y = (this.register.vramaddr & 0x03E0) >> 5;
      if (y === 29) {
        y = 0;
        this.register.vramaddr ^= 0x0800;
      } else if (y === 31) {
        y = 0;
      } else {
        y += 1;
      }
      this.register.vramaddr = (this.register.vramaddr & ~0x03E0) | (y << 5);
    }
  }

  private copyHBits(): void {
    this.register.vramaddr = (this.register.vramaddr & 0b1111101111100000) | (this.register.tramaddr & ~0b1111101111100000) & 0x7FFF;
  }

  private copyVBits(): void {
    this.register.vramaddr = (this.register.vramaddr & 0b1000010000011111) | (this.register.tramaddr & ~0b1000010000011111) & 0x7FFF;
  }

  private draw(): void {
    const x = this.cycle - 1;
    const y = this.scanLine;
    const offset = 0x8000 >> this.register.fineX;
    const bgPal  = (this.shifter.bgAttrHi & offset ? 1 : 0) << 3
                 | (this.shifter.bgAttrLo & offset ? 1 : 0) << 2
                 | (this.shifter.bgHi     & offset ? 1 : 0) << 1
                 | (this.shifter.bgLo     & offset ? 1 : 0) << 0;
    const spPal  = this.spritePixels[x] & 0x3F;
    const isTransSp = spPal % 4 === 0 || !this.mask.isShowSp;
    const isTransBg = bgPal % 4 === 0 || !this.mask.isShowBg;
    let address = 0x3F00;
    if (isTransBg) {
      if (!isTransSp) address = 0x3F10 + spPal;
    } else {
      if (isTransSp) {
        address = 0x3F00 + bgPal;
      } else {
        if (this.spritePixels[x] & 0x80) {
          if ((this.mask.isShowBg && this.mask.isShowSp)
              && (0 > x || x > 7 || (this.mask.isShowSpLeft8px && this.mask.isShowBgLeft8px))
              && x !== 255) this.status.isZeroSpHit = true;
        }
        address = this.spritePixels[x] & 0x40 ? 0x3F00 + bgPal : 0x3F10 + spPal;
      }
    }
    this.pixels[x + y * 256] = this.bus.readByte(address);
  }

  private clearSp(): void {
    if (!this.mask.isShowSp) return;
    this.oam2.forEach(oam => {
      oam.attr = 0xFF;
      oam.tile = 0xFF;
      oam.x = 0xFF;
      oam.y = 0xFF;
    });
  }

  private evaluateSp(): void {
    if (!this.mask.isShowSp) return;
    let count = 0;
    for (let i = 0; i < 64; i++) {
      const y = this.oam1[i * 4];
      if (this.scanLine < y || (this.scanLine >= y + this.controller.spSize)) continue;
      if (count === 8) {
        this.status.isSpOverflow = true;
        break;
      }
      const oam = this.oam2[count++];
      oam.y = y;
      oam.tile = this.oam1[i * 4 + 1];
      oam.attr = this.oam1[i * 4 + 2];
      oam.x = this.oam1[i * 4 + 3];
      oam.isZero = i === 0;
    }
  }

  private fetchSp(): void {
    if (!this.mask.isShowSp) return;
    this.spritePixels.fill(0);

    for (const sprite of this.oam2.reverse()) {
      if (sprite.y >= 0xEF) continue;

      const isBehind = !!(sprite.attr & 0x20);
      const isZero   = sprite.isZero;
      const isFlipH  = !!(sprite.attr & 0x40);
      const isFlipV  = !!(sprite.attr & 0x80);

      let addr: uint16;
      if (this.controller.spSize === SpriteSize.SIZE_8X8) {
        const base   = this.controller.spPttrAddr + (sprite.tile << 4);
        const offset = isFlipV ? (7 - this.scanLine + sprite.y) : (this.scanLine - sprite.y);
        addr = base + offset;
      } else {
        const base   = ((sprite.tile & 0x01) ? 0x1000 : 0x0000) + ((sprite.tile & 0xFE) << 4);
        const offset = isFlipV ? (15 - this.scanLine + sprite.y) : (this.scanLine - sprite.y);
        addr = base + offset % 8 + Math.floor(offset / 8) * 16;
      }

      const lo = this.bus.readByte(addr + 0x00);
      const hi = this.bus.readByte(addr + 0x08);

      for (let i = 0; i < 8; i++) {
        const b     = isFlipH ? 0x01 << i : 0x80 >> i;
        const index = (sprite.attr & 0x02 ? 1 : 0) << 3
                    | (sprite.attr & 0x01 ? 1 : 0) << 2
                    | (hi & b ? 1 : 0) << 1
                    | (lo & b ? 1 : 0);
        if (index % 4 === 0 && (this.spritePixels[sprite.x + i] & 0x3F) % 4 !== 0) continue;
        this.spritePixels[sprite.x + i] = index
                                        | (isBehind ? 0x40 : 0)
                                        | (isZero ? 0x80 : 0);
      }
    }
  }
}
