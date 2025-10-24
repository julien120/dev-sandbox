import type { Vector2 } from './math';

export type Rect = {
  position: Vector2;
  size: Vector2;
};

export type Circle = {
  position: Vector2;
  radius: number;
};

export const rectsIntersect = (a: Rect, b: Rect): boolean => {
  return !(
    a.position.x + a.size.x < b.position.x ||
    a.position.x > b.position.x + b.size.x ||
    a.position.y + a.size.y < b.position.y ||
    a.position.y > b.position.y + b.size.y
  );
};

export const circlesIntersect = (a: Circle, b: Circle): boolean => {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const distanceSquared = dx * dx + dy * dy;
  const radiusSum = a.radius + b.radius;
  return distanceSquared <= radiusSum * radiusSum;
};

export const rectCircleIntersect = (rect: Rect, circle: Circle): boolean => {
  const nearestX = Math.max(rect.position.x, Math.min(circle.position.x, rect.position.x + rect.size.x));
  const nearestY = Math.max(rect.position.y, Math.min(circle.position.y, rect.position.y + rect.size.y));
  const dx = circle.position.x - nearestX;
  const dy = circle.position.y - nearestY;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
};
