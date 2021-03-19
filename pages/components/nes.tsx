/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React  from 'react';
import styles from '../../styles/NES.module.css'
import { useRef          } from 'react';
import { NES as Emulator } from '../../app/emulator/nes';
import { Button          } from '../../app/api/controller';
import { Screen          } from './screen';
import { Logo            } from './logo';
import { Actions         } from './actions';
import { Pills           } from './pills';

type Props = {
  width:  number;
  height: number;
};

export const NES: React.FC<Props> = (props: Props) => {
  type ScreenHandle  = React.ElementRef<typeof Screen>;

  type ActionsHandle = React.ElementRef<typeof Actions>;

  type PillsHandle   = React.ElementRef<typeof Pills>;

  let screen  = useRef<ScreenHandle>();

  let actions = useRef<ActionsHandle>();

  let pills   = useRef<PillsHandle>();

  let nes: Emulator;

  React.useEffect(() => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
          actions.current.keyupUp();
          if (nes) {
            nes.player1.update(Button.UP, false);
            nes.player2.update(Button.UP, false);
          }
          break;
        case 'ArrowDown':
          actions.current.keyupDown();
          if (nes) {
            nes.player1.update(Button.DOWN, false);
            nes.player2.update(Button.DOWN, false);
          }
          break;
        case 'ArrowLeft':
          actions.current.keyupLeft();
          if (nes) {
            nes.player1.update(Button.LEFT, false);
            nes.player2.update(Button.LEFT, false);
          }
          break;
        case 'ArrowRight':
          actions.current.keyupRight();
          if (nes) {
            nes.player1.update(Button.RIGHT, false);
            nes.player2.update(Button.RIGHT, false);
          }
          break;
        case 'Enter':
          pills.current.keyupStart();
          if (nes) {
            nes.player1.update(Button.START, false);
            nes.player2.update(Button.START, false);
          }
          break;
        case 'Space':
          pills.current.keyupSelect();
          if (nes) {
            nes.player1.update(Button.SELECT, false);
            nes.player2.update(Button.SELECT, false);
          }
          break;
        case 'KeyX':
          actions.current.keyupA();
          if (nes) {
            nes.player1.update(Button.A, false);
            nes.player2.update(Button.A, false);
          }
          break;
        case 'KeyZ':
          actions.current.keyupB();
          if (nes) {
            nes.player1.update(Button.B, false);
            nes.player2.update(Button.B, false);
          }
          break;
      }
      e.preventDefault();
    });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
          actions.current.keydownUp();
          if (nes) {
            nes.player1.update(Button.UP, true);
            nes.player2.update(Button.UP, true);
          }
          break;
        case 'ArrowDown':
          actions.current.keydownDown();
          if (nes) {
            nes.player1.update(Button.DOWN, true);
            nes.player2.update(Button.DOWN, true);
          }
          break;
        case 'ArrowLeft':
          actions.current.keydownLeft();
          if (nes) {
            nes.player1.update(Button.LEFT, true);
            nes.player2.update(Button.LEFT, true);
          }
          break;
        case 'ArrowRight':
          actions.current.keydownRight();
          if (nes) {
            nes.player1.update(Button.RIGHT, true);
            nes.player2.update(Button.RIGHT, true);
          }
          break;
        case 'Enter':
          pills.current.keydownStart();
          if (nes) {
            nes.player1.update(Button.START, true);
            nes.player2.update(Button.START, true);
          }
          break;
        case 'Space':
          pills.current.keydownSelect();
          if (nes) {
            nes.player1.update(Button.SELECT, true);
            nes.player2.update(Button.SELECT, true);
          }
          break;
        case 'KeyX':
          actions.current.keydownA();
          if (nes) {
            nes.player1.update(Button.A, true);
            nes.player2.update(Button.A, true);
          }
          break;
        case 'KeyZ':
          actions.current.keydownB();
          if (nes) {
            nes.player1.update(Button.B, true);
            nes.player2.update(Button.B, true);
          }
          break;
      }
      e.preventDefault();
    });
  });

  const onFrame = (frame: Uint32Array) => {
    let ctx = screen.current.canvas.getContext('2d');
    let img = ctx.createImageData(props.width, props.height);
    let ptr = 0;
    for (let y = 0; y < props.height; y++) {
      for (let x = 0; x < props.width; x++) {
        const offset = y * props.width + x;
        img.data[ptr++] = frame[offset] >> 16 & 0xFF;
        img.data[ptr++] = frame[offset] >>  8 & 0xFF;
        img.data[ptr++] = frame[offset] >>  0 & 0xFF;
        img.data[ptr++] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  const handleChangeFile = (file: File) => {
    let reader = new FileReader();
    let onLoad = (f: File) => (e: any) => {
      nes = new Emulator(new Uint8Array(e.target.result), {
        sampleRate: undefined,
        onSample:   volume => {},
        onFrame:    frame  => onFrame(frame),
        sramLoad:   undefined
      });
      start();
    }
    reader.onload = onLoad(file);
    reader.readAsArrayBuffer(file);
  }

  const start = () => {
    requestAnimationFrame(function render(timestamp) {
      nes.frame();
      requestAnimationFrame(render);
    });
  }

  return (
    <div className={styles['emulator']}>
      <Screen ref={screen} width={props['width']} height={props['height']}/>
      <Logo/>
      <Actions ref={actions}/>
      <Pills ref={pills} onChange={handleChangeFile}/>
    </div>
  );
}
