/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import   React, { useRef    }    from 'react';
import { NES as NESEmulator } from '../emulator/nes';
import { Button             } from '../api/controller';
import { Screen             } from './screen';
import { Logo               } from './logo';

export const NES = ({}) => {
  let screen = useRef();

  let nes: NESEmulator;

//  let fps = 60;

//  let then = new Date().getTime();
//  let then = performance.now();

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
            obj = document.getElementById ('up-box');
            break;
          case 'ArrowDown':
            btn = Button.DOWN;
            obj = document.getElementById ('down-box');
            break;
          case 'ArrowLeft':
            btn = Button.LEFT;
            obj = document.getElementById ('left-box');
            break;
          case 'ArrowRight':
            btn = Button.RIGHT;
            obj = document.getElementById ('right-box');
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
//      let now = new Date().getTime();
//      let now = performance.now();
//      let fps = 1000 / (now - then);
//      then = now;
//      console.log(fps);
      nes.frame();
      requestAnimationFrame(render);
    });
  }

  return (
      <div className="nes">
        <Screen ref={screen} width='256' height='240'/>
        <Logo/>
        <div className="button-box">
          <div className="arrow-group">
            <div id="up-box"    ><span className="arrow up"   ></span></div>
            <div id="right-box" ><span className="arrow right"></span></div>
            <div id="down-box"  ><span className="arrow down" ></span></div>
            <div id="center-box"><span className="dent"><span className="dent-highlight"></span></span></div>
            <div id="left-box"  ><span className="arrow left" ></span></div>
          </div>
          <div id="a" className="ab-button"><span className="button-text-height">A</span></div>
          <div id="b" className="ab-button"><span className="button-text-height">B</span></div>
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
