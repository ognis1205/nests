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

//import { NES } from '../app/core/nes';
//import { ROM } from '../app/core/rom';
//import { Screen } from '../app/core/screen';

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
//  let nes: NES;

  const classes = useStyle(useTheme());

  const handleChangeFile = (file: File) => {
    let reader = new FileReader();
    let onLoad = (f: File) => (e: any) => {
//      nes     = new NES();
//      nes.setROM(new ROM(e.target.result));
//      nes.setScreen(new Screen(document.getElementById('screen') as HTMLCanvasElement));
//      nes.bootup();
//      start();
    }
    reader.onload = onLoad(file);
    reader.readAsArrayBuffer(file);
  }

//  const start = () => {
//    requestAnimationFrame(function render(timestamp) {
//      do {
//        nes.tick();
//      } while (!nes.ppu.frameRendered());
//      console.log(nes.cpu.dump());
//      nes.runPerFrame();
//      requestAnimationFrame(render);
//    });
//  }
  
  return (
    <div className={classes.root}>
      <Head>
        <title>TypeScript NES</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>

      <Box textAlign='center'>
        <canvas id='screen' width="256" height="240"/>
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
