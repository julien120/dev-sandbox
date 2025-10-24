// ランダム整数 [0, max) を返す。WebCrypto → Math.random の順で使用。
export function randomInt(max: number): number {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (globalThis as any).crypto;
  if (c?.getRandomValues) {
    const a = new Uint32Array(1);
    c.getRandomValues(a);
    // 衝突バイアスは気にせず簡易に mod。ゲーム用途なら十分。
    return a[0] % max;
  }
  return Math.floor(Math.random() * max);
}
