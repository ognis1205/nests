/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Channel         } from '../api/apu';
import { uint16, uint8   } from '../api/types';
import { DUTIES, LENGTHS } from './tables';

export class Pulse implements Channel {
  public volume: number;

  public lengthCounter: number;

  private enabled: boolean;

  private timer: number;

  private internalTimer: number;

  private counter: number

  private duty: number;

  private isConstant: boolean;

  private envelopeValue: number;

  private envelopeVolume: number;

  private envelopeCounter: number;

  private isEnvelopeLoop: boolean;

  private isSweepEnabled: boolean;

  private sweepPeriod: number;

  private isSweepNegated: boolean;

  private sweepShift: number;

  private sweepCounter: number;

  constructor(private readonly channel: number) {
    this.volume          = 0;
    this.enabled         = false;
    this.lengthCounter   = 0;
    this.timer           = 0;
    this.internalTimer   = 0;
    this.counter         = 0;
    this.duty            = 0;
    this.isConstant      = false;
    this.envelopeValue   = 0;
    this.envelopeVolume  = 0;
    this.envelopeCounter = 0;
    this.isEnvelopeLoop  = false;
    this.isSweepEnabled  = false;
    this.sweepPeriod     = 0;
    this.isSweepNegated  = false;
    this.sweepShift      = 0;
    this.sweepCounter    = 0;
  }

  public get isEnabled(): boolean {
    return this.enabled;
  }

  public set isEnabled(isEnabled: boolean) {
    this.enabled = isEnabled;
    if (!isEnabled) this.lengthCounter = 0;
  }

  public tick(): void {
    if (!this.isEnabled) return;
    if (this.internalTimer === 0) {
      this.internalTimer = this.timer;
      this.process();
    } else {
      this.internalTimer--;
    }
  }

  public envelope(): void {
    if (this.isConstant) return;
    if (this.envelopeCounter % (this.envelopeValue + 1) === 0) {
      if (this.envelopeVolume === 0) this.envelopeVolume = this.isEnvelopeLoop ? 15 : 0;
      else this.envelopeVolume--;
    }
    this.envelopeCounter++;
  }

  public countLinear(): void {
    /* do nothing */
  }

  public countLength(): void {
    if (!this.isEnvelopeLoop && this.lengthCounter > 0) this.lengthCounter--;
  }

  public sweep(): void {
    if (!this.isSweepEnabled) return;
    if (this.sweepCounter % (this.sweepPeriod + 1) === 0) {
      const changeAmount = this.isSweepNegated ? -(this.timer >> this.sweepShift) : this.timer >> this.sweepShift;
      this.timer += changeAmount;
      if (this.channel === 1 && changeAmount <= 0) this.timer--;
    }
    this.sweepCounter++;
  }

  public cpuWrite(addr: uint16, data: uint8): void {
    switch (addr) {
      case 0:
        this.duty            = data >> 6;
        this.isEnvelopeLoop  = !!(data & 0x20);
        this.isConstant      = !!(data & 0x10);
        this.envelopeValue   = data & 0x0F;
        this.envelopeVolume  = 15;
        this.envelopeCounter = 0;
        break;
      case 1:
        this.isSweepEnabled = !!(data & 0x80);
        this.sweepPeriod    = data >> 4 & 0x07;
        this.isSweepNegated = !!(data & 0x08);
        this.sweepShift     = data & 0x07;
        this.sweepCounter   = 0;
        break;
      case 2:
        this.timer = this.timer & 0xFF00 | data;
        break;
      case 3:
        this.timer         = this.timer & 0x00FF | (data << 8) & 0x07FF;
        this.lengthCounter = LENGTHS[data >> 3];
        this.internalTimer = 0;
        break;
    }
  }

  private process(): void {
    this.counter++;
    if (!this.isEnabled || this.lengthCounter === 0 || this.timer < 8 || this.timer > 0x7FF) this.volume = 0;
    else if (this.isConstant) this.volume = this.envelopeValue * DUTIES[this.duty][this.counter & 0x07];
    else this.volume = this.envelopeVolume * DUTIES[this.duty][this.counter & 0x07];
  }
}
