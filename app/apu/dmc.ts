/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { DMC           } from '../api/apu';
import { Bus           } from '../api/bus';
import { Interrupt     } from '../api/interrupt';
import { uint16, uint8 } from '../api/types';
import { DMCS          } from './tables';

export class RP2C02DMC implements DMC {
  public volume: number;

  public cpuBus: Bus;

  public bytesRemaining: number;

  public interrupt: Interrupt;

  public isInterrupted: boolean;

  public isEnabled: boolean;

  private isMuted: boolean;

  private isIRQEnabled: boolean;

  private isLoopEnabled: boolean;

  private frequency: number;

  private loadCounter: number;

  private sampleAddr: uint16;

  private sampleLength: number;

  private clocks: number;

  private sampleBuffer: uint8;

  private addr: uint16;

  private bitsRemaining: number;

  constructor() {
    this.volume         = 0;
    this.isEnabled        = false;
    this.bytesRemaining = 0;
    this.isInterrupted  = false;
    this.isMuted        = true;
    this.isIRQEnabled   = false;
    this.isLoopEnabled  = false;
    this.frequency      = 0;
    this.loadCounter    = 0;
    this.sampleAddr     = 0x0000;
    this.sampleLength   = 0;
    this.clocks         = 0;
    this.sampleBuffer   = 0x00;
    this.addr           = 0;
    this.bitsRemaining  = 0;
  }

  public tick(): void {
    if (!this.isEnabled) return;
    if (this.clocks % (DMCS[this.frequency] + 1) === 0) this.outputUnit();
    this.clocks++;
  }

  public cpuWrite(addr: uint16, data: uint8) {
    switch (addr) {
      case 0:
        this.isIRQEnabled  = !!(data & 0x80);
        this.isLoopEnabled = !!(data & 0x40);
        this.frequency     = data & 0x0F;
        this.clocks        = 0;
        if (!this.isIRQEnabled) this.isInterrupted = false;
        break;
      case 1:
        this.loadCounter = data & 0x7F;
        this.restart();
        break;
      case 2:
        this.sampleAddr = 0xC000 + data * 64;
        this.restart();
        break;
      case 3:
        this.sampleLength = data * 16 + 1;
        this.restart();
        break;
    }
  }

  private outputUnit(): void {
    if (this.bitsRemaining <= 0) {
      if (this.isMuted) return;
      this.memoryReader();
      this.bitsRemaining = 8;
    }
    if (this.sampleBuffer & 0x01) this.volume = this.volume > 125 ? 127 : this.volume + 2;
    else this.volume = this.volume < 2 ? 0 : this.volume - 2;
    this.sampleBuffer >>= 1;
    this.bitsRemaining--;
  }

  private memoryReader(): void {
    if (this.bytesRemaining <= 0 || this.bitsRemaining > 0) return;
    this.sampleBuffer = this.cpuBus.readByte(this.addr);
    this.addr = this.addr >= 0xFFFF ? 0x8000 : this.addr + 1;
    this.bytesRemaining--;
    if (this.bytesRemaining <= 0) {
      if (this.isLoopEnabled) {
        this.restart();
      } else {
        this.isMuted = true;
        if (this.isIRQEnabled) {
          this.isInterrupted = true;
          this.interrupt.irq();
        }
      }
    }
  }

  private restart(): void {
    this.addr           = this.sampleAddr;
    this.bytesRemaining = this.sampleLength;
    this.isMuted        = false;
    this.volume         = this.loadCounter;
  }
}
