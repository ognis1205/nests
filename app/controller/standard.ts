/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Controller, Button } from '../api/controller';
import { uint8              } from '../api/types';

export class StandardController implements Controller {
  private data: number;

  private isStrobe = false;

  private offset = 0;

  public update(button: Button, isPressDown: boolean) {
    if (isPressDown) this.data |= button;
    else this.data &= ~button & 0xFF;
  }

  public write(data: uint8) {
    if (data & 0x01) {
      this.isStrobe = true;
    } else {
      this.offset = 0;
      this.isStrobe = false;
    }
  }

  public read(): uint8 {
    const data = this.isStrobe ? this.data & Button.A : this.data & (0x80 >> this.offset++);
    return data ? 1 : 0;
  }
}
