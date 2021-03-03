/*
 * nests:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import React, { useRef, useImperativeHandle } from 'react';

type Props = {
  width:  number;
  height: number;
};

export const Screen = React.forwardRef<HTMLCanvasElement, Props>((props, ref) => {
  let canvas = useRef<HTMLCanvasElement>();

  useImperativeHandle(ref, () => ({
    onFrame(frame: Uint32Array): void {
      let ctx = canvas.current.getContext('2d');
      let img = ctx.createImageData(props.width, props.height);
      let ptr = 0;
      for (let y = 0; y < props.height; y++) {
        for (let x = 0; x < props.width; x++) {
          const offset = y * props.width + x;
          img.data[ptr++] = frame[offset] >> 16 & 0xFF;
          img.data[ptr++] = frame[offset] >>  8 & 0xFF;
          img.data[ptr++] = frame[offset] >>  0 & 0xFF;
          img.data[ptr++] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }
  }));

  return (
    <div className="screen-box">
      <div className="screen-display">
        <canvas ref={canvas} width={props.width} height={props.height}/>
      </div>
    </div>
  );
})
