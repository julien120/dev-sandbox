import './style.css';

type FormData = {
  name: string;
  birthday: string;
  gender: string;
  nationality: string;
  skill: string;
  status: string;
  permitType: string;
  validUntil: string;
  cardValidUntil: string;
  photoDataUrl?: string;
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) throw new Error('#app not found');

app.innerHTML = `
  <header>
    <h1>在留カード風レシート発行</h1>
    <p class="subtitle">入力と撮影だけでプレビュー生成。印刷はバックエンドの /api/print に送信します。</p>
  </header>
  <div class="layout">
    <div class="card">
      <div class="grid">
        <div>
          <label for="name">氏名</label>
          <input id="name" value="福山 空" />
        </div>
        <div>
          <label for="birthday">生年月日</label>
          <input id="birthday" type="date" value="1998-04-14" />
        </div>
        <div>
          <label for="gender">性別</label>
          <select id="gender">
            <option>男</option>
            <option>女</option>
            <option>その他</option>
          </select>
        </div>
        <div>
          <label for="nationality">国籍・地域</label>
          <input id="nationality" value="日本" />
        </div>
        <div>
          <label for="skill">特技</label>
          <input id="skill" value="Twitter" />
        </div>
        <div>
          <label for="status">在留資格</label>
          <input id="status" value="友達" />
        </div>
        <div>
          <label for="permitType">在留期間</label>
          <input id="permitType" value="3年" />
        </div>
        <div>
          <label for="validUntil">満了日</label>
          <input id="validUntil" type="date" value="2027-04-26" />
        </div>
        <div>
          <label for="cardValidUntil">カード有効期限</label>
          <input id="cardValidUntil" value="2027年04月26日まで有効" />
        </div>
      </div>
      <div class="actions" style="margin-top:12px">
        <button id="captureBtn" type="button">カメラ撮影</button>
        <button id="uploadBtn" type="button" class="secondary">画像を選択</button>
        <input id="fileInput" type="file" accept="image/*" hidden />
        <button id="previewBtn" type="button">プレビュー表示</button>
        <button id="printBtn" type="button" class="secondary">印刷する</button>
      </div>
      <div class="inline">
        <span class="status" id="status">未操作</span>
        <span class="pill">POST /api/preview / /api/print に JSON を送信</span>
      </div>
    </div>
    <div class="card preview-panel">
      <div class="inline" style="justify-content: space-between;">
        <span class="status">カードプレビュー</span>
        <button id="downloadBtn" type="button" class="secondary">PNG保存</button>
      </div>
      <div class="preview-box">
        <canvas id="canvas" width="600" height="360"></canvas>
      </div>
    </div>
  </div>
`;

const statusEl = document.querySelector<HTMLSpanElement>('#status')!;
const fileInput = document.querySelector<HTMLInputElement>('#fileInput')!;
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;
let photoDataUrl: string | undefined;

const readForm = (): FormData => ({
  name: value('name'),
  birthday: value('birthday'),
  gender: value('gender'),
  nationality: value('nationality'),
  skill: value('skill'),
  status: value('status'),
  permitType: value('permitType'),
  validUntil: value('validUntil'),
  cardValidUntil: value('cardValidUntil'),
  photoDataUrl,
});

function value(id: string) {
  return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement).value;
}

function setStatus(msg: string) {
  statusEl.textContent = msg;
}

async function handleFile(file: File) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  await img.decode();
  const size = 240;
  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const offCtx = off.getContext('2d')!;
  offCtx.fillStyle = '#fff';
  offCtx.fillRect(0, 0, size, size);
  const scale = Math.min(img.width, img.height);
  const sx = (img.width - scale) / 2;
  const sy = (img.height - scale) / 2;
  offCtx.drawImage(img, sx, sy, scale, scale, 0, 0, size, size);
  photoDataUrl = off.toDataURL('image/png');
  URL.revokeObjectURL(url);
  drawCard();
  setStatus('写真を読み込みました');
}

document.getElementById('uploadBtn')!.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (file) void handleFile(file);
});

document.getElementById('captureBtn')!.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();
    const off = document.createElement('canvas');
    off.width = video.videoWidth;
    off.height = video.videoHeight;
    off.getContext('2d')!.drawImage(video, 0, 0);
    photoDataUrl = off.toDataURL('image/png');
    stream.getTracks().forEach((t) => t.stop());
    drawCard();
    setStatus('カメラから取得しました');
  } catch (error) {
    console.error(error);
    setStatus('カメラ取得に失敗しました');
  }
});

document.getElementById('previewBtn')!.addEventListener('click', () => {
  drawCard();
  setStatus('プレビュー更新');
});

document.getElementById('downloadBtn')!.addEventListener('click', () => {
  drawCard();
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'residence-card.png';
  a.click();
});

document.getElementById('printBtn')!.addEventListener('click', async () => {
  drawCard();
  const payload = readForm();
  const btn = document.getElementById('printBtn') as HTMLButtonElement;
  try {
    btn.disabled = true;
    setStatus('印刷リクエスト送信中...');
    const res = await fetch('/api/print', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(res.statusText);
    setStatus('印刷リクエストを送信しました');
  } catch (error) {
    console.error(error);
    setStatus('印刷リクエストに失敗しました（バックエンドを起動してください）');
    alert('印刷バックエンドに接続できませんでした。\nNode サーバーを起動し、/api/print を受け付けるようにしてください。');
  } finally {
    btn.disabled = false;
  }
});

function drawCard() {
  const data = readForm();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, 48);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Noto Sans JP", sans-serif';
  ctx.fillText('在留カード (SAMPLE)', 16, 30);

  ctx.fillStyle = '#111827';
  ctx.font = 'bold 22px "Noto Sans JP", sans-serif';
  ctx.fillText(data.name, 24, 92);

  ctx.font = '14px "Noto Sans JP", sans-serif';
  ctx.fillStyle = '#374151';
  ctx.fillText(`生年月日: ${data.birthday}`, 24, 120);
  ctx.fillText(`性別: ${data.gender}`, 24, 144);
  ctx.fillText(`国籍・地域: ${data.nationality}`, 24, 168);
  ctx.fillText(`特技: ${data.skill}`, 24, 192);
  ctx.fillText(`在留資格: ${data.status}`, 24, 216);
  ctx.fillText(`在留期間: ${data.permitType}`, 24, 240);
  ctx.fillText(`在留期間満了日: ${data.validUntil}`, 24, 264);
  ctx.fillText(`カード有効期限: ${data.cardValidUntil}`, 24, 288);

  if (data.photoDataUrl) {
    const img = new Image();
    img.src = data.photoDataUrl;
    img.onload = () => {
      ctx.drawImage(img, canvas.width - 200, 72, 160, 160);
    };
  } else {
    ctx.strokeStyle = '#9ca3af';
    ctx.strokeRect(canvas.width - 200, 72, 160, 160);
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('写真未設定', canvas.width - 170, 156);
  }

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 60, canvas.width - 24, canvas.height - 72);
}

drawCard();
