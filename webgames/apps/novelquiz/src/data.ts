export type FrequentWord = {
  surface: string;
  count: number;
};

export type WorkMeta = {
  id: string;
  title: string;
  author: string;
  year: number;
  reading?: string; // ひらがな等の読みを入れると平仮名回答も許容できる
  words: FrequentWord[];
};

// 既定は人間失格。今後 WORKS に追加してください。
export const WORKS: WorkMeta[] = [
  {
    id: 'ningen',
    title: '人間失格',
    author: '太宰治',
    year: 1948,
    reading: 'にんげんしっかく',
    words: [
      { surface: '堀木', count: 96 },
      { surface: 'ひと', count: 77 },
      { surface: 'ヒラメ', count: 55 },
      { surface: '気持', count: 43 },
      { surface: '道化', count: 42 },
      { surface: '一つ', count: 37 },
      { surface: '言葉', count: 36 },
      { surface: '学校', count: 35 },
      { surface: 'いま', count: 34 },
      { surface: '部屋', count: 33 },
      { surface: '恐怖', count: 32 },
      { surface: 'れい', count: 32 },
      { surface: 'お前', count: 32 },
      { surface: 'ヨシ子', count: 32 },
      { surface: 'お金', count: 31 },
      { surface: 'あなた', count: 31 },
      { surface: 'ちゃん', count: 28 },
      { surface: '世間', count: 28 },
      { surface: 'ひとり', count: 27 },
      { surface: 'ツネ子', count: 25 },
      { surface: '子供', count: 24 },
      { surface: 'シヅ子', count: 23 },
      { surface: 'いちど', count: 22 },
      { surface: '漫画', count: 22 },
      { surface: '写真', count: 21 },
      { surface: '思い', count: 21 },
      { surface: 'わけ', count: 20 },
      { surface: '東京', count: 20 },
      { surface: '不安', count: 19 },
      { surface: 'そこ', count: 19 },
      { surface: 'アント', count: 19 },
      { surface: '奥さん', count: 19 },
      { surface: '故郷', count: 18 },
      { surface: '世の中', count: 17 },
      { surface: 'シゲ子', count: 17 },
      { surface: 'つもり', count: 16 },
      { surface: 'へん', count: 15 },
      { surface: '生活', count: 15 },
      { surface: '違い', count: 15 },
      { surface: 'うち', count: 15 },
    ],
  },
  {
    id: 'meros',
    title: '走れメロス',
    author: '太宰治',
    year: 1940,
    reading: 'はしれめろす',
    words: [
      { surface: 'メロス', count: 78 },
      { surface: 'おまえ', count: 20 },
      { surface: 'セリヌンティウス', count: 15 },
      { surface: 'いま', count: 12 },
      { surface: 'わし', count: 8 },
      { surface: '群衆', count: 7 },
      { surface: '結婚式', count: 6 },
      { surface: 'さま', count: 6 },
      { surface: '暴君', count: 6 },
      { surface: '約束', count: 6 },
      { surface: '身代り', count: 6 },
      { surface: '濁流', count: 6 },
      { surface: '出発', count: 5 },
      { surface: 'つもり', count: 5 },
      { surface: '王城', count: 5 },
      { surface: '信実', count: 5 },
      { surface: '牧人', count: 4 },
      { surface: 'きょう', count: 4 },
      { surface: '花婿', count: 4 },
      { surface: '祝宴', count: 4 },
      { surface: 'うち', count: 4 },
      { surface: '様子', count: 4 },
      { surface: '質問', count: 4 },
      { surface: '老爺', count: 4 },
      { surface: '王様', count: 4 },
      { surface: 'まま', count: 4 },
      { surface: 'なん', count: 4 },
      { surface: '疲労', count: 4 },
      { surface: '仕度', count: 4 },
      { surface: '流れ', count: 4 },
      { surface: '山賊', count: 4 },
      { surface: '勇者', count: 4 },
      { surface: '一ぱい', count: 4 },
      { surface: '刑場', count: 4 },
      { surface: '太宰', count: 3 },
      { surface: 'シラクス', count: 3 },
      { surface: '花嫁', count: 3 },
      { surface: '石工', count: 3 },
      { surface: 'まち', count: 3 },
      { surface: 'からだ', count: 3 },
    ],
  },
];

// デフォルトで最初の作品を使う
export const DEFAULT_WORK = WORKS[0];
