/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const */
/**
 * GIF encoding utilities adapted from jsgif (https://github.com/antimatter15/jsgif)
 * MIT License
 */

type ByteLikeArray = Uint8Array | number[];

class ByteArray {
  private data: number[] = [];

  writeByte(val: number): void {
    this.data.push(val & 0xff);
  }

  writeUTFBytes(str: string): void {
    for (let i = 0; i < str.length; i += 1) {
      this.writeByte(str.charCodeAt(i));
    }
  }

  writeBytes(bytes: ByteLikeArray, offset = 0, length = bytes.length): void {
    for (let i = offset; i < offset + length; i += 1) {
      this.writeByte((bytes as ByteLikeArray)[i]);
    }
  }

  getData(): Uint8Array {
    return Uint8Array.from(this.data);
  }
}

class LZWEncoder {
  private readonly imgW: number;
  private readonly imgH: number;
  private readonly pixAry: Uint8Array;
  private readonly initCodeSize: number;
  private curAccum = 0;
  private curBits = 0;
  private readonly masks = [
    0x0000, 0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff, 0x01ff,
    0x03ff, 0x07ff, 0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff,
  ];
  private aCount = 0;
  private accum = new Uint8Array(256);

  constructor(width: number, height: number, pixels: Uint8Array, colorDepth: number) {
    this.imgW = width;
    this.imgH = height;
    this.pixAry = pixels;
    this.initCodeSize = Math.max(2, colorDepth);
  }

  encode(os: ByteArray): void {
    os.writeByte(this.initCodeSize);
    this.compress(this.initCodeSize + 1, os);
    os.writeByte(0);
  }

  private charOut(c: number, outs: ByteArray): void {
    this.accum[this.aCount] = c;
    this.aCount += 1;
    if (this.aCount >= 254) {
      this.flushChar(outs);
    }
  }

  private flushChar(outs: ByteArray): void {
    if (this.aCount > 0) {
      outs.writeByte(this.aCount);
      outs.writeBytes(this.accum, 0, this.aCount);
      this.aCount = 0;
    }
  }

  private clBlock(outs: ByteArray, hTab: Int32Array, codeSize: number, freeEntRef: { value: number }, clearFlagRef: { value: boolean }, entRef: { value: number }): void {
    this.resetCodeTable(hTab);
    freeEntRef.value = 1 << (codeSize - 1);
    clearFlagRef.value = true;
    const clearCode = 1 << (codeSize - 1);
    this.output(clearCode, outs, codeSize, clearFlagRef);
    entRef.value = this.pixAry[0] & 0xff;
  }

  private resetCodeTable(hTab: Int32Array): void {
    hTab.fill(-1);
  }

  private compress(initBits: number, outs: ByteArray): void {
    const hSize = 5003;
    const hTab = new Int32Array(hSize);
    const codeTab = new Int32Array(hSize);
    this.resetCodeTable(hTab);

    let ent = this.pixAry[0] & 0xff;
    const hShift = Math.max(0, Math.min(8, Math.floor(Math.log(this.initCodeSize) / Math.LN2)));
    const clearCode = 1 << (initBits - 1);
    const endOfFile = clearCode + 1;
    let freeEnt = clearCode + 2;
    let codeSize = initBits;
    let maxCode = (1 << codeSize) - 1;
    let clearFlag = false;

    this.output(clearCode, outs, codeSize, { value: clearFlag });

    const fcode = { value: 0 };
    const keyRef = { value: 0 };
    const freeEntRef = { value: freeEnt };
    const clearFlagRef = { value: clearFlag };
    const entRef = { value: ent };

    const hashFunc = (key: number) => {
      let hash = key;
      hash += ((hash << 8) >>> 0);
      hash ^= (hash >> 4);
      return hash % hSize;
    };

    for (let i = 1; i < this.pixAry.length; i += 1) {
      const c = this.pixAry[i] & 0xff;
      fcode.value = (c << 12) + ent;
      const index = hashFunc(fcode.value);
      keyRef.value = index;

      if (hTab[keyRef.value] === fcode.value) {
        ent = codeTab[keyRef.value];
        continue;
      }
      if (hTab[keyRef.value] >= 0) {
        let disp = hSize - keyRef.value;
        if (keyRef.value === 0) {
          disp = 1;
        }
        do {
          keyRef.value -= disp;
          if (keyRef.value < 0) {
            keyRef.value += hSize;
          }
          if (hTab[keyRef.value] === fcode.value) {
            ent = codeTab[keyRef.value];
            break;
          }
        } while (hTab[keyRef.value] >= 0);
        if (hTab[keyRef.value] === fcode.value) {
          continue;
        }
      }

      this.output(ent, outs, codeSize, clearFlagRef);
      ent = c;
      if (freeEntRef.value < 1 << 12) {
        codeTab[keyRef.value] = freeEntRef.value;
        hTab[keyRef.value] = fcode.value;
        freeEntRef.value += 1;
      } else {
        this.clBlock(outs, hTab, codeSize, freeEntRef, clearFlagRef, { value: ent });
        ent = c;
      }

      if (freeEntRef.value > maxCode && codeSize < 12) {
        codeSize += 1;
        maxCode = (1 << codeSize) - 1;
      }
    }

    this.output(ent, outs, codeSize, clearFlagRef);
    this.output(endOfFile, outs, codeSize, clearFlagRef);
  }

  private output(code: number, outs: ByteArray, codeSize: number, clearFlagRef: { value: boolean }): void {
    this.curAccum &= this.masks[this.curBits];
    if (this.curBits > 0) {
      this.curAccum |= code << this.curBits;
    } else {
      this.curAccum = code;
    }
    this.curBits += codeSize;
    while (this.curBits >= 8) {
      this.charOut(this.curAccum & 0xff, outs);
      this.curAccum >>= 8;
      this.curBits -= 8;
    }

    if (clearFlagRef.value) {
      this.curAccum = 0;
      this.curBits = 0;
      clearFlagRef.value = false;
    }
  }
}

class NeuQuant {
  private readonly netsize = 256;
  private readonly network: number[][] = [];
  private readonly bias = new Int32Array(this.netsize);
  private readonly freq = new Int32Array(this.netsize);
  private readonly radPower = new Int32Array(this.netsize >> 3);
  private netIndex = new Int32Array(256);

  constructor(pixels: Uint8Array, sampleFac: number) {
    for (let i = 0; i < this.netsize; i += 1) {
      const value = (i << (12 + 4)) / this.netsize;
      this.network[i] = [value, value, value];
      this.freq[i] = 1 << 16;
      this.bias[i] = 0;
    }
    this.learn(pixels, sampleFac);
    this.buildIndex();
  }

  private learn(pixels: Uint8Array, sampleFac: number): void {
    const lengthCount = pixels.length;
    const alphadec = 30 + ((sampleFac - 1) / 3);
    let samplePixels = lengthCount / (3 * sampleFac);
    let delta = 0;
    let alpha = 1 << 10;
    let radius = (this.netsize >> 3) - 1;
    if (samplePixels < this.netsize) {
      samplePixels = this.netsize;
    }

    let rad = radius >> 3;
    if (rad <= 1) {
      rad = 0;
    }
    for (let i = 0; i < rad; i += 1) {
      this.radPower[i] = alpha * (((rad * rad - i * i) * 256) / (rad * rad));
    }

    let step = 0;
    if (lengthCount < 1509) {
      step = 3;
    } else if (lengthCount % 499 !== 0) {
      step = 499;
    } else if (lengthCount % 491 !== 0) {
      step = 491;
    } else if (lengthCount % 487 !== 0) {
      step = 487;
    } else {
      step = 503;
    }

    let pixelIndex = 0;
    for (let i = 0; i < samplePixels; i += 1) {
      const r = pixels[pixelIndex] & 0xff;
      const g = pixels[pixelIndex + 1] & 0xff;
      const b = pixels[pixelIndex + 2] & 0xff;
      const bestBias = this.contest(r, g, b);
      this.alterSingle(alpha, bestBias, r, g, b);
      if (rad !== 0) {
        this.alterNeigh(rad, bestBias, r, g, b);
      }
      pixelIndex += step * 3;
      if (pixelIndex >= lengthCount) {
        pixelIndex -= lengthCount;
      }
      delta += 1;
      if (delta % 100 === 0) {
        alpha -= alpha / alphadec;
        radius -= radius / 30;
        rad = radius >> 3;
        if (rad <= 1) {
          rad = 0;
        }
        for (let j = 0; j < rad; j += 1) {
          this.radPower[j] = alpha * (((rad * rad - j * j) * 256) / (rad * rad));
        }
      }
    }
  }

  private buildIndex(): void {
    let previousColor = 0;
    let startPos = 0;
    for (let i = 0; i < this.netsize; i += 1) {
      const p = this.network[i];
      let smallPos = i;
      let smallValue = p[1];
      for (let j = i + 1; j < this.netsize; j += 1) {
        const q = this.network[j];
        if (q[1] < smallValue) {
          smallPos = j;
          smallValue = q[1];
        }
      }
      if (i !== smallPos) {
        const q = this.network[smallPos];
        [this.network[i], this.network[smallPos]] = [q, p];
      }
      if (smallValue !== previousColor) {
        this.netIndex[previousColor] = (startPos + i) >> 1;
        for (let j = previousColor + 1; j < smallValue; j += 1) {
          this.netIndex[j] = i;
        }
        previousColor = smallValue;
        startPos = i;
      }
    }
    this.netIndex[previousColor] = (startPos + this.netsize - 1) >> 1;
    for (let j = previousColor + 1; j < 256; j += 1) {
      this.netIndex[j] = this.netsize - 1;
    }
  }

  private contest(r: number, g: number, b: number): number {
    let bestBias = -1;
    let bestDistance = 1 << 31;
    let bestBiasDistance = bestDistance;
    for (let i = 0; i < this.netsize; i += 1) {
      const n = this.network[i];
      const dist = Math.abs(n[0] - r) + Math.abs(n[1] - g) + Math.abs(n[2] - b);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestBias = i;
      }
      const biasDist = dist - (this.bias[i] >> 12);
      if (biasDist < bestBiasDistance) {
        bestBiasDistance = biasDist;
        bestBias = i;
      }
      this.freq[i] -= this.freq[i] >> 10;
      this.bias[i] += (this.freq[i] << 10);
    }
    this.freq[bestBias] += 64;
    this.bias[bestBias] -= 64 << 10;
    return bestBias;
  }

  private alterSingle(alpha: number, index: number, r: number, g: number, b: number): void {
    const n = this.network[index];
    n[0] -= (alpha * (n[0] - r)) / (1 << 10);
    n[1] -= (alpha * (n[1] - g)) / (1 << 10);
    n[2] -= (alpha * (n[2] - b)) / (1 << 10);
  }

  private alterNeigh(rad: number, index: number, r: number, g: number, b: number): void {
    let lo = Math.max(index - rad, 0);
    let hi = Math.min(index + rad, this.netsize - 1);
    let j = index + 1;
    let k = index - 1;
    let q = 1;
    while (j <= hi || k >= lo) {
      const a = this.radPower[q++] / (1 << 18);
      if (j <= hi) {
        const p = this.network[j++];
        p[0] -= a * (p[0] - r);
        p[1] -= a * (p[1] - g);
        p[2] -= a * (p[2] - b);
      }
      if (k >= lo) {
        const p = this.network[k--];
        p[0] -= a * (p[0] - r);
        p[1] -= a * (p[1] - g);
        p[2] -= a * (p[2] - b);
      }
    }
  }

  map(r: number, g: number, b: number): number {
    let bestDistance = 1 << 30;
    let bestPos = -1;
    for (let i = 0; i < this.netsize; i += 1) {
      const p = this.network[i];
      const dist = Math.abs(p[0] - r) + Math.abs(p[1] - g) + Math.abs(p[2] - b);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestPos = i;
      }
    }
    return bestPos;
  }

  colorMap(): Uint8Array {
    const sorted = this.network
      .map((color) => {
        return [
          Math.max(0, Math.min(255, Math.round(color[0]))),
          Math.max(0, Math.min(255, Math.round(color[1]))),
          Math.max(0, Math.min(255, Math.round(color[2]))),
        ] as number[];
      })
      .sort((a, b) => a[1] - b[1]);
    const map = new Uint8Array(this.netsize * 3);
    for (let i = 0; i < sorted.length; i += 1) {
      const p = sorted[i];
      const offset = i * 3;
      map[offset] = p[0];
      map[offset + 1] = p[1];
      map[offset + 2] = p[2];
    }
    return map;
  }
}

export class GIFEncoder {
  private readonly width: number;
  private readonly height: number;
  private transparent = -1;
  private repeat = 0;
  private delay = 0;
  private started = false;
  private out = new ByteArray();
  private image: ImageData | null = null;
  private indexedPixels: Uint8Array = new Uint8Array(0);
  private colorDepth = 8;
  private colorTab: Uint8Array = new Uint8Array(0);
  private usedEntry = new Array<boolean>(256).fill(false);
  private palSize = 7;
  private sample = 10;
  private dispose = -1;
  private firstFrame = true;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setDelay(ms: number): void {
    this.delay = Math.round(ms / 10);
  }

  setFrameRate(fps: number): void {
    this.delay = Math.round(100 / fps);
  }

  setRepeat(code: number): void {
    this.repeat = code;
  }

  setTransparent(color: number): void {
    this.transparent = color;
  }

  setDispose(code: number): void {
    if (code >= 0) {
      this.dispose = code;
    }
  }

  setQuality(quality: number): void {
    if (quality < 1) {
      quality = 1;
    }
    this.sample = quality;
  }

  start(): void {
    this.writeString('GIF89a');
    this.started = true;
  }

  addFrame(ctx: CanvasRenderingContext2D): boolean {
    if (!this.started) {
      throw new Error('Encoder not started.');
    }
    this.image = ctx.getImageData(0, 0, this.width, this.height);
    this.analyzePixels();
    if (this.firstFrame) {
      this.writeLSD();
      this.writePalette();
      if (this.repeat >= 0) {
        this.writeNetscapeExt();
      }
    }
    this.writeGraphicCtrlExt();
    this.writeImageDesc();
    if (!this.firstFrame) {
      this.writePalette();
    }
    this.writePixels();
    this.firstFrame = false;
    return true;
  }

  finish(): boolean {
    if (!this.started) {
      return false;
    }
    this.out.writeByte(0x3b);
    this.started = false;
    return true;
  }

  stream(): ByteArray {
    return this.out;
  }

  private analyzePixels(): void {
    if (!this.image) {
      return;
    }
    const length = this.image.data.length;
    const pixels = new Uint8Array(length / 4 * 3);
    const data = this.image.data;
    let j = 0;
    for (let i = 0; i < length; i += 4) {
      pixels[j++] = data[i];
      pixels[j++] = data[i + 1];
      pixels[j++] = data[i + 2];
    }
    const nq = new NeuQuant(pixels, this.sample);
    this.colorTab = nq.colorMap();
    this.colorDepth = 8;
    this.palSize = 7;
    const k = this.colorTab.length / 3;
    this.usedEntry = new Array<boolean>(k).fill(false);
    this.indexedPixels = new Uint8Array(this.width * this.height);
    let pxIdx = 0;
    for (let i = 0; i < this.width * this.height; i += 1) {
      const r = data[pxIdx++];
      const g = data[pxIdx++];
      const b = data[pxIdx++];
      pxIdx++; // skip alpha
      const index = nq.map(r, g, b);
      this.usedEntry[index] = true;
      this.indexedPixels[i] = index;
    }
    this.image = null;
  }

  private writeGraphicCtrlExt(): void {
    this.out.writeByte(0x21);
    this.out.writeByte(0xf9);
    this.out.writeByte(4);
    let transp = 0;
    let disp = 0;
    if (this.transparent >= 0) {
      transp = 1;
    }
    if (this.dispose >= 0) {
      disp = this.dispose & 7;
    }
    disp <<= 2;

    this.out.writeByte(disp | transp);
    this.writeShort(this.delay);
    this.out.writeByte(this.transparent >= 0 ? this.transparent : 0);
    this.out.writeByte(0);
  }

  private writeImageDesc(): void {
    this.out.writeByte(0x2c);
    this.writeShort(0);
    this.writeShort(0);
    this.writeShort(this.width);
    this.writeShort(this.height);
    if (this.firstFrame) {
      this.out.writeByte(0);
    } else {
      this.out.writeByte(0x80 | this.palSize);
    }
  }

  private writeLSD(): void {
    this.writeShort(this.width);
    this.writeShort(this.height);
    this.out.writeByte(0x80 | (7 << 4) | this.palSize);
    this.out.writeByte(0);
    this.out.writeByte(0);
  }

  private writePalette(): void {
    this.out.writeBytes(this.colorTab);
    const n = (3 * 256) - this.colorTab.length;
    for (let i = 0; i < n; i += 1) {
      this.out.writeByte(0);
    }
  }

  private writePixels(): void {
    const encoder = new LZWEncoder(this.width, this.height, this.indexedPixels, this.colorDepth);
    encoder.encode(this.out);
  }

  private writeShort(value: number): void {
    this.out.writeByte(value & 0xff);
    this.out.writeByte((value >> 8) & 0xff);
  }

  private writeString(str: string): void {
    this.out.writeUTFBytes(str);
  }

  private writeNetscapeExt(): void {
    this.out.writeByte(0x21);
    this.out.writeByte(0xff);
    this.out.writeByte(11);
    this.writeString('NETSCAPE2.0');
    this.out.writeByte(3);
    this.out.writeByte(1);
    this.writeShort(this.repeat);
    this.out.writeByte(0);
  }
}
