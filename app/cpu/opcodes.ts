/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
export interface Opcode {
  inst:       string;
  addr:       string;
  bytes:      number;
  cycles:     number;
  pageCycles: number;
}

export const OPCODES: ReadonlyArray<Opcode> = [
  { inst: 'BRK', addr: 'ZP0', bytes: 2, cycles: 7, pageCycles: 0 }, // 0x00
  { inst: 'ORA', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x01
  undefined,                                                        // 0x02
  { inst: 'SLO', addr: 'INX', bytes: 2, cycles: 8, pageCycles: 0 }, // 0x03
  { inst: 'NOP', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x04
  { inst: 'ORA', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x05
  { inst: 'ASL', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0x06
  { inst: 'SLO', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0x07
  { inst: 'PHP', addr: 'IMP', bytes: 1, cycles: 3, pageCycles: 0 }, // 0x08
  { inst: 'ORA', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0x09
  { inst: 'ASL', addr: 'ACC', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x0A
  undefined,                                                        // 0x0B
  { inst: 'NOP', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x0C
  { inst: 'ORA', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x0D
  { inst: 'ASL', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x0E
  { inst: 'SLO', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x0F
  { inst: 'BPL', addr: 'REL', bytes: 2, cycles: 2, pageCycles: 1 }, // 0x10
  { inst: 'ORA', addr: 'INY', bytes: 2, cycles: 5, pageCycles: 1 }, // 0x11
  undefined,                                                        // 0x12
  { inst: 'SLO', addr: 'INY', bytes: 2, cycles: 8, pageCycles: 0 }, // 0x13
  { inst: 'NOP', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x14
  { inst: 'ORA', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x15
  { inst: 'ASL', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x16
  { inst: 'SLO', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x17
  { inst: 'CLC', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x18
  { inst: 'ORA', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x19
  { inst: 'NOP', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x1A
  { inst: 'SLO', addr: 'ABY', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x1B
  { inst: 'NOP', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x1C
  { inst: 'ORA', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x1D
  { inst: 'ASL', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x1E
  { inst: 'SLO', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x1F
  { inst: 'JSR', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x20
  { inst: 'AND', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x21
  undefined,                                                        // 0x22
  { inst: 'RLA', addr: 'INX', bytes: 2, cycles: 8, pageCycles: 0 }, // 0x23
  { inst: 'BIT', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x24
  { inst: 'AND', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x25
  { inst: 'ROL', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0x26
  { inst: 'RLA', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0x27
  { inst: 'PLP', addr: 'IMP', bytes: 1, cycles: 4, pageCycles: 0 }, // 0x28
  { inst: 'AND', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0x29
  { inst: 'ROL', addr: 'ACC', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x2A
  undefined,                                                        // 0x2B
  { inst: 'BIT', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x2C
  { inst: 'AND', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x2D
  { inst: 'ROL', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x2E
  { inst: 'RLA', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x2F
  { inst: 'BMI', addr: 'REL', bytes: 2, cycles: 2, pageCycles: 1 }, // 0x30
  { inst: 'AND', addr: 'INY', bytes: 2, cycles: 5, pageCycles: 1 }, // 0x31
  undefined,                                                        // 0x32
  { inst: 'RLA', addr: 'INY', bytes: 2, cycles: 8, pageCycles: 0 }, // 0x33
  { inst: 'NOP', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x34
  { inst: 'AND', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x35
  { inst: 'ROL', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x36
  { inst: 'RLA', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x37
  { inst: 'SEC', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x38
  { inst: 'AND', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x39
  { inst: 'NOP', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x3A
  { inst: 'RLA', addr: 'ABY', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x3B
  { inst: 'NOP', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x3C
  { inst: 'AND', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x3D
  { inst: 'ROL', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x3E
  { inst: 'RLA', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x3F
  { inst: 'RTI', addr: 'IMP', bytes: 1, cycles: 6, pageCycles: 0 }, // 0x40
  { inst: 'EOR', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x41
  undefined,                                                        // 0x42
  { inst: 'SRE', addr: 'INX', bytes: 2, cycles: 8, pageCycles: 0 }, // 0x43
  { inst: 'NOP', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x44
  { inst: 'EOR', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x45
  { inst: 'LSR', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0x46
  { inst: 'SRE', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0x47
  { inst: 'PHA', addr: 'IMP', bytes: 1, cycles: 3, pageCycles: 0 }, // 0x48
  { inst: 'EOR', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0x49
  { inst: 'LSR', addr: 'ACC', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x4A
  undefined,                                                        // 0x4B
  { inst: 'JMP', addr: 'ABS', bytes: 3, cycles: 3, pageCycles: 0 }, // 0x4C
  { inst: 'EOR', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x4D
  { inst: 'LSR', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x4E
  { inst: 'SRE', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x4F
  { inst: 'BVC', addr: 'REL', bytes: 2, cycles: 2, pageCycles: 1 }, // 0x50
  { inst: 'EOR', addr: 'INY', bytes: 2, cycles: 5, pageCycles: 1 }, // 0x51
  undefined,                                                        // 0x52
  { inst: 'SRE', addr: 'INY', bytes: 2, cycles: 8, pageCycles: 0 }, // 0x53
  { inst: 'NOP', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x54
  { inst: 'EOR', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x55
  { inst: 'LSR', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x56
  { inst: 'SRE', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x57
  { inst: 'CLI', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x58
  { inst: 'EOR', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x59
  { inst: 'NOP', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x5A
  { inst: 'SRE', addr: 'ABY', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x5B
  { inst: 'NOP', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x5C
  { inst: 'EOR', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x5D
  { inst: 'LSR', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x5E
  { inst: 'SRE', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x5F
  { inst: 'RTS', addr: 'IMP', bytes: 1, cycles: 6, pageCycles: 0 }, // 0x60
  { inst: 'ADC', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x61
  undefined,                                                        // 0x62
  { inst: 'RRA', addr: 'INX', bytes: 2, cycles: 8, pageCycles: 0 }, // 0x63
  { inst: 'NOP', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x64
  { inst: 'ADC', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x65
  { inst: 'ROR', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0x66
  { inst: 'RRA', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0x67
  { inst: 'PLA', addr: 'IMP', bytes: 1, cycles: 4, pageCycles: 0 }, // 0x68
  { inst: 'ADC', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0x69
  { inst: 'ROR', addr: 'ACC', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x6A
  undefined,                                                        // 0x6B
  { inst: 'JMP', addr: 'IND', bytes: 3, cycles: 5, pageCycles: 0 }, // 0x6C
  { inst: 'ADC', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x6D
  { inst: 'ROR', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x6E
  { inst: 'RRA', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0x6F
  { inst: 'BVS', addr: 'REL', bytes: 2, cycles: 2, pageCycles: 1 }, // 0x70
  { inst: 'ADC', addr: 'INY', bytes: 2, cycles: 5, pageCycles: 1 }, // 0x71
  undefined,                                                        // 0x72
  { inst: 'RRA', addr: 'INY', bytes: 2, cycles: 8, pageCycles: 0 }, // 0x73
  { inst: 'NOP', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x74
  { inst: 'ADC', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x75
  { inst: 'ROR', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x76
  { inst: 'RRA', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x77
  { inst: 'SEI', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x78
  { inst: 'ADC', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x79
  { inst: 'NOP', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x7A
  { inst: 'RRA', addr: 'ABY', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x7B
  { inst: 'NOP', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x7C
  { inst: 'ADC', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0x7D
  { inst: 'ROR', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x7E
  { inst: 'RRA', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0x7F
  { inst: 'NOP', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0x80
  { inst: 'STA', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x81
  { inst: 'NOP', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0x82
  { inst: 'SAX', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x83
  { inst: 'STY', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x84
  { inst: 'STA', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x85
  { inst: 'STX', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x86
  { inst: 'SAX', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0x87
  { inst: 'DEY', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x88
  undefined,                                                        // 0x89
  { inst: 'TXA', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x8A
  undefined,                                                        // 0x8B
  { inst: 'STY', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x8C
  { inst: 'STA', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x8D
  { inst: 'STX', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x8E
  { inst: 'SAX', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0x8F
  { inst: 'BCC', addr: 'REL', bytes: 2, cycles: 2, pageCycles: 1 }, // 0x90
  { inst: 'STA', addr: 'INY', bytes: 2, cycles: 6, pageCycles: 0 }, // 0x91
  undefined,                                                        // 0x92
  undefined,                                                        // 0x93
  { inst: 'STY', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x94
  { inst: 'STA', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x95
  { inst: 'STX', addr: 'ZPY', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x96
  { inst: 'SAX', addr: 'ZPY', bytes: 2, cycles: 4, pageCycles: 0 }, // 0x97
  { inst: 'TYA', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x98
  { inst: 'STA', addr: 'ABY', bytes: 3, cycles: 5, pageCycles: 0 }, // 0x99
  { inst: 'TXS', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0x9A
  undefined,                                                        // 0x9B
  undefined,                                                        // 0x9C
  { inst: 'STA', addr: 'ABX', bytes: 3, cycles: 5, pageCycles: 0 }, // 0x9D
  undefined,                                                        // 0x9E
  undefined,                                                        // 0x9F
  { inst: 'LDY', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0xA0
  { inst: 'LDA', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0xA1
  { inst: 'LDX', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0xA2
  { inst: 'LAX', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0xA3
  { inst: 'LDY', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0xA4
  { inst: 'LDA', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0xA5
  { inst: 'LDX', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0xA6
  { inst: 'LAX', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0xA7
  { inst: 'TAY', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xA8
  { inst: 'LDA', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0xA9
  { inst: 'TAX', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xAA
  undefined,                                                        // 0xAB
  { inst: 'LDY', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0xAC
  { inst: 'LDA', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0xAD
  { inst: 'LDX', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0xAE
  { inst: 'LAX', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0xAF
  { inst: 'BCS', addr: 'REL', bytes: 2, cycles: 2, pageCycles: 1 }, // 0xB0
  { inst: 'LDA', addr: 'INY', bytes: 2, cycles: 5, pageCycles: 1 }, // 0xB1
  undefined,                                                        // 0xB2
  { inst: 'LAX', addr: 'INY', bytes: 2, cycles: 5, pageCycles: 1 }, // 0xB3
  { inst: 'LDY', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0xB4
  { inst: 'LDA', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0xB5
  { inst: 'LDX', addr: 'ZPY', bytes: 2, cycles: 4, pageCycles: 0 }, // 0xB6
  { inst: 'LAX', addr: 'ZPY', bytes: 2, cycles: 4, pageCycles: 0 }, // 0xB7
  { inst: 'CLV', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xB8
  { inst: 'LDA', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xB9
  { inst: 'TSX', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xBA
  undefined,                                                        // 0xBB
  { inst: 'LDY', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xBC
  { inst: 'LDA', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xBD
  { inst: 'LDX', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xBE
  { inst: 'LAX', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xBF
  { inst: 'CPY', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0xC0
  { inst: 'CMP', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0xC1
  undefined,                                                        // 0xC2
  { inst: 'DCP', addr: 'INX', bytes: 2, cycles: 8, pageCycles: 0 }, // 0xC3
  { inst: 'CPY', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0xC4
  { inst: 'CMP', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0xC5
  { inst: 'DEC', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0xC6
  { inst: 'DCP', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0xC7
  { inst: 'INY', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xC8
  { inst: 'CMP', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0xC9
  { inst: 'DEX', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xCA
  undefined,                                                        // 0xCB
  { inst: 'CPY', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0xCC
  { inst: 'CMP', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0xCD
  { inst: 'DEC', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0xCE
  { inst: 'DCP', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0xCF
  { inst: 'BNE', addr: 'REL', bytes: 2, cycles: 2, pageCycles: 1 }, // 0xD0
  { inst: 'CMP', addr: 'INY', bytes: 2, cycles: 5, pageCycles: 1 }, // 0xD1
  undefined,                                                        // 0xD2
  { inst: 'DCP', addr: 'INY', bytes: 2, cycles: 8, pageCycles: 0 }, // 0xD3
  { inst: 'NOP', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0xD4
  { inst: 'CMP', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0xD5
  { inst: 'DEC', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0xD6
  { inst: 'DCP', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0xD7
  { inst: 'CLD', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xD8
  { inst: 'CMP', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xD9
  { inst: 'NOP', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xDA
  { inst: 'DCP', addr: 'ABY', bytes: 3, cycles: 7, pageCycles: 0 }, // 0xDB
  { inst: 'NOP', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xDC
  { inst: 'CMP', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xDD
  { inst: 'DEC', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0xDE
  { inst: 'DCP', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0xDF
  { inst: 'CPX', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0xE0
  { inst: 'SBC', addr: 'INX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0xE1
  undefined,                                                        // 0xE2
  { inst: 'ISC', addr: 'INX', bytes: 2, cycles: 8, pageCycles: 0 }, // 0xE3
  { inst: 'CPX', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0xE4
  { inst: 'SBC', addr: 'ZP0', bytes: 2, cycles: 3, pageCycles: 0 }, // 0xE5
  { inst: 'INC', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0xE6
  { inst: 'ISC', addr: 'ZP0', bytes: 2, cycles: 5, pageCycles: 0 }, // 0xE7
  { inst: 'INX', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xE8
  { inst: 'SBC', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0xE9
  { inst: 'NOP', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xEA
  { inst: 'SBC', addr: 'IMM', bytes: 2, cycles: 2, pageCycles: 0 }, // 0xEB
  { inst: 'CPX', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0xEC
  { inst: 'SBC', addr: 'ABS', bytes: 3, cycles: 4, pageCycles: 0 }, // 0xED
  { inst: 'INC', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0xEE
  { inst: 'ISC', addr: 'ABS', bytes: 3, cycles: 6, pageCycles: 0 }, // 0xEF
  { inst: 'BEQ', addr: 'REL', bytes: 2, cycles: 2, pageCycles: 1 }, // 0xF0
  { inst: 'SBC', addr: 'INY', bytes: 2, cycles: 5, pageCycles: 1 }, // 0xF1
  undefined,                                                        // 0xF2
  { inst: 'ISC', addr: 'INY', bytes: 2, cycles: 8, pageCycles: 0 }, // 0xF3
  { inst: 'NOP', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0xF4
  { inst: 'SBC', addr: 'ZPX', bytes: 2, cycles: 4, pageCycles: 0 }, // 0xF5
  { inst: 'INC', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0xF6
  { inst: 'ISC', addr: 'ZPX', bytes: 2, cycles: 6, pageCycles: 0 }, // 0xF7
  { inst: 'SED', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xF8
  { inst: 'SBC', addr: 'ABY', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xF9
  { inst: 'NOP', addr: 'IMP', bytes: 1, cycles: 2, pageCycles: 0 }, // 0xFA
  { inst: 'ISC', addr: 'ABY', bytes: 3, cycles: 7, pageCycles: 0 }, // 0xFB
  { inst: 'NOP', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xFC
  { inst: 'SBC', addr: 'ABX', bytes: 3, cycles: 4, pageCycles: 1 }, // 0xFD
  { inst: 'INC', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0xFE
  { inst: 'ISC', addr: 'ABX', bytes: 3, cycles: 7, pageCycles: 0 }, // 0xFF
];
