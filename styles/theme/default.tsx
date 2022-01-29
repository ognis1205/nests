/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { createTheme } from '@material-ui/core/styles';
import   red              from '@material-ui/core/colors/red';

export const theme = createTheme({
  palette: {
    primary: {
      main:         '#7E2E1F',
      contrastText: '#B99C6B',
    },
    secondary: {
      main:         '#91554D',
      contrastText: '#D5C4A1',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FFF',
    },
  },
});
