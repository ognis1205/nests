/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Channel            } from '../api/apu';
import { uint16, uint8      } from '../api/types';
import { TRIANGLES, LENGTHS } from './tables';

export class Triangle implements Channel {
  public volume: number;

  public lengthCounter: number;

  private enabled: boolean;

  private timer: number;

  private internalTimer: number;

  private counter: number

  private isLengthCounterHalt: boolean;

  private linearCounterLoad: number;

  private isLinearCounterReload: boolean;

  private linearCounterValue: number;

  constructor() {
    this.volume                = 0;
    this.enabled               = false;
    this.lengthCounter         = 0;
    this.timer                 = 0;
    this.internalTimer         = 0;
    this.counter               = 0;
    this.isLengthCounterHalt   = false;
    this.linearCounterLoad     = 0;
    this.isLinearCounterReload = false;
    this.linearCounterValue    = 0;
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
    /* do nothing */
  }

  public countLinear(): void {
    if (this.isLinearCounterReload) this.linearCounterValue = this.linearCounterLoad;
    else if (this.linearCounterValue > 0) this.linearCounterValue--;
    if (!this.isLengthCounterHalt) this.isLinearCounterReload = false;
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
        this.isLengthCounterHalt = !!(data & 0x80);
        this.linearCounterLoad   = data & 0x7F;
        break;
      case 1:
        break;
      case 2:
        this.timer = this.timer & 0xFF00 | data;
        break;
      case 3:
        this.timer                 = this.timer & 0x00FF | (data << 8) & 0x07FF;
        this.lengthCounter         = LENGTHS[data >> 3];
        this.isLinearCounterReload = true;
        this.internalTimer         = 0;
        break;
    }
  }

  private process(): void {
    this.counter++;
    if (!this.isEnabled || this.lengthCounter === 0 || this.linearCounterValue === 0) {
      this.counter--;
      this.volume = TRIANGLES[this.counter & 0x1F];
    } else {
      this.volume = TRIANGLES[this.counter & 0x1F];
    }
  }
}
