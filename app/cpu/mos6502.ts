/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { Bus              } from '../api/bus';
import { Flag, CPU        } from '../api/cpu';
import { uint16, uint8    } from '../api/types';
import { Opcode, OPCODES  } from './opcodes';
import { MOS6502Registers } from './registers';

interface Context {
  addr:     uint16;
  data:     uint8;
  crossing: boolean;
}

export class MOS6502 implements CPU {
  public bus: Bus;

  public suspendCycles = 0;

  private deferCycles = 0;

  private readonly registers = new MOS6502Registers();

  public tick(): void {
    if (this.suspendCycles > 0) {
      this.suspendCycles--;
      return;
    }
    if (this.deferCycles === 0) this.next();
    this.deferCycles--;
  }

  private next(): void {
    const byte   = this.bus.readByte(this.registers.PC++)
    const opcode = OPCODES[byte];
    if (!opcode) throw new Error(`invalid opcode '0x${byte.toString(16)}', pc: 0x${(this.registers.PC - 1).toString(16)}`);
    if (opcode.inst === '???') return;
    const ctx = this.address(opcode);
    if (ctx.crossing) this.deferCycles += opcode.pageCycles;
    this.instruct(opcode, ctx);
    this.deferCycles += opcode.cycles;
  }

  private address(opcode: Opcode): Context {
    switch (opcode.addr) {
      case 'ABS': {
        const addr = this.bus.readWord(this.registers.PC);
        this.registers.PC += 2;
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: false,
        };
      }
      case 'ABX': {
        const base = this.bus.readWord(this.registers.PC);
        this.registers.PC += 2;
        const addr = base + this.registers.X;
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: this.isCrossing(base, addr),
        };
      }
      case 'ABY': {
        const base = this.bus.readWord(this.registers.PC);
        this.registers.PC += 2;
        const addr = base + this.registers.Y;
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: this.isCrossing(base, addr),
        };
      }
      case 'ACC': {
        return {
          addr:     NaN,
          data:     this.registers.A,
          crossing: false,
        };
      }
      case 'IMM': {
        return {
          addr:     NaN,
          data:     this.bus.readByte(this.registers.PC++),
          crossing: false,
        };
      }
      case 'IMP': {
        return {
          addr:     NaN,
          data:     NaN,
          crossing: false,
        };
      }
      case 'IND': {
        let addr = this.bus.readWord(this.registers.PC);
        this.registers.PC += 2;
        if ((addr & 0xFF) === 0xFF) addr = this.bus.readByte(addr & 0xFF00) << 8 | this.bus.readByte(addr);
        else addr = this.bus.readWord(addr);
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: false,
        };
      }
      case 'INY': {
        const oprd = this.bus.readByte(this.registers.PC++);
        const base = this.bus.readByte((oprd + 1) & 0xFF) << 8 | this.bus.readByte(oprd & 0xFF);
        const addr = base + this.registers.Y;
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: this.isCrossing(base, addr),
        };
      }
      case 'REL': {
        let offset = this.bus.readByte(this.registers.PC++);
        if (offset & 0x80) offset = offset - 0x100;
        return {
          addr:     (this.registers.PC + offset) & 0xFFFF,
          data:     NaN,
          crossing: false,
        };
      }
      case 'INX': {
        const base = this.bus.readByte(this.registers.PC++);
        const oprd = base + this.registers.X;
        const addr = this.bus.readByte((oprd + 1) & 0xFF) << 8 | this.bus.readByte(oprd & 0xFF);
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: false,
        };
      }
      case 'ZP0': {
        const addr = this.bus.readByte(this.registers.PC++);
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: false,
        };
      }
      case 'ZPX': {
        const addr = (this.bus.readByte(this.registers.PC++) + this.registers.X) & 0xFF;
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: false,
        };
      }
      case 'ZPY': {
        const addr = (this.bus.readByte(this.registers.PC++) + this.registers.Y) & 0xFF;
        return {
          addr:     addr & 0xFFFF,
          data:     NaN,
          crossing: false,
        };
      }
      default:
        throw new Error(`unsuppored addressing mode: ${opcode.addr}`);
    }
  }

    private instruct(opcode: Opcode, ctx: Context): void {
    switch (opcode.inst) {
      case 'ADC': {
        const data = this.fetch(ctx);
        const res  = data + this.registers.A + (this.check(Flag.C) ? 1 : 0);
        this.flag(Flag.C, res > 0xFF);
        this.flag(Flag.V, !!((~(this.registers.A ^ data) & (this.registers.A ^ res)) & 0x80));
        this.passthrough(res);
        this.registers.A = res & 0xFF;
        return;
      }
      case 'AND': {
        this.registers.A &= this.fetch(ctx);
        this.passthrough(this.registers.A);
        return;
      }
      case 'ASL': {
        let data = this.fetch(ctx) << 1;
        this.flag(Flag.C, !!(data & 0x100));
        data = data & 0xFF;
        this.passthrough(data);
        if (isNaN(ctx.addr)) this.registers.A = data;
        else this.bus.writeByte(ctx.addr, data);
        return;
      }
      case 'BCC': {
        if (!this.check(Flag.C)) {
          this.deferCycles++;
          if (this.isCrossing(this.registers.PC, ctx.addr)) this.deferCycles++;
          this.registers.PC = ctx.addr;
        }
        return;
      }
      case 'BCS': {
        if (this.check(Flag.C)) {
          this.deferCycles++;
          if (this.isCrossing(this.registers.PC, ctx.addr)) this.deferCycles++;
          this.registers.PC = ctx.addr;
        }
        return;
      }
      case 'BEQ': {
        if (this.check(Flag.Z)) {
          this.deferCycles++;
          if (this.isCrossing(this.registers.PC, ctx.addr)) this.deferCycles++;
          this.registers.PC = ctx.addr;
        }
        return;
      }
      case 'BIT': {
        const data = this.fetch(ctx);
        this.flag(Flag.Z, !(this.registers.A & data));
        this.flag(Flag.N, !!(data & (1 << 7)));
        this.flag(Flag.V, !!(data & (1 << 6)));
        return;
      }
      case 'BMI': {
        if (this.check(Flag.N)) {
          this.deferCycles++;
          if (this.isCrossing(this.registers.PC, ctx.addr)) this.deferCycles++;
          this.registers.PC = ctx.addr;
        }
        return;
      }
      case 'BNE': {
        if (!this.check(Flag.Z)) {
          this.deferCycles++;
          if (this.isCrossing(this.registers.PC, ctx.addr)) this.deferCycles++;
          this.registers.PC = ctx.addr;
        }
        return;
      }
      case 'BPL': {
        if (!this.check(Flag.N)) {
          this.deferCycles++;
          if (this.isCrossing(this.registers.PC, ctx.addr)) this.deferCycles++;
          this.registers.PC = ctx.addr;
        }
        return;
      }
      case 'BRK': {
        this.pushWord(this.registers.PC);
        this.pushByte(this.registers.P | Flag.B | Flag.U);
        this.flag(Flag.I, true);
        this.registers.PC = this.bus.readWord(0xFFFE);
        return;
      }
      case 'BVC': {
        if (!this.check(Flag.V)) {
          this.deferCycles++;
          if (this.isCrossing(this.registers.PC, ctx.addr)) this.deferCycles++;
          this.registers.PC = ctx.addr;
        }
        return;
      }
      case 'BVS': {
        if (this.check(Flag.V)) {
          this.deferCycles++;
          if (this.isCrossing(this.registers.PC, ctx.addr)) this.deferCycles++;
          this.registers.PC = ctx.addr;
        }
        return;
      }
      case 'CLC': {
        this.flag(Flag.C, false);
        return;
      }
      case 'CLD': {
        this.flag(Flag.D, false);
        return;
      }
      case 'CLI': {
        this.flag(Flag.I, false);
        return;
      }
      case 'CLV': {
        this.flag(Flag.V, false);
        return;
      }
      case 'CMP': {
        const data = this.fetch(ctx);
        const res = this.registers.A - data;
        this.flag(Flag.C, this.registers.A >= data);
        this.passthrough(res);
        return;
      }
      case 'CPX': {
        const data = this.fetch(ctx);
        const res = this.registers.X - data;
        this.flag(Flag.C, this.registers.X >= data);
        this.passthrough(res);
        return;
      }
      case 'CPY': {
        const data = this.fetch(ctx);
        const res = this.registers.Y - data;
        this.flag(Flag.C, this.registers.Y >= data);
        this.passthrough(res);
        return;
      }
      case 'DEC': {
        const data = (this.fetch(ctx) - 1) & 0xFF;
        this.bus.writeByte(ctx.addr, data);
        this.passthrough(data);
        return;
      }
      case 'DEX': {
        this.registers.X = (this.registers.X - 1) & 0xFF;
        this.passthrough(this.registers.X);
        return;
      }
      case 'DEY': {
        this.registers.Y = (this.registers.Y - 1) & 0xFF;
        this.passthrough(this.registers.Y);
        return;
      }
      case 'EOR': {
        this.registers.A ^= this.fetch(ctx);
        this.passthrough(this.registers.A);
        return;
      }
      case 'INC': {
        const data = (this.fetch(ctx) + 1) & 0xFF;
        this.bus.writeByte(ctx.addr, data);
        this.passthrough(data);
        return;
      }
      case 'INX': {
        this.registers.X = (this.registers.X + 1) & 0xFF;
        this.passthrough(this.registers.X);
        return;
      }
      case 'INY': {
        this.registers.Y = (this.registers.Y + 1) & 0xFF;
        this.passthrough(this.registers.Y);
        return;
      }
      case 'JMP': {
        this.registers.PC = ctx.addr;
        return;
      }
      case 'JSR': {
        this.pushWord(this.registers.PC - 1);
        this.registers.PC = ctx.addr;
        return;
      }
      case 'LDA': {
        this.registers.A = this.fetch(ctx);
        this.passthrough(this.registers.A);
        return;
      }
      case 'LDX': {
        this.registers.X = this.fetch(ctx);
        this.passthrough(this.registers.X);
        return;
      }
      case 'LDY': {
        this.registers.Y = this.fetch(ctx);
        this.passthrough(this.registers.Y);
        return;
      }
      case 'LSR': {
        let data = this.fetch(ctx);
        this.flag(Flag.C, !!(data & 0x01));
        data >>= 1;
        this.passthrough(data);
        if (isNaN(ctx.addr)) this.registers.A = data;
        else this.bus.writeByte(ctx.addr, data);
        return;
      }
      case 'NOP': {
        return;
      }
      case 'ORA': {
        this.registers.A |= this.fetch(ctx);
        this.passthrough(this.registers.A);
        return;
      }
      case 'PHA': {
        this.pushByte(this.registers.A);
        return;
      }
      case 'PHP': {
        this.pushByte(this.registers.P | Flag.B | Flag.U);
        return;
      }
      case 'PLA': {
        this.registers.A = this.popByte();
        this.passthrough(this.registers.A);
        return;
      }
      case 'PLP': {
        this.registers.P = this.popByte();
        this.flag(Flag.B, false);
        this.flag(Flag.U, true);
        return;
      }
      case 'ROL': {
        let data = this.fetch(ctx);
        const isCarry = this.check(Flag.C);
        this.flag(Flag.C, !!(data & 0x80));
        data = (data << 1 | (isCarry ? 1 : 0)) & 0xFF;
        this.passthrough(data);
        if (isNaN(ctx.addr)) this.registers.A = data;
        else this.bus.writeByte(ctx.addr, data);
        return;
      }
      case 'ROR': {
        let data = this.fetch(ctx);
        const isCarry = this.check(Flag.C);
        this.flag(Flag.C, !!(data & 1));
        data = data >> 1 | (isCarry ? 1 << 7 : 0);
        this.passthrough(data);
        if (isNaN(ctx.addr)) this.registers.A = data;
        else this.bus.writeByte(ctx.addr, data);
        return;
      }
      case 'RTI': {
        this.registers.P = this.popByte();
        this.flag(Flag.B, false);
        this.flag(Flag.U, true);
        this.registers.PC = this.popWord();
        return;
      }
      case 'RTS': {
        this.registers.PC = this.popWord() + 1;
        return;
      }
      case 'SBC': {
        const data = this.fetch(ctx);
        const res = this.registers.A - data - (this.check(Flag.C) ? 0 : 1);
        this.passthrough(res);
        this.flag(Flag.C, res >= 0);
        this.flag(Flag.V, !!((res ^ this.registers.A) & (res ^ data ^ 0xFF) & 0x0080));
        this.registers.A = res & 0xFF;
        return;
      }
      case 'SEC': {
        this.flag(Flag.C, true);
        return;
      }
      case 'SED': {
        this.flag(Flag.D, true);
        return;
      }
      case 'SEI': {
        this.flag(Flag.I, true);
        return;
      }
      case 'STA': {
        this.bus.writeByte(ctx.addr, this.registers.A);
        return;
      }
      case 'STX': {
        this.bus.writeByte(ctx.addr, this.registers.X);
        return;
      }
      case 'STY': {
        this.bus.writeByte(ctx.addr, this.registers.Y);
        return;
      }
      case 'TAX': {
        this.registers.X = this.registers.A;
        this.passthrough(this.registers.X);
        return;
      }
      case 'TAY': {
        this.registers.Y = this.registers.A;
        this.passthrough(this.registers.Y);
        return;
      }
      case 'TSX': {
        this.registers.X = this.registers.SP;
        this.passthrough(this.registers.X);
        return;
      }
      case 'TXA': {
        this.registers.A = this.registers.X;
        this.passthrough(this.registers.A);
        return;
      }
      case 'TXS': {
        this.registers.SP = this.registers.X;
        return;
      }
      case 'TYA': {
        this.registers.A = this.registers.Y;
        this.passthrough(this.registers.A);
        return;
      }
      default:
        throw new Error(`unsuppored instruction: ${opcode.inst}`);
    }
  }

  public rst(): void {
    this.registers.A  = 0x00;
    this.registers.X  = 0x00;
    this.registers.Y  = 0x00;
    this.registers.P  = 0x00;
    this.registers.SP = 0xFD;
    this.registers.PC = this.bus.readWord(0xFFFC);
    this.deferCycles  = 8;
  }

  public irq(): void {
    if (this.check(Flag.I)) return;
    this.pushWord(this.registers.PC);
    this.pushByte((this.registers.P | Flag.U) & ~Flag.B);
    this.flag(Flag.I, true);
    this.registers.PC = this.bus.readWord(0xFFFE);
    this.deferCycles += 7;
  }

  public nmi(): void {
    this.pushWord(this.registers.PC);
    this.pushByte((this.registers.P | Flag.U) & ~Flag.B);
    this.flag(Flag.I, true);
    this.registers.PC = this.bus.readWord(0xFFFA);
    this.deferCycles += 7;
  }

  private fetch(ctx: Context): uint8 {
    if (!isNaN(ctx.data)) return ctx.data;
    else return this.bus.readByte(ctx.addr);
  }

  private flag(flag: Flag, expr: boolean): void {
    if (expr) this.registers.P |= flag;
    else this.registers.P &= ~flag;
  }

  private check(flag: Flag): boolean {
    return !!(this.registers.P & flag);
  }

  private passthrough(data: uint8) {
    this.flag(Flag.Z, (data & 0xFF) === 0);
    this.flag(Flag.N, !!(data & 0x80));
  }

  private pushWord(data: uint16): void {
    this.pushByte(data >> 8);
    this.pushByte(data);
  }

  private pushByte(data: uint8): void {
    this.bus.writeByte(0x100 + this.registers.SP, data);
    this.registers.SP = (this.registers.SP - 1) & 0xFF;
  }

  private popWord(): uint16 {
    return this.popByte() | this.popByte() << 8;
  }

  private popByte(): uint8 {
    this.registers.SP = (this.registers.SP + 1) & 0xFF;
    return this.bus.readByte(0x100 + this.registers.SP);
  }

  private isCrossing(lhs: uint16, rhs: uint16): boolean {
    return (lhs & 0xFF00) !== (rhs & 0xFF00);
  }
}
