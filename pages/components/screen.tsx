/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React  from 'react';
import styles from '../../styles/Screen.module.css'
import { useRef } from 'react';

type CanvasProps = React.HTMLProps<HTMLCanvasElement>

type ScreenDisplay = {
  canvas: HTMLCanvasElement;
};

export const Screen = React.forwardRef<ScreenDisplay, CanvasProps>((props, ref) => {
  const canvas = useRef<HTMLCanvasElement>();

  React.useImperativeHandle(ref, () => ({
    get canvas(): HTMLCanvasElement {
      return canvas.current;
    },
  }));

  return (
    <div className={styles['screen']}>
      <div className={styles['display']}>
        <canvas ref={canvas} width={props['width']} height={props['height']}/>
      </div>
    </div>
  );
})
