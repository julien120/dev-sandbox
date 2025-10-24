// ランダム整数 [0, max) を返す。ビルド環境互換性のため Math.random のみ使用。
export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
