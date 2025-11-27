export type MecabRawToken = {
  word: string;
  pos: string;
  pos_detail1: string;
  pos_detail2: string;
  pos_detail3: string;
  conjugation1: string;
  conjugation2: string;
  dictionary_form: string;
  reading?: string;
  pronunciation?: string;
};

type MecabCallArg = string | number | null | undefined;
type MecabModule = {
  ccall: (...args: MecabCallArg[]) => unknown;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  lengthBytesUTF8: (value: string) => number;
  UTF8ToString: (pointer: number) => string;
};

type MecabLoader = (options: Record<string, unknown>) => Promise<MecabModule>;

let mecabModule: MecabModule | null = null;
let mecabInstance: number | null = null;
let mecabLoaderPromise: Promise<MecabModule> | null = null;

const getAssetBase = () => {
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  return `${baseUrl}mecab/`;
};

const loadMecabModule = async (): Promise<MecabModule> => {
  const assetBase = getAssetBase();
  const loaderUrl = `${assetBase}libmecab.js`;
  const module = await import(/* @vite-ignore */ loaderUrl);
  const loader: MecabLoader = module.default ?? module;
  return loader({
    locateFile: (path: string) => {
      if (path.endsWith('.wasm')) {
        return `${assetBase}libmecab.wasm`;
      }
      if (path.endsWith('.data')) {
        return `${assetBase}libmecab.data`;
      }
      return path;
    },
  });
};

const initialize = async () => {
  if (mecabModule) {
    return;
  }
  mecabLoaderPromise ||= loadMecabModule();
  mecabModule = await mecabLoaderPromise;
  mecabInstance = mecabModule.ccall('mecab_new2', 'number', ['string'], ['']);
  if (!mecabInstance) {
    throw new Error('MeCab インスタンスの初期化に失敗しました');
  }
};

export class Mecab {
  static async waitReady(): Promise<void> {
    await initialize();
  }

  static query(text: string): MecabRawToken[] {
    if (!mecabModule || !mecabInstance) {
      throw new Error('Mecab not ready');
    }

    const normalized = text;
    const outLength = Math.max(1024, normalized.length * 128);
    const outputPointer = mecabModule._malloc(outLength);

    try {
      const resultPointer = mecabModule.ccall(
        'mecab_sparse_tostr3',
        'number',
        ['number', 'string', 'number', 'number', 'number'],
        [
          mecabInstance,
          normalized,
          mecabModule.lengthBytesUTF8(normalized) + 1,
          outputPointer,
          outLength,
        ],
      );

      const parsed = mecabModule.UTF8ToString(resultPointer);
      if (!parsed) {
        return [];
      }

      const rows = parsed.split('\n');
      const tokens: MecabRawToken[] = [];
      rows.forEach((line) => {
        if (!line.trim()) {
          return;
        }
        const [surface, details] = line.split('\t');
        if (!surface || !details) {
          return;
        }
        const fields = details.split(',');
        tokens.push({
          word: surface,
          pos: fields[0] ?? '',
          pos_detail1: fields[1] ?? '',
          pos_detail2: fields[2] ?? '',
          pos_detail3: fields[3] ?? '',
          conjugation1: fields[4] ?? '',
          conjugation2: fields[5] ?? '',
          dictionary_form: fields[6] ?? '',
          reading: fields[7] ?? '',
          pronunciation: fields[8] ?? '',
        });
      });

      return tokens;
    } finally {
      mecabModule._free(outputPointer);
    }
  }
}
