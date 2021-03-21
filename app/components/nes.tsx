/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React  from 'react';
import styles from '../../styles/NES.module.css'
import { useRef          } from 'react';
import { Button          } from '../api/controller';
import { Actions         } from './actions';
import { Engine          } from './engine';
import { Logo            } from './logo';
import { Pills           } from './pills';
import { Screen          } from './screen';

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

  let engine: Engine;

  React.useEffect(() => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
          actions.current.keyupUp();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.UP, false);
            engine.nes.player2.update(Button.UP, false);
          }
          break;
        case 'ArrowDown':
          actions.current.keyupDown();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.DOWN, false);
            engine.nes.player2.update(Button.DOWN, false);
          }
          break;
        case 'ArrowLeft':
          actions.current.keyupLeft();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.LEFT, false);
            engine.nes.player2.update(Button.LEFT, false);
          }
          break;
        case 'ArrowRight':
          actions.current.keyupRight();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.RIGHT, false);
            engine.nes.player2.update(Button.RIGHT, false);
          }
          break;
        case 'Enter':
          pills.current.keyupStart();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.START, false);
            engine.nes.player2.update(Button.START, false);
          }
          break;
        case 'Space':
          pills.current.keyupSelect();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.SELECT, false);
            engine.nes.player2.update(Button.SELECT, false);
          }
          break;
        case 'KeyX':
          actions.current.keyupA();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.A, false);
            engine.nes.player2.update(Button.A, false);
          }
          break;
        case 'KeyZ':
          actions.current.keyupB();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.B, false);
            engine.nes.player2.update(Button.B, false);
          }
          break;
      }
      e.preventDefault();
    });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
          actions.current.keydownUp();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.UP, true);
            engine.nes.player2.update(Button.UP, true);
          }
          break;
        case 'ArrowDown':
          actions.current.keydownDown();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.DOWN, true);
            engine.nes.player2.update(Button.DOWN, true);
          }
          break;
        case 'ArrowLeft':
          actions.current.keydownLeft();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.LEFT, true);
            engine.nes.player2.update(Button.LEFT, true);
          }
          break;
        case 'ArrowRight':
          actions.current.keydownRight();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.RIGHT, true);
            engine.nes.player2.update(Button.RIGHT, true);
          }
          break;
        case 'Enter':
          pills.current.keydownStart();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.START, true);
            engine.nes.player2.update(Button.START, true);
          }
          break;
        case 'Space':
          pills.current.keydownSelect();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.SELECT, true);
            engine.nes.player2.update(Button.SELECT, true);
          }
          break;
        case 'KeyX':
          actions.current.keydownA();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.A, true);
            engine.nes.player2.update(Button.A, true);
          }
          break;
        case 'KeyZ':
          actions.current.keydownB();
          if (engine && engine.nes) {
            engine.nes.player1.update(Button.B, true);
            engine.nes.player2.update(Button.B, true);
          }
          break;
      }
      e.preventDefault();
    });
  });

  const handleChangeFile = (file: File) => {
    if (engine && engine.intervalID) clearInterval(engine.intervalID);
    let reader = new FileReader();
    let onLoad = (f: File) => (e: any) => {
      try {
        engine = new Engine(screen.current.canvas, new Uint8Array(e.target.result));
        engine.start();
      } catch (e) {
        let ctx = screen.current.canvas.getContext('2d');
        ctx.clearRect(0, 0, engine.width, engine.height);
        ctx.textAlign = 'center';
        ctx.fillText(e, 128, 120);
        if (engine && engine.intervalID) clearInterval(engine.intervalID);
      }
    }
    reader.onload = onLoad(file);
    reader.readAsArrayBuffer(file);
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
