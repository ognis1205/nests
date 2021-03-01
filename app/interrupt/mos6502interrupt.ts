/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { CPU       } from '../api/cpu';
import { Interrupt } from '../api/interrupt';

export class MOS6502Interrupt implements Interrupt {
  public cpu: CPU;

  public irq(): void {
    this.cpu.irq();
  }

  public nmi(): void {
    this.cpu.nmi();
  }
}
