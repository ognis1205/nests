/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React  from 'react';
import styles from '../../styles/Actions.module.css'
import { useRef } from 'react';

type ActionButtons = {
  up:    HTMLDivElement;
  right: HTMLDivElement;
  down:  HTMLDivElement;
  left:  HTMLDivElement;
  a:     HTMLDivElement;
  b:     HTMLDivElement;            
  keydownUp:    () => void;
  keyupUp:      () => void;
  keydownRight: () => void;
  keyupRight:   () => void;
  keydownDown:  () => void;
  keyupDown:    () => void;
  keydownLeft:  () => void;
  keyupLeft:    () => void;
  keydownA:     () => void;
  keyupA:       () => void;
  keydownB:     () => void;
  keyupB:       () => void;
};

export const Actions = React.forwardRef<ActionButtons, Object>((props, ref) => {
  const up    = useRef<HTMLDivElement>();

  const right = useRef<HTMLDivElement>();

  const down  = useRef<HTMLDivElement>();

  const left  = useRef<HTMLDivElement>();

  const a     = useRef<HTMLDivElement>();

  const b     = useRef<HTMLDivElement>();

  React.useImperativeHandle(ref, () => ({
    get up(): HTMLDivElement {
      return up.current;
    },
    get right() {
      return right.current;
    },
    get down() {
      return down.current;
    },
    get left() {
      return down.current;
    },
    get a() {
      return a.current;
    },
    get b() {
      return a.current;
    },
    keydownUp(): void {
      up.current.classList.add(styles['active']);
    },
    keyupUp(): void {
      up.current.classList.remove(styles['active']);
    },
    keydownRight(): void {
      right.current.classList.add(styles['active']);
    },
    keyupRight(): void {
      right.current.classList.remove(styles['active']);
    },
    keydownDown(): void {
      down.current.classList.add(styles['active']);
    },
    keyupDown(): void {
      down.current.classList.remove(styles['active']);
    },
    keydownLeft(): void {
      left.current.classList.add(styles['active']);
    },
    keyupLeft(): void {
      left.current.classList.remove(styles['active']);
    },
    keydownA(): void {
      a.current.classList.add(styles['active']);
    },
    keyupA(): void {
      a.current.classList.remove(styles['active']);
    },
    keydownB(): void {
      b.current.classList.add(styles['active']);
    },
    keyupB(): void {
      b.current.classList.remove(styles['active']);
    },
  }));

  return (
    <div className={styles['action-buttons']}>
      <div className={styles['dpad']}>
        <div ref={up} className={styles['up-button']}>
          <span className={`${styles['arrow']} ${styles['up-arrow']}`}/>
        </div>
        <div ref={right} className={styles['right-button']}>
          <span className={`${styles['arrow']} ${styles['right-arrow']}`}/>
        </div>
        <div ref={down} className={styles['down-button']}>
          <span className={`${styles['arrow']} ${styles['down-arrow']}`}/>
        </div>
        <div className={styles['dent-button']}>
          <span className={styles['dent-circle']}>
            <span className={`${styles['dent-highlight']}`}/>
          </span>
        </div>
        <div ref={left} className={styles['left-button']}>
          <span className={`${styles['arrow']} ${styles['left-arrow']}`}/>
        </div>
      </div>
      <div ref={a} className={`${styles['ab-button']} ${styles['a-button']}`}>
        <span className={styles['button-height']}>A</span>
      </div>
      <div ref={b} className={`${styles['ab-button']} ${styles['b-button']}`}>
        <span className={styles['button-height']}>B</span>
      </div>
    </div>
  );
})
