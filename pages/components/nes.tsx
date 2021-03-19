/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import  React  from 'react';
import  styles from '../../styles/NES.module.css'
import { useRef          } from 'react';
import { NES as Emulator } from '../../app/emulator/nes';
import { Button          } from '../../app/api/controller';
import { Screen          } from './screen';
import { Logo            } from './logo';

type Props = {
  width:  number;
  height: number;
};

export const NES: React.FC<Props> = (props: Props) => {
  type ScreenHandle = React.ElementRef<typeof Screen>;

  let screen = useRef<ScreenHandle>();

  let nes: Emulator;

  const onFrame = (frame: Uint32Array) => {
    let ctx = screen.current.getContext('2d');
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
      document.addEventListener('keydown', keyboardHandle);
      document.addEventListener('keyup',   keyboardHandle);
      function keyboardHandle(e: KeyboardEvent) {
        let btn: Button;
        let obj: HTMLElement;
        switch (e.code) {
          case 'ArrowUp':
            btn = Button.UP;
            obj = document.getElementById ('u');
            break;
          case 'ArrowDown':
            btn = Button.DOWN;
            obj = document.getElementById ('d');
            break;
          case 'ArrowLeft':
            btn = Button.LEFT;
            obj = document.getElementById ('l');
            break;
          case 'ArrowRight':
            btn = Button.RIGHT;
            obj = document.getElementById ('r');
            break;
          case 'Enter':
            btn = Button.START;
            obj = document.getElementById ('button-start');
            break;
          case 'Space':
            btn = Button.SELECT;
            obj = document.getElementById ('button-select');
            break;
          case 'KeyX':
            btn = Button.A;
            obj = document.getElementById ('a');
            break;
          case 'KeyZ':
            btn = Button.B;
            obj = document.getElementById ('b');
            break;
        }
        if (obj) {
          if (e.type === 'keydown') obj.classList.add('active');
          if (e.type === 'keyup'  ) obj.classList.remove('active');
        }
        nes.player1.update(btn, e.type === 'keydown');
        nes.player2.update(btn, e.type === 'keydown');
        e.preventDefault();
      }
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
        <div className={styles['action-buttons']}>
          <div className={styles['dpad']}>
            <div className={styles['up-button']}>
              <span className={`${styles['arrow']} ${styles['up-arrow']}`}/>
            </div>
            <div className={styles['right-button']}>
              <span className={`${styles['arrow']} ${styles['right-arrow']}`}/>
            </div>
            <div className={styles['down-button']}>
              <span className={`${styles['arrow']} ${styles['down-arrow']}`}/>
            </div>
            <div className={styles['dent-button']}>
              <span className={styles['dent-circle']}>
                <span className={`${styles['dent-highlight']}`}/>
              </span>
            </div>
            <div className={styles['left-button']}>
              <span className={`${styles['arrow']} ${styles['left-arrow']}`}/>
            </div>
          </div>
          <div className={`${styles['ab-button']} ${styles['a-button']}`}>
            <span className={styles['button-height']}>A</span>
          </div>
          <div className={`${styles['ab-button']} ${styles['b-button']}`}>
            <span className={styles['button-height']}>B</span>
          </div>
        </div>
        <div className={styles['pill-buttons']}>
          <div className={styles['pill-button']}>
            <label className="select">SELECT</label>
          </div>
          <div className={styles['pill-button']}>
            <label className="start">START</label>
          </div>
          <div className={styles['cart-button']}>
            <input id="ines" type="file" accept=".nes" onChange={(e) => { handleChangeFile(e.target.files[0]); }} hidden/>
            <label className="rom" htmlFor="ines">ROM</label>
          </div>
        </div>
      </div>
  );
}
