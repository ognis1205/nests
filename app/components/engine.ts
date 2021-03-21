/*
 * nes-ts:
 * Emulator for the Nintendo Entertainment System (R) Archetecture.
 * Written by and Copyright (C) 2021 Shingo OKAWA shingo.okawa.g.h.c@gmail.com
 * Trademarks are owned by their respect owners.
 */
import { NES } from '../emulator/nes';

export interface Options {
  sampleRate: number;

  bufferSize: number;

  width: number;

  height: number;
}

export class Engine {
  public nes: NES;

  public bufferSize: number;

  public width: number;

  public height: number;

  public intervalID: NodeJS.Timer | null;

  private audCtx: AudioContext;

  private visCtx: CanvasRenderingContext2D;

  private source: AudioBufferSourceNode;

  private node: ScriptProcessorNode;

  private buffer: number[];

  public constructor(canvas: HTMLCanvasElement, ines: Uint8Array, options?: Options) {
    options = this.parse(options);
    this.bufferSize = options.bufferSize;
    this.width      = options.width;
    this.height     = options.height;
    this.visCtx     = canvas.getContext('2d');
    if (typeof AudioContext !== 'undefined') {
      this.audCtx = new AudioContext({ sampleRate: options.sampleRate });
      this.source = this.audCtx.createBufferSource();
      this.node   = this.audCtx.createScriptProcessor(this.bufferSize, 0, 1);
    }
    this.buffer = [];
    this.nes    = new NES(ines, {
      sampleRate: this.sampleRate,
      onSample:   volume => this.onSample(volume),
      onFrame:    frame  => this.onFrame(frame),
      sramLoad:   undefined
    });
  }

  public start() {
    if (typeof AudioContext !== 'undefined') {
      this.node.onaudioprocess = e => this.process(e);
      this.source.connect(this.node);
      this.node.connect(this.audCtx.destination);
      this.source.start();
    }
    this.intervalID = setInterval(() => {
      this.waitSample();
    }, 1);
  }

  public get sampleRate(): number {
    return typeof AudioContext !== 'undefined' ? this.audCtx.sampleRate : undefined;
//    return this.audCtx.sampleRate;
  }

  public onSample(volume: number): void {
    this.buffer.push(volume);
  }

  public onFrame(frame: Uint32Array): void {
    let img = this.visCtx.createImageData(this.width, this.height);
    let ptr = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const offset = y * this.width + x;
        img.data[ptr++] = frame[offset] >> 16 & 0xFF;
        img.data[ptr++] = frame[offset] >>  8 & 0xFF;
        img.data[ptr++] = frame[offset] >>  0 & 0xFF;
        img.data[ptr++] = 255;
      }
    }
    this.visCtx.putImageData(img, 0, 0);
  }

  private parse(options?: Options): Options {
    options = options || {} as any;
    return {
      sampleRate: options.sampleRate || 24000,
      bufferSize: options.bufferSize || 256,
      width:      options.width      || 256,
      height:     options.height     || 240
    };
  }

  private process(e: AudioProcessingEvent): void {
    const channel = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++) channel[i] =  this.buffer.shift();
  }

  private waitSample(): void {
    try {
      while (this.buffer.length < this.bufferSize * 4) this.nes.tick();
      console.log('interval');
    } catch (e) {
      this.visCtx.clearRect(0, 0, this.width, this.height);
      this.visCtx.textAlign = 'center';
      this.visCtx.fillText(e, 128, 120);
      if (this.intervalID) clearInterval(this.intervalID);
    }
  }
}
