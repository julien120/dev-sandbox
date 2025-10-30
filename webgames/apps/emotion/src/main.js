import { Game, Scene, clamp, vec2 } from '@webgames/engine';
import './style.css';
const getFaceDetectorConstructor = () => {
    const ctor = globalThis.FaceDetector;
    return ctor ?? null;
};
const EXPRESSIONS = [
    { id: 'joy', emoji: '😀', label: 'よろこび', description: '口角を上げてにっこり' },
    { id: 'anger', emoji: '😡', label: 'いかり', description: '目を細めてキッと' },
    { id: 'sad', emoji: '😢', label: 'かなしい', description: '口角を下げてしょんぼり' },
    { id: 'surprise', emoji: '😲', label: 'おどろき', description: '目と口を大きく開く' },
];
const DETECTION_INTERVAL = 0.2;
const MATCH_FILL_SPEED = 0.5;
const MATCH_DECAY_SPEED = 0.35;
const INITIAL_TIME = 45;
const BONUS_TIME = 8;
const classifyExpression = (face, frameSize) => {
    if (!face.landmarks?.length) {
        return { id: 'unknown', features: null };
    }
    const bbox = face.boundingBox;
    const mouthPoints = face.landmarks
        .filter((landmark) => landmark.type === 'mouth')
        .flatMap((landmark) => Array.from(landmark.locations));
    const eyePoints = face.landmarks
        .filter((landmark) => landmark.type === 'eye')
        .flatMap((landmark) => Array.from(landmark.locations));
    if (mouthPoints.length < 3 || eyePoints.length < 4) {
        return { id: 'unknown', features: null };
    }
    const normalizeY = (value) => value / bbox.height;
    const normalizeX = (value) => value / bbox.width;
    const mouthMetrics = (() => {
        const xs = mouthPoints.map((point) => point.x);
        const ys = mouthPoints.map((point) => point.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const width = maxX - minX;
        const height = maxY - minY;
        const centerY = (maxY + minY) / 2;
        const leftCorner = mouthPoints.reduce((prev, point) => (point.x < prev.x ? point : prev), mouthPoints[0]);
        const rightCorner = mouthPoints.reduce((prev, point) => (point.x > prev.x ? point : prev), mouthPoints[0]);
        const cornerAverageY = (leftCorner.y + rightCorner.y) / 2;
        const curve = cornerAverageY - centerY;
        return {
            width: width / frameSize.x,
            height: height / frameSize.y,
            open: normalizeY(height),
            curve: normalizeY(curve),
        };
    })();
    const eyeMetrics = (() => {
        const faceCenterX = bbox.x + bbox.width / 2;
        const leftEye = eyePoints.filter((point) => point.x <= faceCenterX);
        const rightEye = eyePoints.filter((point) => point.x > faceCenterX);
        const aspectRatio = (points) => {
            if (points.length < 2) {
                return 0;
            }
            const xs = points.map((point) => point.x);
            const ys = points.map((point) => point.y);
            const width = Math.max(...xs) - Math.min(...xs);
            const height = Math.max(...ys) - Math.min(...ys);
            const normalizedWidth = normalizeX(width);
            const normalizedHeight = normalizeY(height);
            if (normalizedWidth <= 0) {
                return 0;
            }
            return normalizedHeight / normalizedWidth;
        };
        const leftAspect = aspectRatio(leftEye);
        const rightAspect = aspectRatio(rightEye);
        return {
            openness: (leftAspect + rightAspect) / 2,
        };
    })();
    const features = {
        mouthOpen: mouthMetrics.open,
        mouthCurve: mouthMetrics.curve,
        eyeOpenness: eyeMetrics.openness,
    };
    const smileScore = -features.mouthCurve;
    const frownScore = features.mouthCurve;
    const mouthOpen = features.mouthOpen;
    const eyeOpen = features.eyeOpenness;
    if (mouthOpen > 0.22 && eyeOpen > 0.27) {
        return { id: 'surprise', features };
    }
    if (smileScore > 0.02 && mouthOpen > 0.1) {
        return { id: 'joy', features };
    }
    if (eyeOpen < 0.16 && mouthOpen < 0.12) {
        return { id: 'anger', features };
    }
    if (frownScore > 0.02 && mouthOpen < 0.14) {
        return { id: 'sad', features };
    }
    return { id: 'unknown', features };
};
class EmotionScene extends Scene {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "video", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "stream", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "detector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "detectionTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "detecting", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "timeLeft", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: INITIAL_TIME
        });
        Object.defineProperty(this, "score", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "combo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "bestCombo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "matchProgress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "target", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EXPRESSIONS[0]
        });
        Object.defineProperty(this, "lastExpression", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'unknown'
        });
        Object.defineProperty(this, "lastFeatures", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "lastFace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "gameOver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "removeInputListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    async onEnter(context) {
        this.resetState();
        this.video = document.getElementById('camera-stream');
        if (!this.video) {
            this.status = 'ビデオ要素が見つかりません';
            return;
        }
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: 640,
                    height: 480,
                },
                audio: false,
            });
            this.video.srcObject = this.stream;
            await this.video.play();
        }
        catch (error) {
            this.status = 'カメラの取得に失敗しました。権限を確認してください。';
            console.error(error);
            return;
        }
        const detectorCtor = getFaceDetectorConstructor();
        if (!detectorCtor) {
            this.status = 'FaceDetector API に対応したブラウザが必要です (Chrome / Edge 推奨)。';
            return;
        }
        this.detector = new detectorCtor({
            maxDetectedFaces: 1,
            fastMode: true,
        });
        const input = context.input;
        this.removeInputListener = input.onInput((event) => this.handleInput(event));
        this.pickNextTarget();
    }
    onExit() {
        this.cleanupStream();
        this.removeInputListener?.();
        this.removeInputListener = null;
    }
    update(dt) {
        if (this.gameOver) {
            return;
        }
        this.timeLeft = clamp(this.timeLeft - dt, 0, 999);
        if (this.timeLeft <= 0) {
            this.gameOver = true;
            this.status = '時間切れ！スペースかクリックで再スタート';
            return;
        }
        if (!this.detector || !this.video || this.video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
            return;
        }
        this.detectionTimer -= dt;
        if (this.detectionTimer <= 0 && !this.detecting) {
            this.detectionTimer = DETECTION_INTERVAL;
            void this.detectExpression();
        }
    }
    render(context) {
        const renderer = context.renderer;
        const ctx = renderer.context;
        const canvas = renderer.canvas;
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        if (this.video && this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
        if (this.lastFace) {
            this.drawFaceOutline(ctx, canvas);
        }
        this.drawHud(ctx, canvas);
        this.drawStatus(ctx, canvas);
    }
    resetState() {
        this.timeLeft = INITIAL_TIME;
        this.score = 0;
        this.combo = 0;
        this.bestCombo = 0;
        this.matchProgress = 0;
        this.target = EXPRESSIONS[0];
        this.lastExpression = 'unknown';
        this.lastFeatures = null;
        this.lastFace = null;
        this.status = null;
        this.gameOver = false;
        this.detectionTimer = 0;
    }
    handleInput(event) {
        if (event instanceof PointerEvent && event.type === 'pointerdown') {
            if (this.gameOver) {
                this.resetState();
                this.pickNextTarget();
            }
            return;
        }
        if (!(event instanceof KeyboardEvent) || event.type !== 'keydown') {
            return;
        }
        const key = event.key.toLowerCase();
        if (key === ' ' || key === 'enter') {
            if (this.gameOver) {
                this.resetState();
                this.pickNextTarget();
            }
        }
    }
    async detectExpression() {
        if (!this.detector || !this.video) {
            return;
        }
        this.detecting = true;
        try {
            const faces = await this.detector.detect(this.video);
            if (faces.length === 0) {
                this.lastFace = null;
                this.lastExpression = 'unknown';
                this.lastFeatures = null;
                this.matchProgress = Math.max(0, this.matchProgress - MATCH_DECAY_SPEED * DETECTION_INTERVAL);
                return;
            }
            const face = faces[0];
            const frameSize = vec2(this.video.videoWidth || this.video.width, this.video.videoHeight || this.video.height);
            const result = classifyExpression(face, frameSize);
            this.lastExpression = result.id;
            this.lastFeatures = result.features;
            this.lastFace = face;
            if (result.id === this.target.id) {
                this.matchProgress = Math.min(1, this.matchProgress + MATCH_FILL_SPEED * DETECTION_INTERVAL);
            }
            else {
                this.matchProgress = Math.max(0, this.matchProgress - MATCH_DECAY_SPEED * DETECTION_INTERVAL);
            }
            if (this.matchProgress >= 0.999) {
                this.onSuccessMatch();
            }
        }
        catch (error) {
            console.error(error);
            this.status = '表情の解析に失敗しました。ブラウザを再読み込みしてください。';
        }
        finally {
            this.detecting = false;
        }
    }
    onSuccessMatch() {
        this.score += 100 + this.combo * 20;
        this.combo += 1;
        this.bestCombo = Math.max(this.bestCombo, this.combo);
        this.timeLeft = clamp(this.timeLeft + BONUS_TIME, 0, 120);
        this.matchProgress = 0;
        this.status = `${this.target.label}クリア！ +${BONUS_TIME}秒`;
        this.pickNextTarget();
    }
    pickNextTarget() {
        const nextCandidates = EXPRESSIONS.filter((expression) => expression.id !== this.target.id);
        const randomIndex = Math.floor(Math.random() * nextCandidates.length);
        this.target = nextCandidates[randomIndex];
    }
    drawFaceOutline(ctx, canvas) {
        if (!this.video || !this.lastFace) {
            return;
        }
        const bbox = this.lastFace.boundingBox;
        const scaleX = canvas.width / (this.video.videoWidth || this.video.width || canvas.width);
        const scaleY = canvas.height / (this.video.videoHeight || this.video.height || canvas.height);
        const x = canvas.width - (bbox.x + bbox.width) * scaleX;
        const y = bbox.y * scaleY;
        const width = bbox.width * scaleX;
        const height = bbox.height * scaleY;
        ctx.save();
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.85)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        ctx.restore();
    }
    drawHud(ctx, canvas) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.fillRect(20, 20, 200, 120);
        ctx.fillRect(canvas.width - 240, 20, 220, 160);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '22px/1.3 "Noto Sans JP", system-ui, sans-serif';
        ctx.fillText(`ターゲット`, 32, 52);
        ctx.font = '64px/1 "Segoe UI Emoji", system-ui';
        ctx.fillText(this.target.emoji, 36, 120);
        ctx.font = '20px/1.2 "Noto Sans JP", system-ui, sans-serif';
        ctx.fillText(this.target.label, 100, 86);
        ctx.fillText(this.target.description, 32, 150);
        ctx.textAlign = 'right';
        ctx.font = '24px/1.4 "Noto Sans JP", system-ui, sans-serif';
        ctx.fillText(`スコア: ${this.score}`, canvas.width - 24, 52);
        ctx.fillText(`のこり時間: ${Math.ceil(this.timeLeft)}s`, canvas.width - 24, 84);
        ctx.fillText(`コンボ: ${this.combo} (ベスト ${this.bestCombo})`, canvas.width - 24, 116);
        ctx.fillText(`判定: ${this.lastExpression === 'unknown' ? '---' : EXPRESSIONS.find((expr) => expr.id === this.lastExpression)?.label ?? '---'}`, canvas.width - 24, 148);
        ctx.textAlign = 'left';
        const barWidth = canvas.width - 80;
        const barX = 40;
        const barY = canvas.height - 60;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.fillRect(barX, barY, barWidth, 24);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(barX, barY, barWidth * clamp(this.matchProgress, 0, 1), 24);
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, 24);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '18px/1.2 "Noto Sans JP", system-ui, sans-serif';
        ctx.fillText('ターゲットと一致するとゲージが満タンになります', barX, barY - 8);
        if (this.lastFeatures) {
            ctx.font = '16px/1.2 "Noto Sans JP", system-ui, sans-serif';
            const features = this.lastFeatures;
            ctx.fillText(`mouthOpen: ${(features.mouthOpen * 100).toFixed(1)}%`, 32, canvas.height - 120);
            ctx.fillText(`mouthCurve: ${(features.mouthCurve * 100).toFixed(2)}%`, 32, canvas.height - 96);
            ctx.fillText(`eyeOpen: ${(features.eyeOpenness * 100).toFixed(1)}%`, 32, canvas.height - 72);
        }
        ctx.restore();
    }
    drawStatus(ctx, canvas) {
        if (!this.status) {
            return;
        }
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(80, canvas.height / 2 - 60, canvas.width - 160, 120);
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.font = '26px/1.4 "Noto Sans JP", system-ui, sans-serif';
        const lines = this.status.split('\n');
        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 10 + index * 30);
        });
        ctx.textAlign = 'left';
        ctx.restore();
    }
    cleanupStream() {
        this.stream?.getTracks().forEach((track) => track.stop());
        this.stream = null;
        if (this.video) {
            this.video.srcObject = null;
            this.video = null;
        }
    }
}
const canvas = document.getElementById('game-canvas');
if (!canvas) {
    throw new Error('ゲームキャンバスが見つかりません');
}
const game = new Game(canvas, { background: '#0f172a' });
game.renderer.resize(vec2(canvas.width, canvas.height));
game.setScene(new EmotionScene());
game.start();
