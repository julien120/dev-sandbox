import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app not found');
}

app.innerHTML = `
  <div class="overlay">
    <strong>「うんこ」と叫んでください</strong>
    <p>マイク許可後、声が十分に大きく「うんこ」と聞こえた時だけ、上から白い円が落ちてきます。声量が大きいほど円も大きくなります。</p>
    <div class="status" id="status">マイク初期化中...</div>
  </div>
  <canvas id="stage"></canvas>
`;

const canvas = document.querySelector<HTMLCanvasElement>('#stage');
const ctx = canvas?.getContext('2d');
const statusEl = document.querySelector<HTMLDivElement>('#status');

if (!canvas || !ctx || !statusEl) {
  throw new Error('initial elements missing');
}

type Drop = {
  x: number;
  y: number;
  radius: number;
  vy: number;
  rotation: number;
  angular: number;
  resting: boolean;
};

const drops: Drop[] = [];

let analyser: AnalyserNode | null = null;
let audioData: Uint8Array | null = null;
let lastVolume = 0;
let animationFrame: number | null = null;
let lastTrigger = 0;

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize);
resize();

const getVolume = () => {
  if (!analyser || !audioData) return 0;
  analyser.getByteTimeDomainData(audioData);
  let sum = 0;
  for (let i = 0; i < audioData.length; i += 1) {
    const v = audioData[i] - 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / audioData.length);
  return rms;
};

const monitorVolume = () => {
  lastVolume = getVolume();
  requestAnimationFrame(monitorVolume);
};

const startAudio = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  audioData = new Uint8Array(analyser.fftSize);
  source.connect(analyser);
  monitorVolume();
  statusEl.textContent = '「うんこ」と発声してください (音声認識ON)';
};

const spawnDrop = (volume: number) => {
  const normalized = Math.min(1, volume / 80);
  const radius = 20 + normalized * 220;
  drops.push({
    x: Math.random() * canvas.width,
    y: -radius,
    radius,
    vy: 2 + normalized * 4,
    rotation: Math.random() * Math.PI,
    angular: (Math.random() - 0.5) * 0.02,
    resting: false,
  });
};

const updateDrops = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#050505');
  gradient.addColorStop(1, '#0f0f10');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.9);
  ctx.lineTo(canvas.width, canvas.height * 0.9);
  ctx.stroke();

  const floor = canvas.height * 0.9;
  drops.forEach((drop) => {
    if (!drop.resting) {
      drop.vy += 0.25;
      drop.y += drop.vy;
      drop.rotation += drop.angular;
      if (drop.y + drop.radius >= floor) {
        drop.y = floor - drop.radius;
        drop.vy *= -0.25;
        if (Math.abs(drop.vy) < 0.6) {
          drop.resting = true;
          drop.vy = 0;
          drop.angular = 0;
        }
      }
    }
  });

  drops.forEach((drop) => {
    ctx.save();
    ctx.translate(drop.x, drop.y);
    ctx.rotate(drop.rotation);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.strokeStyle = drop.resting ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, drop.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#050505';
    ctx.font = `${drop.radius * 0.9}px "Noto Sans JP", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('うんこ', 0, drop.radius * 0.05);
    ctx.restore();
  });

  for (let i = drops.length - 1; i >= 0; i -= 1) {
    if (drops[i].y - drops[i].radius > canvas.height + 50) {
      drops.splice(i, 1);
    }
  }

  animationFrame = requestAnimationFrame(updateDrops);
};

type SpeechRecognitionConstructor = new () => SpeechRecognition;

const startRecognition = () => {
  const globalWithSpeech = window as typeof window & {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  };

  const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
    globalWithSpeech.SpeechRecognition ?? globalWithSpeech.webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) {
    statusEl.textContent = 'このブラウザは音声認識に対応していません';
    return;
  }

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = 'ja-JP';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      if (!result.isFinal) continue;
      const transcript = result[0].transcript.trim();
      if (/う.?ん.?こ/.test(transcript)) {
        const now = Date.now();
        if (now - lastTrigger < 400) continue;
        lastTrigger = now;
        spawnDrop(lastVolume);
      }
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    statusEl.textContent = `音声認識エラー: ${event.error}`;
  };

  recognition.onend = () => {
    recognition.start();
  };

  recognition.start();
};

const init = async () => {
  try {
    await startAudio();
    startRecognition();
    updateDrops();
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'マイクアクセスに失敗しました';
  }
};

init();

window.addEventListener('beforeunload', () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});
