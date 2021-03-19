/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React  from 'react';
import styles from '../../styles/Logo.module.css'

type Props = {};

export const Logo: React.FC<Props> = (props) => {
  return <div className={styles['logo']}>WebNES</div>;
}
