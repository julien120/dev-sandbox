import { EMOTION_COLORS } from '../colorMap';
import { getEmotionLabelJp } from '../labels';

export class Legend {
  constructor(container: HTMLElement) {
    container.classList.add('legend-panel');
    const title = document.createElement('h4');
    title.textContent = '感情カラーマップ';
    container.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'legend-list';
    Object.entries(EMOTION_COLORS).forEach(([emotion, color]) => {
      const item = document.createElement('li');
      const swatch = document.createElement('span');
      swatch.className = 'legend-swatch';
      swatch.style.backgroundColor = color;
      const label = document.createElement('span');
      const jp = getEmotionLabelJp(emotion);
      label.textContent = jp ? `${emotion} / ${jp}` : emotion;
      item.append(swatch, label);
      list.appendChild(item);
    });
    container.appendChild(list);
  }
}
