/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { APU, DMC, Channel } from '../api/apu';
import { Bus               } from '../api/bus';
import { Interrupt         } from '../api/interrupt';
import { uint16, uint8     } from '../api/types';
import { RP2C02DMC         } from './dmc';
import { Noise             } from './noise';
import { Pulse             } from './pulse';
import { Triangle          } from './triangle';

export class RP2C02 implements APU {
  public interruptLine: Interrupt;

  private pulse1: Channel;

  private pulse2: Channel;

  private noise: Channel;

  private triangle: Channel;

  private dmc: DMC;

  private isFrameInterrupted: boolean;

  private mode: number;

  private isIRQEnabled: boolean;

  private clocks: number;

  private sampleCounter: number;

  private frameCounter: number;

  constructor(private readonly sampleRate = 48000,
              private onSample: (volume: number) => void) {
    this.pulse1             = new Pulse(1);
    this.pulse2             = new Pulse(2);
    this.noise              = new Noise();
    this.triangle           = new Triangle();
    this.dmc                = new RP2C02DMC();
    this.isFrameInterrupted = false;
    this.mode               = 0;
    this.isIRQEnabled       = true;
    this.clocks             = 0;
    this.sampleCounter      = 0;
    this.frameCounter       = 0;
  }

  public set cpuBus(cpuBus: Bus) {
    this.dmc.cpuBus = cpuBus;
  }

  public set interrupt(interrupt: Interrupt) {
    this.interruptLine = interrupt;
    this.dmc.interrupt = interrupt;
  }

  public tick(): void {
    this.clocks++;
    if (this.clocks & 0x01) {
      this.pulse1.tick();
      this.pulse2.tick();
      this.noise.tick();
    }
    this.dmc.tick();
    this.triangle.tick();

    const count = Math.floor(this.clocks / (1789773 / this.sampleRate));
    if (count !== this.sampleCounter) {
      this.sampleCounter = count;
      this.sample();
    }

    const frameCount = Math.floor(this.clocks / (1789773/ 240));
    if (frameCount !== this.frameCounter) {
      this.frameCounter = frameCount;
      this.countFrame();
    }
  }

  public cpuRead(addr: uint16): uint8 {
    if (addr === 0x4015) {
      const data = (this.pulse1.lengthCounter > 0   ? 0x01 : 0) |
                   (this.pulse2.lengthCounter > 0   ? 0x02 : 0) |
                   (this.triangle.lengthCounter > 0 ? 0x04 : 0) |
                   (this.noise.lengthCounter > 0    ? 0x08 : 0) |
                   (this.dmc.bytesRemaining > 0     ? 0x10 : 0) |
                   (this.isFrameInterrupted         ? 0x40 : 0) |
                   (this.dmc.isInterrupted          ? 0x80 : 0);
      this.isFrameInterrupted = false;
      return data;
    } else {
      return 0x00;
    }
  }

  public cpuWrite(addr: uint16, data: uint8): void {
    switch (addr) {
      case 0x4000:
      case 0x4001:
      case 0x4002:
      case 0x4003:
        this.pulse1.cpuWrite(addr - 0x4000, data);
        break;
      case 0x4004:
      case 0x4005:
      case 0x4006:
      case 0x4007:
        this.pulse2.cpuWrite(addr - 0x4004, data);
        break;
      case 0x4008:
      case 0x4009:
      case 0x400A:
      case 0x400B:
        this.triangle.cpuWrite(addr - 0x4008, data);
        break;
      case 0x400C:
      case 0x400D:
      case 0x400E:
      case 0x400F:
        this.noise.cpuWrite(addr - 0x400C, data);
        break;
      case 0x4010:
      case 0x4011:
      case 0x4012:
      case 0x4013:
        this.dmc.cpuWrite(addr - 0x4010, data);
        break;
      case 0x4015:
        this.pulse1.isEnabled   = !!(data & 0x01);
        this.pulse2.isEnabled   = !!(data & 0x02);
        this.triangle.isEnabled = !!(data & 0x04);
        this.noise.isEnabled    = !!(data & 0x08);
        this.dmc.isEnabled      = !!(data & 0x10);
        this.dmc.isInterrupted  = false;
        break;
      case 0x4017:
        this.frameCounter = 0;
        this.mode         = data >> 7;
        this.isIRQEnabled = !(data & 0x40);
    }
  }

  private sample(): void {
    const pulse = 0.00752 * (this.pulse1.volume + this.pulse2.volume);
    const tnd   = 0.00851 * this.triangle.volume + 0.00494 * this.noise.volume + 0.00335 * this.dmc.volume;
    this.onSample(pulse + tnd);
  }

  private countFrame(): void {
    if (this.mode === 0) {
      switch (this.frameCounter % 4) {
        case 0:
          this.envelopeAndCountLinear();
          break;
        case 1:
          this.countLengthAndSweep();
          this.envelopeAndCountLinear();
          break;
        case 2:
          this.envelopeAndCountLinear();
          break;
        case 3:
          this.irq();
          this.countLengthAndSweep();
          this.envelopeAndCountLinear();
          break;
      }
    } else {
      switch (this.frameCounter % 5) {
        case 0:
          this.envelopeAndCountLinear();
          break;
        case 1:
          this.countLengthAndSweep();
          this.envelopeAndCountLinear();
          break;
        case 2:
          this.envelopeAndCountLinear();
          break;
        case 3:
          break;
        case 4:
          this.countLengthAndSweep();
          this.envelopeAndCountLinear();
          break;
      }
    }
  }

  private envelopeAndCountLinear(): void {
    this.pulse1.envelope();
    this.pulse2.envelope();
    this.noise.envelope();
    this.triangle.countLinear();
  }

  private countLengthAndSweep(): void {
    this.pulse1.countLength();
    this.pulse2.countLength();
    this.triangle.countLength();
    this.noise.countLength();
    this.pulse1.sweep();
    this.pulse2.sweep();
  }

  private irq(): void {
    if (!this.isIRQEnabled) return;
    this.isFrameInterrupted = true;
    this.interruptLine.irq();
  }
}
