/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import * as React from 'react';
import Document from 'next/document';
import {
  Html,
  Head,
  Main,
  NextScript
} from 'next/document';
import { 
  ServerStyleSheets
} from '@material-ui/core/styles';
import {
  theme
} from '../styles/theme/default';

export default class EmulatorDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content={ theme.palette.primary.main } />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

EmulatorDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();

  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
