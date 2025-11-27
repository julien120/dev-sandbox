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
    const length = Math.max(1024, normalized.length * 128);
    const pointer = mecabModule._malloc(length);
    try {
      const resultPointer = mecabModule.ccall(
        'mecab_sparse_tostr3',
        'number',
        ['number', 'string', 'number', 'number', 'number'],
        [
          mecabInstance,
          normalized,
          mecabModule.lengthBytesUTF8(normalized) + 1,
          pointer,
          length,
        ],
      );
      const parsed = mecabModule.UTF8ToString(resultPointer);
      if (!parsed) {
        return [];
      }
      return parsed
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [word, traits] = line.split('\t');
          if (!word || !traits) {
            return null;
          }
          const fields = traits.split(',');
          return {
            word,
            pos: fields[0] ?? '',
            pos_detail1: fields[1] ?? '',
            pos_detail2: fields[2] ?? '',
            pos_detail3: fields[3] ?? '',
            conjugation1: fields[4] ?? '',
            conjugation2: fields[5] ?? '',
            dictionary_form: fields[6] ?? '',
            reading: fields[7] ?? '',
            pronunciation: fields[8] ?? '',
          } as MecabRawToken;
        })
        .filter((token): token is MecabRawToken => token !== null);
    } finally {
      mecabModule._free(pointer);
    }
  }
}
