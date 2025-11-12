import { downloadPng, downloadSvg } from '../utils/export';

type ToolbarOptions = {
  onSearch: (term: string) => void;
  getExportTargets: () => { label: string; svg: SVGSVGElement }[];
};

export class Toolbar {
  private searchInput: HTMLInputElement;

  constructor(container: HTMLElement, options: ToolbarOptions) {
    container.classList.add('toolbar');

    const searchWrapper = document.createElement('label');
    searchWrapper.textContent = '感情検索';
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'search';
    this.searchInput.placeholder = 'Hope / Joy / 勇気 / 喜び ...';
    this.searchInput.addEventListener('input', () => {
      options.onSearch(this.searchInput.value);
    });
    searchWrapper.appendChild(this.searchInput);

    const buttons = document.createElement('div');
    buttons.className = 'toolbar-buttons';

    const svgButton = document.createElement('button');
    svgButton.type = 'button';
    svgButton.textContent = 'SVGダウンロード';
    svgButton.addEventListener('click', () => {
      options.getExportTargets().forEach((target) => {
        downloadSvg(target.svg, `precure-emotion-${target.label.replace(/\s+/g, '-').toLowerCase()}`);
      });
    });

    const pngButton = document.createElement('button');
    pngButton.type = 'button';
    pngButton.textContent = 'PNGダウンロード';
    pngButton.addEventListener('click', () => {
      options.getExportTargets().forEach((target) => {
        downloadPng(target.svg, `precure-emotion-${target.label.replace(/\s+/g, '-').toLowerCase()}`);
      });
    });

    buttons.append(svgButton, pngButton);

    container.append(searchWrapper, buttons);
  }
}
