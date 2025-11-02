import LoadMecab from 'mecab-wasm/lib/libmecab.js';

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

type MecabModule = Awaited<ReturnType<typeof LoadMecab>>;

let mecabModule: MecabModule | null = null;
let mecabInstance: number | null = null;

const getAssetBase = () => {
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  return `${baseUrl}mecab/`;
};

const modulePromise = LoadMecab({
  locateFile: (path: string) => {
    const assetBase = getAssetBase();
    if (path.endsWith('.wasm')) {
      return `${assetBase}libmecab.wasm`;
    }
    if (path.endsWith('.data')) {
      return `${assetBase}libmecab.data`;
    }
    return path;
  },
});

const initialize = async () => {
  if (mecabModule) {
    return;
  }
  mecabModule = await modulePromise;
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
