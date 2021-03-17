/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import   React           from 'react';
import   CssBaseline     from '@material-ui/core/CssBaseline';
import { AppProps      } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme         } from '../styles/theme/default';
import './styles.css'

export default function Emulator(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) jssStyles.parentElement!.removeChild(jssStyles);
  }, []);

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}
