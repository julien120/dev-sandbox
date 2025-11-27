import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app が見つかりません');
}

app.innerHTML = `
  <main class="wrap">
    <header>
      <p class="eyebrow">Face Auth Prototype</p>
      <h1>You Are Julien?</h1>
      <p>
        Webカメラ映像をリアルタイムに解析し、あなたがジュリアン本人かどうかを推定します。現状はダミー解析のため、
        後日提供される顔埋め込みデータセットとモデルに差し替える前提のプロトタイプです。
      </p>
    </header>
    <section class="stage">
      <div class="hud">
        <div class="score-panel">
          <span class="score-label">ジュリアン度</span>
          <span class="score-value" id="scoreValue">--</span>
        </div>
        <button id="recalibrate" type="button">サンプル調整</button>
      </div>
      <div class="video-shell">
        <video id="camera" autoplay playsinline></video>
        <div class="message" id="verdict">カメラ初期化中...</div>
      </div>
      <div class="status-log" id="statusLog"></div>
    </section>
    <section class="tech-note">
      <h2>学習予定データ</h2>
      <p>
        近日中にジュリアン氏本人と他者の顔埋め込みベクトル（SentenceFace など）を受け取り、下記のステップで本認証ロジックへ入れ替えます。
      </p>
      <ol>
        <li>Webカメラのフレームを整形し、提供予定の多層 CNN / Transformer 埋め込み器に投入。</li>
        <li>ジュリアン本人の埋め込み集合とのコサイン類似度を計算し、スコアを 0-100 にマッピング。</li>
        <li>MMR で多様性を確保した本人サンプルをリファレンスに用い、なりすまし耐性を検証。</li>
      </ol>
    </section>
  </main>
`;

const video = document.querySelector<HTMLVideoElement>('#camera');
const verdictEl = document.querySelector<HTMLDivElement>('#verdict');
const scoreEl = document.querySelector<HTMLSpanElement>('#scoreValue');
const statusLog = document.querySelector<HTMLDivElement>('#statusLog');
const recalibrateBtn = document.querySelector<HTMLButtonElement>('#recalibrate');

if (!video || !verdictEl || !scoreEl || !statusLog || !recalibrateBtn) {
  throw new Error('初期DOM参照の取得に失敗しました');
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let rafId: number | null = null;
let smoothScore = 50;
let pseudoSeed = Math.random() * 1000;

const log = (msg: string) => {
  const time = new Date().toLocaleTimeString('ja-JP');
  statusLog.textContent = `[${time}] ${msg}`;
};

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 } });
    video.srcObject = stream;
    await video.play();
    canvas.width = 320;
    canvas.height = 180;
    analyzeLoop();
    log('カメラ入力を取得しました');
  } catch {
    log('カメラの取得に失敗しました。ブラウザの権限をご確認ください');
    verdictEl.textContent = 'カメラアクセス未許可';
  }
};

const analyzeLoop = () => {
  if (!ctx || video.readyState < 2) {
    rafId = requestAnimationFrame(analyzeLoop);
    return;
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const nextScore = computePseudoJulienScore(frame.data);
  smoothScore = smoothScore * 0.85 + nextScore * 0.15;
  updateUI(Math.round(smoothScore));
  rafId = requestAnimationFrame(analyzeLoop);
};

const computePseudoJulienScore = (data: Uint8ClampedArray) => {
  let sum = 0;
  for (let i = 0; i < data.length; i += 20) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    sum += r * 0.3 + g * 0.59 + b * 0.11;
  }
  const avg = sum / (data.length / 20);
  const wave = Math.sin(pseudoSeed + avg / 255) * 15 + 15;
  return Math.max(0, Math.min(100, (avg / 255) * 70 + wave));
};

const updateUI = (score: number) => {
  scoreEl.textContent = `${score.toFixed(0)}`;
  const isJulien = score >= 65;
  verdictEl.textContent = isJulien ? 'あなたはジュリアン本人です' : 'あなたはジュリアンじゃないです！';
  verdictEl.classList.toggle('is-julien', isJulien);
};

recalibrateBtn.addEventListener('click', () => {
  pseudoSeed = Math.random() * 1000;
  log('サンプル調整を行いました');
});

startCamera();

window.addEventListener('beforeunload', () => {
  if (rafId) cancelAnimationFrame(rafId);
  const stream = video.srcObject as MediaStream | null;
  stream?.getTracks().forEach((track) => track.stop());
});
