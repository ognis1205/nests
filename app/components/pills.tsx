/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React  from 'react';
import styles from '../../styles/Pills.module.css'
import { useRef } from 'react';

type ActionButtons = {
  keydownStart:  () => void;
  keyupStart:    () => void;
  keydownSelect: () => void;
  keyupSelect:   () => void;
  keydownRom:    () => void;
  keyupRom:      () => void;
};

type Props = {
  onChange: (file: File) => void;
};

export const Pills = React.forwardRef<ActionButtons, Props>((props, ref) => {
  const start  = useRef<HTMLDivElement>();

  const select = useRef<HTMLDivElement>();

  const rom    = useRef<HTMLDivElement>();

  React.useImperativeHandle(ref, () => ({
    keydownStart(): void {
      start.current.classList.add(styles['active']);
    },
    keyupStart(): void {
      start.current.classList.remove(styles['active']);
    },
    keydownSelect(): void {
      select.current.classList.add(styles['active']);
    },
    keyupSelect(): void {
      select.current.classList.remove(styles['active']);
    },
    keydownRom(): void {
      rom.current.classList.add(styles['active']);
    },
    keyupRom(): void {
      rom.current.classList.remove(styles['active']);
    },
  }));

  return (
    <div className={styles['pill-buttons']}>
      <div ref={select} className={styles['pill-button']}>
        <label className="select">SELECT</label>
      </div>
      <div ref={start} className={styles['pill-button']}>
        <label className="start">START</label>
      </div>
      <div ref={rom} className={styles['cart-button']}>
        <input id="ines" type="file" accept=".nes" onChange={(e) => { props.onChange(e.target.files[0]); }} hidden/>
        <label className="rom" htmlFor="ines">ROM</label>
      </div>
    </div>
  );
})
