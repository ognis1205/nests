/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Channel          } from '../api/apu';
import { uint16, uint8    } from '../api/types';
import { PERIODS, LENGTHS } from './tables';

export class Noise implements Channel {
  public volume: number;

  public lengthCounter: number;

  private enabled: boolean;

  private internalTimer: number;

  private isConstant: boolean;

  private envelopeValue: number;

  private envelopeVolume: number;

  private envelopeCounter: number;

  private isLengthCounterHalt: boolean;

  private isLoopNoise: boolean;

  private noisePeriod: number;

  constructor() {
    this.volume              = 0;
    this.enabled             = false;
    this.lengthCounter       = 0;
    this.internalTimer       = 0;
    this.isConstant          = false;
    this.envelopeValue       = 0;
    this.envelopeVolume      = 0;
    this.envelopeCounter     = 0;
    this.isLengthCounterHalt = false;
    this.isLoopNoise         = false;
    this.noisePeriod         = 0;
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
      this.internalTimer = this.noisePeriod;
      this.process();
    } else {
      this.internalTimer--;
    }
  }

  public envelope(): void {
    if (this.isConstant) return;
    if (this.envelopeCounter % (this.envelopeValue + 1) === 0) {
      if (this.envelopeVolume === 0) this.envelopeVolume = this.isLengthCounterHalt ? 15 : 0;
      else this.envelopeVolume--;
    }
    this.envelopeCounter++;
  }

  public countLinear(): void {
    /* do nothing */
  }

  public countLength(): void {
    if (!this.isLengthCounterHalt && this.lengthCounter > 0) this.lengthCounter--;
  }

  public sweep(): void {
    /* do nothing */
  }

  public cpuWrite(addr: uint16, data: uint8): void {
    switch (addr) {
      case 0:
        this.isLengthCounterHalt = !!(data & 0x20);
        this.isConstant          = !!(data & 0x10);
        this.envelopeValue       = data & 0x0F;
        this.envelopeVolume      = 15;
        this.envelopeCounter     = 0;
        break;
      case 1:
        break;
      case 2:
        this.isLoopNoise   = !!(data & 0x80);
        this.noisePeriod   = PERIODS[data & 0x0F];
        this.internalTimer = 0;
        break;
      case 3:
        this.lengthCounter = LENGTHS[data >> 3];
        break;
    }
  }

  private process(): void {
    if (!this.isEnabled || this.lengthCounter === 0) this.volume = 0;
    else if (this.isConstant) this.volume = Math.floor(Math.random() * this.envelopeValue);
    else this.volume = Math.floor(Math.random() * this.envelopeVolume);
  }
}
