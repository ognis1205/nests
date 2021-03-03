/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import   React from 'react';
import   Head  from 'next/head';
import { useTheme, makeStyles, Theme } from "@material-ui/core/styles";
import { NES                         } from '../app/components/nes';

const useStyle = makeStyles({
  root: (props: Theme) => ({
    display:        'flex',
    justifyContent: 'center',
  })
});

export default function Home() {
  const classes = useStyle(useTheme());

  return (
    <div className={classes.root}>
      <Head>
        <title>NES Boy</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <NES/>
    </div>
  );
}
