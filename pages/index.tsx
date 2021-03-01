/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React from 'react';
import Head  from 'next/head';

import {
  useTheme,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import {
  Box,
  Button,
} from "@material-ui/core";

import { NES } from '../app/emulator/nes';
import { Screen } from '../app/screen/screen';
import { Button as NESButton } from '../app/api/controller';

const useStyle = makeStyles({
  root: (props: Theme) => ({
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    height:         '100vh',
  })
});

export default function Home() {
  let nes: NES;
  let screen: Screen;
  const classes = useStyle(useTheme());

  const handleChangeFile = (file: File) => {
    let reader = new FileReader();
    let onLoad = (f: File) => (e: any) => {
      screen = new Screen(document.getElementById('screen') as HTMLCanvasElement);
      nes    = new NES(new Uint8Array(e.target.result), {
        sampleRate: undefined,
        onSample:   volume => {},
        onFrame:    frame  => screen.onFrame(frame),
        sramLoad:   undefined
      });
      screen.emulator = nes;
      document.addEventListener('keydown', keyboardHandle);
      document.addEventListener('keyup', keyboardHandle);
      function keyboardHandle(e: KeyboardEvent) {
        let button: NESButton;
        switch (e.code) {
          case 'ArrowUp':
            button = NESButton.UP;
            break;
          case 'ArrowDown':
            button = NESButton.DOWN;
            break;
          case 'ArrowLeft':
            button = NESButton.LEFT;
            break;
          case 'ArrowRight':
            button = NESButton.RIGHT;
            break;
          case 'Enter':
            button = NESButton.START;
            break;
          case 'Space':
            button = NESButton.SELECT;
            break;
          case 'KeyX':
            button = NESButton.A;
            break;
          case 'KeyZ':
            button = NESButton.B;
            break;
        }
        nes.player1.update(button, e.type === 'keydown');
        nes.player2.update(button, e.type === 'keydown');
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
    <div className={classes.root}>
      <Head>
        <title>TypeScript NES</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>

      <Box textAlign='center'>
        {/*<canvas id="screen" width="768" height="720"></canvas>*/}
        <canvas id="screen" width="256" height="240"></canvas>
      </Box>

      <Box textAlign='center'>
        <input
          id="upload-file"
          type="file"
          accept=".nes"
          onChange={(e) => { handleChangeFile(e.target.files[0]); }}
          hidden/>
        <label htmlFor="upload-file">
          <Button
            variant="contained"
            color="primary"
            component="span">
            Select ROM
          </Button>
        </label>
      </Box>

      <style jsx={true}>{`
        .root {
          text-align: center;
        }
      `}</style>
    </div>
  );
}
