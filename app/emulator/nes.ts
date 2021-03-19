/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Bus                } from '../api/bus';
import { Controller         } from '../api/controller';
import { CPU                } from '../api/cpu';
import { DMA                } from '../api/dma';
import { Emulator, Options  } from '../api/emulator';
import { Interrupt          } from '../api/interrupt';
import { PPU                } from '../api/ppu';
import { RAM                } from '../api/ram';
import { ROM                } from '../api/rom';
import { PPUBus             } from '../bus/ppubus';
import { CPUBus             } from '../bus/cpubus';
import { StandardController } from '../controller/standard';
import { MOS6502            } from '../cpu/mos6502';
import { DMAC               } from '../dma/dmac';
import { DRAM               } from '../ram/dram';
import { MOS6502Interrupt   } from '../interrupt/mos6502interrupt';
import { RP2A03             } from '../ppu/rp2a03';
import { INES               } from '../rom/ines'
import { colour             } from './palettes';

export class NES implements Emulator {
  private rom: ROM;

  public readonly player1: Controller;

  public readonly player2: Controller;

  public readonly sram: Uint8Array;

  private readonly cpu: CPU;

  private readonly ppu: PPU;

  private readonly dma: DMA;

  private readonly ppuRam: RAM;

  private readonly cpuRam: RAM;

  private readonly cpuBus: Bus;

  private readonly ppuBus: Bus;

  private readonly bgPalette: RAM;

  private readonly spPalette: RAM;

  private readonly interrupt: Interrupt;


  constructor(ines: Uint8Array, options?: Options) {
    options = this.parse(options);
    this.sram = new Uint8Array(8192);
    this.sram.set(options.sramLoad);
    const player1   = new StandardController();
    const player2   = new StandardController();
    const cpu       = new MOS6502();
    const ppu       = new RP2A03(pixels => options.onFrame(this.palette(pixels)));
    const dma       = new DMAC();
    const rom       = new INES(ines, this.sram);
    const ppuRam    = new DRAM(1024 * 2, 0x2000);
    const cpuRam    = new DRAM(1024 * 2, 0);
    const cpuBus    = new CPUBus();
    const ppuBus    = new PPUBus();
    const bgPalette = new DRAM(16, 0x3F00);
    const spPalette = new DRAM(16, 0x3F10);
    const interrupt = new MOS6502Interrupt();
    cpu.bus = cpuBus;
    ppu.interrupt = interrupt;
    ppu.bus = ppuBus;
    ppu.mapper = rom.mapper;
    dma.cpu = cpu;
    dma.ppu = ppu;
    interrupt.cpu = cpu;
    ppuBus.rom = rom;
    ppuBus.ram = ppuRam;
    ppuBus.bgPalette = bgPalette;
    ppuBus.spPalette = spPalette;
    cpuBus.rom = rom;
    cpuBus.ram = cpuRam;
    cpuBus.ppu = ppu;
    cpuBus.dma = dma;
    cpuBus.player1 = player1;
    cpuBus.player2 = player2;
    rom.mapper.interrupt = interrupt;
    this.cpu = cpu;
    this.ppu = ppu;
    this.rom = rom;
    this.ppuRam = ppuRam;
    this.cpuRam = cpuRam;
    this.cpuBus = cpuBus;
    this.ppuBus = ppuBus;
    this.bgPalette = bgPalette;
    this.spPalette = spPalette;
    this.dma = dma;
    this.player1 = player1;
    this.player2 = player2;
    this.cpu.rst();
  }

  public tick(): void {
    this.cpu.tick();
    this.ppu.tick();
    this.ppu.tick();
    this.ppu.tick();
  }

  public frame(): void {
    const frame = (this.ppu as any).frame;
    while (true) {
      this.tick();
      const newFrame = (this.ppu as any).frame;
      if (newFrame !== frame) break;
    }
  }

  private palette(pixels: Uint8Array): Uint32Array {
    const ret = new Uint32Array(pixels.length);
    let ptr = 0;
    for (const p of pixels) ret[ptr++] = colour(p);
    return ret;
  }

  private parse(options?: Options): Options {
    options = options || {} as any;
    return {
      sampleRate: options.sampleRate || 48000,
      onSample:   options.onSample   || (() => { /* do nothing */ }),
      onFrame:    options.onFrame    || (() => { /* do nothing */ }),
      sramLoad:   options.sramLoad   || new Uint8Array(8192),
    };
  }
}
