/**
 * GIF encoding utilities adapted from jsgif (https://github.com/antimatter15/jsgif)
 * MIT License
 */
type ByteLikeArray = Uint8Array | number[];
declare class ByteArray {
    private data;
    writeByte(val: number): void;
    writeUTFBytes(str: string): void;
    writeBytes(bytes: ByteLikeArray, offset?: number, length?: number): void;
    getData(): Uint8Array;
}
export declare class GIFEncoder {
    private readonly width;
    private readonly height;
    private transparent;
    private repeat;
    private delay;
    private started;
    private out;
    private image;
    private indexedPixels;
    private colorDepth;
    private colorTab;
    private usedEntry;
    private palSize;
    private sample;
    private dispose;
    private firstFrame;
    constructor(width: number, height: number);
    setDelay(ms: number): void;
    setFrameRate(fps: number): void;
    setRepeat(code: number): void;
    setTransparent(color: number): void;
    setDispose(code: number): void;
    setQuality(quality: number): void;
    start(): void;
    addFrame(ctx: CanvasRenderingContext2D): boolean;
    finish(): boolean;
    stream(): ByteArray;
    private analyzePixels;
    private writeGraphicCtrlExt;
    private writeImageDesc;
    private writeLSD;
    private writePalette;
    private writePixels;
    private writeShort;
    private writeString;
    private writeNetscapeExt;
}
export {};
