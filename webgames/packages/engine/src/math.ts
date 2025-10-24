export type Vector2 = {
  x: number;
  y: number;
};

export const vec2 = (x = 0, y = 0): Vector2 => ({ x, y });

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const lerp = (from: number, to: number, t: number): number => {
  return from + (to - from) * clamp(t, 0, 1);
};
