/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React  from 'react';
import styles from '../../styles/Screen.module.css'

type CanvasProps = React.HTMLProps<HTMLCanvasElement>

export const Screen = React.forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
  return (
    <div className={styles['screen']}>
      <div className={styles['display']}>
        <canvas ref={ref} width={props['width']} height={props['height']}/>
      </div>
    </div>
  );
})
