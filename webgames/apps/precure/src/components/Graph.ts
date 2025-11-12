import { getEmotionColor } from '../colorMap';
import { getEmotionLabelJp } from '../labels';
import type { EmotionLink, EraGraph } from '../types';
import { computeLayout } from '../utils/layout';

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 600;

export type GraphCallbacks = {
  onHover?: (emotionId: string | null) => void;
};

export class Graph {
  private container: HTMLElement;

  private svg: SVGSVGElement;

  private linkGroup: SVGGElement;

  private nodeGroup: SVGGElement;

  private labelGroup: SVGGElement;

  private tooltip: HTMLDivElement;

  private data: EraGraph | null = null;

  private nodeElements = new Map<string, { circle: SVGCircleElement; label: SVGTextElement }>();

  private linkElements: { element: SVGLineElement; data: EmotionLink }[] = [];

  private hoveredId: string | null = null;

  private externalHighlight: string | null = null;

  private searchTerm = '';

  private callbacks: GraphCallbacks;

  constructor(container: HTMLElement, title: string, callbacks: GraphCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.container.classList.add('graph-card');

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    this.container.appendChild(titleEl);

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`);
    this.svg.setAttribute('role', 'img');
    this.svg.setAttribute('aria-label', `${title} 感情ネットワーク`);

    this.linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.linkGroup.classList.add('graph-links');
    this.nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.nodeGroup.classList.add('graph-nodes');
    this.labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.labelGroup.classList.add('graph-labels');

    this.svg.append(this.linkGroup, this.nodeGroup, this.labelGroup);
    this.container.appendChild(this.svg);

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip hidden';
    this.container.appendChild(this.tooltip);
  }

  public setData(graph: EraGraph) {
    this.data = graph;
    const header = this.container.querySelector('h3');
    if (header) {
      header.textContent = graph.label;
    }
    this.render();
  }

  public highlightEmotion(id: string | null) {
    this.externalHighlight = id;
    this.updateVisualState();
  }

  public setSearchTerm(term: string) {
    this.searchTerm = term.trim().toLowerCase();
    this.updateVisualState();
  }

  public getSvg(): SVGSVGElement {
    return this.svg;
  }

  private render() {
    this.nodeElements.clear();
    this.linkElements = [];
    this.linkGroup.innerHTML = '';
    this.nodeGroup.innerHTML = '';
    this.labelGroup.innerHTML = '';

    if (!this.data) {
      return;
    }

    const layout = computeLayout(this.data.nodes, this.data.links, VIEWBOX_WIDTH, VIEWBOX_HEIGHT);
    const scaledNodes = scaleNodes(layout.nodes, VIEWBOX_WIDTH, VIEWBOX_HEIGHT);
    const nodeMap = new Map(scaledNodes.map((node) => [node.id, node]));

    this.data.links.forEach((link) => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!source || !target) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('d', buildBezierPath(source.x, source.y, target.x, target.y));
      line.setAttribute('stroke-width', `${1 + link.weight * 4}`);
      line.dataset.source = link.source;
      line.dataset.target = link.target;
      this.linkGroup.appendChild(line);
      this.linkElements.push({ element: line, data: link });
    });

    scaledNodes.forEach((node) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const radius = 20 + node.value * 0.75;
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', radius.toString());
      circle.dataset.id = node.id;
      circle.style.fill = node.color ?? getEmotionColor(node.id, node.color);

      circle.addEventListener('mouseenter', (event) => {
        this.hoveredId = node.id;
        this.showTooltip(node, event);
        this.callbacks.onHover?.(node.id);
        this.updateVisualState();
      });

      circle.addEventListener('mouseleave', () => {
        this.hoveredId = null;
        this.hideTooltip();
        this.callbacks.onHover?.(null);
        this.updateVisualState();
      });

      this.nodeGroup.appendChild(circle);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', node.x.toString());
      const baseLabelY = Math.min(
        VIEWBOX_HEIGHT - 30,
        Math.max(30, node.y + radius + 20),
      );
      label.setAttribute('y', baseLabelY.toString());
      label.classList.add('graph-label');
      const jp = node.label ?? getEmotionLabelJp(node.id) ?? '';
      const en = node.id;
      const phrase = node.phrase ?? '';
      const spans = [] as string[];
      if (jp) {
        spans.push(`<tspan class="graph-label-jp" x="${node.x}" dy="0">${jp}</tspan>`);
        spans.push(`<tspan class="graph-label-en" x="${node.x}" dy="1.2em">${en}</tspan>`);
      } else {
        spans.push(`<tspan class="graph-label-en" x="${node.x}" dy="0">${en}</tspan>`);
      }
      if (phrase) {
        spans.push(`<tspan class="graph-label-phrase" x="${node.x}" dy="1.3em">${phrase}</tspan>`);
      }
      label.innerHTML = spans.join('');
      this.labelGroup.appendChild(label);

      this.nodeElements.set(node.id, { circle, label });
    });

    this.updateVisualState();
  }

  private updateVisualState() {
    if (!this.data) return;
    const activeIds = new Set<string>();
    if (this.hoveredId) {
      activeIds.add(this.hoveredId);
    }
    if (this.externalHighlight) {
      activeIds.add(this.externalHighlight);
    }
    if (this.searchTerm) {
      this.data.nodes
        .filter((node) => node.id.toLowerCase().includes(this.searchTerm))
        .forEach((node) => activeIds.add(node.id));
    }

    const neighborIds = new Set<string>();
    this.linkElements.forEach(({ data }) => {
      if (activeIds.has(data.source)) {
        neighborIds.add(data.target);
      }
      if (activeIds.has(data.target)) {
        neighborIds.add(data.source);
      }
    });
    const fullActive = new Set([...activeIds, ...neighborIds]);
    const hasFocus = fullActive.size > 0;

    this.nodeElements.forEach(({ circle, label }, id) => {
      const isActive = fullActive.has(id);
      circle.classList.toggle('is-active', hasFocus && isActive);
      circle.classList.toggle('is-dimmed', hasFocus && !isActive);
      const phraseLines = this.data?.nodes.find((node) => node.id === id)?.phrase ?? '';
      label.dataset.phrase = phraseLines;
      label.classList.toggle('is-active', hasFocus && isActive);
      label.classList.toggle('is-dimmed', hasFocus && !isActive);
    });

    this.linkElements.forEach(({ element, data }) => {
      const isLinkActive = fullActive.has(data.source) || fullActive.has(data.target);
      element.classList.toggle('is-active', hasFocus && isLinkActive);
      element.classList.toggle('is-dimmed', hasFocus && !isLinkActive);
    });
  }

  private showTooltip(
    node: { id: string; value: number },
    event: MouseEvent,
  ) {
    const storedLabel = this.data?.nodes.find((n) => n.id === node.id)?.label;
    const jp = storedLabel ?? getEmotionLabelJp(node.id);
    this.tooltip.textContent = `${jp ?? node.id}${jp ? ` / ${node.id}` : ''} — 指標 ${node.value.toFixed(1)}`;
    this.tooltip.classList.remove('hidden');
    const bounds = this.container.getBoundingClientRect();
    const x = event.clientX - bounds.left + 12;
    const y = event.clientY - bounds.top + 12;
    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top = `${y}px`;
  }

  private hideTooltip() {
    this.tooltip.classList.add('hidden');
  }
}

const buildBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = y2 - y1;
  const dy = x1 - x2;
  const curveStrength = 0.1;
  const c1x = midX + dx * curveStrength;
  const c1y = midY + dy * curveStrength;
  return `M ${x1} ${y1} Q ${c1x} ${c1y} ${x2} ${y2}`;
};

const scaleNodes = (
  nodes: { id: string; x: number; y: number }[],
  width: number,
  height: number,
) => {
  const minX = Math.min(...nodes.map((node) => node.x));
  const maxX = Math.max(...nodes.map((node) => node.x));
  const minY = Math.min(...nodes.map((node) => node.y));
  const maxY = Math.max(...nodes.map((node) => node.y));
  const margin = 40;
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scaleX = (width - margin * 2) / spanX;
  const scaleY = (height - margin * 2) / spanY;

  return nodes.map((node) => ({
    ...node,
    x: (node.x - minX) * scaleX + margin,
    y: (node.y - minY) * scaleY + margin,
  }));
};
