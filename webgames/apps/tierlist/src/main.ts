import './style.css';

type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

type TierItem = {
  id: string;
  src: string;
  fileName: string;
};

type Placement = Tier | null;

const tiers: Tier[] = ['S', 'A', 'B', 'C', 'D', 'E'];
const placements: Record<Tier, string[]> = {
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
  E: [],
};
const itemPlacement = new Map<string, Placement>();
const library: TierItem[] = [];

let draggingId: string | null = null;

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app が見つかりません');
}

app.innerHTML = `
  <section class="board" aria-label="Tier ボード"></section>
  <section class="pool" aria-label="画像一覧">
    <div class="pool-header">
      <span class="pill">ドラッグで Tier 行へ配置・並べ替え</span>
      <span>画像一覧（アップロード順）</span>
    </div>
    <div class="pool-track" id="pool-track"></div>
  </section>
  <section class="upload-panel">
    <label class="dropzone" id="dropzone" for="file-input" aria-label="画像をアップロード">
      <div>
        <strong>ここに画像をドラッグ＆ドロップ</strong><br />
        またはクリックして選択（jpg / png / webp, 10MBまで）
      </div>
      <input id="file-input" type="file" accept=".png,.jpg,.jpeg,.webp" multiple hidden />
    </label>
    <div class="status" id="status">サムネイルは自動で正方形にトリミングされます</div>
  </section>
`;

const board = app.querySelector<HTMLElement>('.board');
const poolTrack = app.querySelector<HTMLElement>('#pool-track');
const dropzone = app.querySelector<HTMLLabelElement>('#dropzone');
const fileInput = app.querySelector<HTMLInputElement>('#file-input');
const status = app.querySelector<HTMLDivElement>('#status');

if (!board || !poolTrack || !dropzone || !fileInput || !status) {
  throw new Error('初期化に必要な要素が不足しています');
}

const boardEl = board!;
const poolTrackEl = poolTrack!;
const dropzoneEl = dropzone!;
const fileInputEl = fileInput!;
const statusEl = status!;

const tierContainers: Record<Tier, HTMLElement> = {
  S: document.createElement('div'),
  A: document.createElement('div'),
  B: document.createElement('div'),
  C: document.createElement('div'),
  D: document.createElement('div'),
  E: document.createElement('div'),
};

tiers.forEach((tier) => {
  const row = document.createElement('div');
  row.className = 'tier-row';

  const label = document.createElement('div');
  label.className = `tier-label ${tier.toLowerCase()}`;
  label.textContent = tier;
  label.setAttribute('aria-label', `${tier} ランク`);

  const dropArea = document.createElement('div');
  dropArea.className = 'tier-drop';
  dropArea.dataset.tier = tier;
  dropArea.setAttribute('role', 'list');
  dropArea.setAttribute('aria-label', `${tier} ランクのドロップエリア`);

  attachDropEvents(dropArea, (clientX) => placeItem(draggingId, tier, clientX));

  tierContainers[tier] = dropArea;
  row.append(label, dropArea);
  boardEl.appendChild(row);
});

attachDropEvents(poolTrackEl, () => moveToPool(draggingId));

fileInputEl.addEventListener('change', async (event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    await handleFiles(target.files);
    target.value = '';
  }
});

dropzoneEl.addEventListener('click', () => fileInputEl.click());

dropzoneEl.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzoneEl.classList.add('is-over');
});

dropzoneEl.addEventListener('dragleave', () => dropzoneEl.classList.remove('is-over'));

dropzoneEl.addEventListener('drop', async (event) => {
  event.preventDefault();
  dropzoneEl.classList.remove('is-over');
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    await handleFiles(files);
  }
});

window.addEventListener('dragover', (event) => {
  event.preventDefault();
});

window.addEventListener('drop', (event) => {
  // 画像以外の場所に落とした場合のブラウザ遷移を防ぐ
  if (!(event.target as HTMLElement)?.closest('.tier-drop, .pool-track, .dropzone, .thumb')) {
    event.preventDefault();
  }
});

function getDragId(event: DragEvent): string | null {
  const text = event.dataTransfer?.getData('text/plain');
  return text && text.length > 0 ? text : draggingId;
}

function attachDropEvents(container: HTMLElement, onDrop: (clientX: number) => void) {
  container.addEventListener('dragover', (event) => {
    event.preventDefault();
    container.classList.add('is-over');
  });

  container.addEventListener('dragleave', () => {
    container.classList.remove('is-over');
  });

  container.addEventListener('drop', (event) => {
    event.preventDefault();
    container.classList.remove('is-over');
    draggingId = getDragId(event);
    onDrop(event.clientX);
  });
}

function createThumb(item: TierItem, options?: { badge?: string; deletable?: boolean }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'thumb';
  wrapper.draggable = true;
  wrapper.dataset.id = item.id;
  wrapper.setAttribute('role', 'listitem');
  wrapper.setAttribute('aria-label', `${item.fileName} のサムネイル`);

  const img = document.createElement('img');
  img.src = item.src;
  img.alt = item.fileName;
  img.width = 96;
  img.height = 96;

  wrapper.appendChild(img);

  if (options?.badge) {
    const badgeEl = document.createElement('span');
    badgeEl.className = 'badge';
    badgeEl.textContent = options.badge;
    wrapper.appendChild(badgeEl);
  }

  if (options?.deletable) {
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', `${item.fileName} を削除`);
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      removeItem(item.id);
    });
    wrapper.appendChild(deleteBtn);
  }

  wrapper.addEventListener('dragstart', (event) => {
    draggingId = item.id;
    wrapper.classList.add('dragging');
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', item.id);
      event.dataTransfer.setData('application/tier-item', item.id);
      event.dataTransfer.setDragImage(wrapper, wrapper.clientWidth / 2, wrapper.clientHeight / 2);
      event.dataTransfer.effectAllowed = 'move';
    }
  });

  wrapper.addEventListener('dragend', () => {
    draggingId = null;
    wrapper.classList.remove('dragging');
  });

  return wrapper;
}

function renderPlacements() {
  tiers.forEach((tier) => {
    const container = tierContainers[tier];
    container.innerHTML = '';
    const ids = placements[tier];
    if (ids.length === 0) {
      const hint = document.createElement('div');
      hint.className = 'empty-hint';
      hint.textContent = `${tier} ランクへドラッグ`;
      container.appendChild(hint);
      return;
    }
    ids.forEach((id) => {
      const item = library.find((entry) => entry.id === id);
      if (!item) return;
      const thumb = createThumb(item);
      container.appendChild(thumb);
    });
  });
}

function renderPool() {
  poolTrackEl.innerHTML = '';
  if (library.length === 0) {
    const hint = document.createElement('div');
    hint.className = 'empty-hint';
    hint.textContent = 'ここにアップロードした画像が並びます。';
    poolTrackEl.appendChild(hint);
    return;
  }

  library.forEach((item) => {
    const badge = itemPlacement.get(item.id) ?? null;
    const thumb = createThumb(item, { badge: badge ?? undefined, deletable: true });
    poolTrackEl.appendChild(thumb);
  });
}

function placeItem(id: string | null, tier: Tier, clientX: number) {
  if (!id) return;
  const item = library.find((entry) => entry.id === id);
  if (!item) return;

  const currentTier = itemPlacement.get(id);
  if (currentTier) {
    placements[currentTier] = placements[currentTier].filter((entry) => entry !== id);
  }

  const container = tierContainers[tier];
  const insertIndex = computeInsertIndex(container, clientX, id);

  placements[tier].splice(insertIndex, 0, id);
  itemPlacement.set(id, tier);
  renderPlacements();
  renderPool();
}

function moveToPool(id: string | null) {
  if (!id) return;
  const currentTier = itemPlacement.get(id);
  if (currentTier) {
    placements[currentTier] = placements[currentTier].filter((entry) => entry !== id);
    itemPlacement.set(id, null);
    renderPlacements();
    renderPool();
  }
}

function computeInsertIndex(container: HTMLElement, clientX: number, skipId: string): number {
  const children = Array.from(container.querySelectorAll<HTMLElement>('.thumb')).filter(
    (child) => child.dataset.id !== skipId,
  );

  if (children.length === 0) return 0;

  for (let index = 0; index < children.length; index += 1) {
    const rect = children[index].getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    if (clientX < midpoint) {
      return index;
    }
  }

  return children.length;
}

function removeItem(id: string) {
  const placement = itemPlacement.get(id);
  if (placement) {
    placements[placement] = placements[placement].filter((entry) => entry !== id);
  }
  itemPlacement.delete(id);
  const index = library.findIndex((entry) => entry.id === id);
  if (index >= 0) {
    library.splice(index, 1);
  }
  renderPlacements();
  renderPool();
  statusEl.textContent = '画像を削除しました';
}

function isSupportedType(file: File) {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
}

async function handleFiles(files: FileList) {
  const tasks: Promise<void>[] = [];
  const addedNames: string[] = [];

  Array.from(files).forEach((file) => {
    if (!isSupportedType(file)) return;
    if (file.size > 10 * 1024 * 1024) return;

    tasks.push(
      (async () => {
        const src = await cropToSquare(file);
        const id = crypto.randomUUID();
        library.push({ id, src, fileName: file.name });
        itemPlacement.set(id, null);
        addedNames.push(file.name);
      })(),
    );
  });

  if (tasks.length === 0) {
    statusEl.textContent = '対応形式: jpg / png / webp ・ 10MBまで';
    return;
  }

  await Promise.all(tasks);
  statusEl.textContent = `${addedNames.length}件の画像を追加しました`;
  renderPool();
}

async function cropToSquare(file: File): Promise<string> {
  const image = new Image();
  const url = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      image.src = url;
    });

    const size = Math.min(image.width, image.height);
    const target = Math.min(size, 512);
    const startX = (image.width - size) / 2;
    const startY = (image.height - size) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = target;
    canvas.height = target;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas の初期化に失敗しました');

    ctx.drawImage(image, startX, startY, size, size, 0, 0, target, target);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}

renderPlacements();
renderPool();
