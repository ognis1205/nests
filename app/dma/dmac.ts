/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { CPU    } from '../api/cpu';
import { DMA    } from '../api/dma';
import { PPU    } from '../api/ppu';
import { uint16 } from '../api/types';

export class DMAC implements DMA {
  public cpu: CPU;

  public ppu: PPU;

  public copy(addr: uint16): void {
    const data = new Uint8Array(256);
    for (let i = 0; i < 256; i++) data[i] = (this.cpu as any).bus.readByte(addr + i);
    this.ppu.dma(data);
    (this.cpu as any).suspendCycles = (this.cpu as any).cycles & 0x01 ? 513 : 514;
  }
}
