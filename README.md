## NesTs Nintendo Entertainment System (NES) Emulator

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![Screenshot of Donkey Kong](https://imgur.com/Ntt91Jd.gif)
![Screenshot of Super Mario Brothers](https://imgur.com/rlbFwm0.gif)
![Screenshot of Legend of Zelda](https://imgur.com/pp0AZE7.gif)

### Notice

This project is STILL EXPERIMENTAL and WIP.

### Summary

TypeScript/React.js NES emulator implementation for My Own Learning Porpose. The implementation is NOT fully faithfull to the original NES hardware
and some codes are still messy.

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Key-Mappings

| NES Button | Keyboard |
-------------|----------- 
| →      | Arrow-Right |
| ↓      | Arrow-Down  |
| ←      | Arrow-Left  |
| ↑      | Arrow-Up    |
| SELECT | Space       |
| START  | Return      |
| A      | X           |
| B      | Z           |

### Roadmap

The following is a checklist of features and their progress:
- [x] Console
  - [x] NTSC
- [x] CPU
  - [x] Official Instructions
  - [ ] Unofficial Instructions
  - [x] Interrupts
- [x] PPU
  - [x] VRAM
  - [x] Background
  - [x] Sprites
  - [x] NTSC TV Artifact Effects
  - [x] Emphasize RGB/Grayscale
- [ ] APU
  - [ ] AudioWroklet
  - [x] Pulse Channels
  - [x] Triangle Channels
  - [x] Noise Channels
  - [x] Delta Mulation Channel
- [x] Inputs
- [x] Memory
- [x] Cartridge
  - [ ] Battery-backed Save RAM
  - [x] iNES Format
  - [ ] NES 2.0 Format
  - [ ] Mappers
    - [x] NROM (Mapper 0)
    - [x] SxROM/MMC1 (Mapper 1)
    - [x] UxROM (Mapper 2)
    - [x] CNROM (Mapper 3)
    - [ ] TxROM/MMC3 (Mapper 4)
    - [ ] ExROM/MMC5 (Mapper 5)
- [ ] Misc
  - [ ] GitHub page
  - [ ] Unit/Integration tests
  - [ ] Refactor Source Codes
  - [X] Error Handling
  - [ ] Documentation
  - [ ] Make Things Responsive
