/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import   React, { useRef    } from 'react';
import { NES as NESEmulator } from '../emulator/nes';
import { Button             } from '../api/controller';
import { Screen             } from './screen';
import { Logo               } from './logo';
import   styles               from './nes.module.css'

export const NES = ({}) => {
  let screen = useRef();

//  let controller = useRef();

  let nes: NESEmulator;

  const handleChangeFile = (file: File) => {
    let reader = new FileReader();
    let onLoad = (f: File) => (e: any) => {
      nes = new NESEmulator(new Uint8Array(e.target.result), {
        sampleRate: undefined,
        onSample:   volume => {},
        onFrame:    frame  => screen.current.onFrame(frame),
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
      <div className="nes-box">
        <Screen ref={screen} width={256} height={240}/>
        <Logo/>
        <div className="button-box">
          <div className="arrow-group">
            <div id="u"><span className="arrow u"></span></div>
            <div id="r"><span className="arrow r"></span></div>
            <div id="d"><span className="arrow d"></span></div>
            <div id="c"><span className="dent   "><span className="dent-highlight"></span></span></div>
            <div id="l"><span className="arrow l" ></span></div>
          </div>
          <div id="a" className="ab-button"><span className="button-height">A</span></div>
          <div id="b" className="ab-button"><span className="button-height">B</span></div>
        </div>
        <div className="pill-box">
          <div id="button-select" className="pill-button">
            <label className="select">SELECT</label>
          </div>
          <div id="button-start" className="pill-button">
            <label className="start">START</label>
          </div>
          <div id="button-rom" className="cart-button">
            <input id="ines" type="file" accept=".nes" onChange={(e) => { handleChangeFile(e.target.files[0]); }} hidden/>
            <label className="rom" htmlFor="ines">ROM</label>
          </div>
        </div>
      </div>
  );
}
