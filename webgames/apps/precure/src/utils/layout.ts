import type { EmotionLink, EmotionNode } from '../types';

type SimulationNode = EmotionNode & {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type LayoutResult = {
  nodes: SimulationNode[];
};

export const computeLayout = (
  nodes: EmotionNode[],
  links: EmotionLink[],
  width: number,
  height: number,
): LayoutResult => {
  const simNodes: SimulationNode[] = nodes.map((node, index) => ({
    ...node,
    x: width / 2 + Math.cos((index / nodes.length) * Math.PI * 2) * 120,
    y: height / 2 + Math.sin((index / nodes.length) * Math.PI * 2) * 80,
    vx: 0,
    vy: 0,
  }));

  const nodeMap = new Map(simNodes.map((node) => [node.id, node]));
  const repulsion = 2600;
  const springLength = 220;
  const springStrength = 0.03;
  const centerStrength = 0.006;
  const damping = 0.85;

  const steps = 300;
  for (let step = 0; step < steps; step += 1) {
    for (let i = 0; i < simNodes.length; i += 1) {
      const nodeA = simNodes[i];
      for (let j = i + 1; j < simNodes.length; j += 1) {
        const nodeB = simNodes[j];
        let dx = nodeA.x - nodeB.x;
        let dy = nodeA.y - nodeB.y;
        const distSq = Math.max(dx * dx + dy * dy, 0.01);
        const force = repulsion / distSq;
        const dist = Math.sqrt(distSq);
        dx /= dist;
        dy /= dist;
        nodeA.vx += dx * force;
        nodeA.vy += dy * force;
        nodeB.vx -= dx * force;
        nodeB.vy -= dy * force;
      }
    }

    links.forEach((link) => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!source || !target) return;
      let dx = target.x - source.x;
      let dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const diff = distance - springLength;
      const force = springStrength * diff * (0.5 + link.weight);
      dx /= distance;
      dy /= distance;
      source.vx += dx * force;
      source.vy += dy * force;
      target.vx -= dx * force;
      target.vy -= dy * force;
    });

    simNodes.forEach((node) => {
      const dx = width / 2 - node.x;
      const dy = height / 2 - node.y;
      node.vx += dx * centerStrength;
      node.vy += dy * centerStrength;

      node.vx *= damping;
      node.vy *= damping;
      node.x += node.vx * 0.02;
      node.y += node.vy * 0.02;

      node.x = Math.max(40, Math.min(width - 40, node.x));
      node.y = Math.max(40, Math.min(height - 40, node.y));
    });
  }

  return { nodes: simNodes };
};
