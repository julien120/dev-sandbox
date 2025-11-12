import type { EraGraph } from '../types';
import { Graph } from './Graph';

export class EraCompare {
  private container: HTMLElement;

  private data: EraGraph[];

  private graphs: Graph[] = [];

  private statsList: HTMLDivElement;

  private timeline: HTMLOListElement;

  constructor(container: HTMLElement, data: EraGraph[]) {
    this.container = container;
    this.data = data;
    this.container.classList.add('compare-layout');

    this.timeline = document.createElement('ol');
    this.timeline.className = 'era-timeline';
    this.container.appendChild(this.timeline);
    this.renderTimeline();

    const graphWrapper = document.createElement('div');
    graphWrapper.className = 'graph-stack';
    this.container.appendChild(graphWrapper);

    this.statsList = document.createElement('div');
    this.statsList.className = 'era-stats';
    this.container.appendChild(this.statsList);

    this.data.forEach((era, index) => {
      const card = document.createElement('section');
      card.classList.add('era-panel');
      graphWrapper.appendChild(card);
      const graph = new Graph(card, `${era.era} — ${era.label}`, {
        onHover: (id) => this.timeline.classList.toggle('timeline-highlight', Boolean(id)),
      });
      graph.setData(era);
      this.graphs.push(graph);

      card.addEventListener('mouseenter', () => {
        this.highlightTimeline(era.era);
      });
      card.addEventListener('mouseleave', () => {
        this.highlightTimeline(null);
      });

      this.timeline.children[index]?.setAttribute('data-era', era.era);
    });

    this.updateStats();
  }

  public setSearchTerm(term: string) {
    this.graphs.forEach((graph) => graph.setSearchTerm(term));
  }

  public getExportTargets() {
    return this.graphs.map((graph, index) => ({
      label: this.data[index].label,
      svg: graph.getSvg(),
    }));
  }

  private updateStats() {
    const items = this.data
      .map((era) => {
        const top = [...era.nodes]
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .map((node) => `${node.id} (${node.value})`)
          .join(' / ');
        return `<li><strong>${era.label}</strong><span>${top}</span></li>`;
      })
      .join('');
    this.statsList.innerHTML = `
      <h4>時代別トップ感情</h4>
      <ul class="stats-list">
        ${items}
      </ul>
    `;
  }

  private renderTimeline() {
    this.timeline.innerHTML = '';
    this.data.forEach((era) => {
      const item = document.createElement('li');
      item.innerHTML = `<span class="era-year">${era.era}</span><span class="era-name">${era.label}</span>`;
      this.timeline.appendChild(item);
    });
  }

  private highlightTimeline(era: string | null) {
    this.timeline.querySelectorAll('li').forEach((li) => {
      const year = li.querySelector('.era-year')?.textContent;
      li.classList.toggle('is-active', era !== null && year === era);
    });
  }
}
