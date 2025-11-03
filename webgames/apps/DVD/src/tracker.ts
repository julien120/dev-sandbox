import {
  FilesetResolver,
  PoseLandmarker,
  type NormalizedLandmark,
  type PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';
import { clamp, lerp, vec2, type Vector2 } from '@engine';
import { joinBasePath } from './utils';

const DETECTION_INTERVAL = 1 / 15;
const MAX_PLAYERS = 2;
const CONFIDENCE_THRESHOLD = 0.35;
const STABLE_THRESHOLD = 1.5;
const VISIBILITY_KEYS = [11, 12, 23, 24, 15, 16];

export type TrackedPlayer = {
  id: number;
  position: Vector2;
  radius: number;
  confidence: number;
  visible: boolean;
};

type InternalTrack = {
  position: Vector2;
  confidence: number;
  visible: boolean;
  lastSeen: number;
};

const getBaseRadius = (): number => {
  return window.matchMedia('(max-width: 768px)').matches ? 36 : 28;
};

const computeLandmarkAverage = (indices: number[], landmarks: NormalizedLandmark[]): Vector2 | null => {
  let totalX = 0;
  let totalY = 0;
  let totalWeight = 0;

  for (const index of indices) {
    const landmark = landmarks[index];
    if (!landmark) {
      continue;
    }
    const visibility = landmark.visibility ?? 0;
    totalX += landmark.x * visibility;
    totalY += landmark.y * visibility;
    totalWeight += visibility;
  }

  if (totalWeight <= 0) {
    return null;
  }

  return vec2(totalX / totalWeight, totalY / totalWeight);
};

const computeConfidence = (landmarks: NormalizedLandmark[]): number => {
  let total = 0;
  let count = 0;
  for (const index of VISIBILITY_KEYS) {
    const visibility = landmarks[index]?.visibility ?? 0;
    total += visibility;
    count += 1;
  }
  return count > 0 ? clamp(total / count, 0, 1) : 0;
};

export class PlayerTracker {
  private landmarker: PoseLandmarker | null = null;
  private stream: MediaStream | null = null;
  private detectionTimer = 0;
  private pendingDetection = false;
  private readonly tracks: InternalTrack[] = Array.from({ length: MAX_PLAYERS }, () => ({
    position: vec2(0.5, 0.5),
    confidence: 0,
    visible: false,
    lastSeen: 0,
  }));
  private stableTimer = 0;
  private lastPlayerCount = 0;
  private initialized = false;
  private readonly radius = getBaseRadius();

  constructor(private readonly video: HTMLVideoElement, private readonly mirror = true) {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 960, height: 540 },
      audio: false,
    });

    this.video.srcObject = this.stream;
    await this.video.play();
    this.video.classList.add('is-visible');

    const fileset = await FilesetResolver.forVisionTasks(
      joinBasePath(import.meta.env.BASE_URL, 'mediapipe/wasm'),
    );

    this.landmarker = await PoseLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: joinBasePath(import.meta.env.BASE_URL, 'mediapipe/pose_landmarker_lite.task'),
      },
      runningMode: 'VIDEO',
      numPoses: MAX_PLAYERS,
    });

    this.initialized = true;
  }

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.video.srcObject = null;
    this.video.classList.remove('is-visible');
  }

  update(dt: number, canvasWidth: number, canvasHeight: number): void {
    this.detectionTimer -= dt;

    for (const track of this.tracks) {
      track.lastSeen += dt;
      if (track.lastSeen > 0.4) {
        track.visible = false;
        track.confidence = Math.max(0, track.confidence - dt * 2);
      }
    }

    if (!this.initialized || !this.landmarker || !this.video || this.video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
      this.stableTimer = 0;
      this.lastPlayerCount = 0;
      return;
    }

    if (this.detectionTimer <= 0 && !this.pendingDetection) {
      this.detectionTimer = DETECTION_INTERVAL;
      this.pendingDetection = true;
      void this.detect(canvasWidth, canvasHeight);
    }

    const activePlayers = this.tracks.filter((track) => track.visible && track.confidence >= CONFIDENCE_THRESHOLD);
    if (activePlayers.length > 0) {
      this.stableTimer += dt;
    } else {
      this.stableTimer = Math.max(0, this.stableTimer - dt * 2);
    }
    this.lastPlayerCount = activePlayers.length;
  }

  getPlayers(): TrackedPlayer[] {
    return this.tracks
      .map<TrackedPlayer>((track, index) => ({
        id: index,
        position: vec2(track.position.x, track.position.y),
        radius: this.radius,
        confidence: track.confidence,
        visible: track.visible,
      }))
      .filter((player) => player.visible);
  }

  getPlayerCount(): number {
    return this.lastPlayerCount;
  }

  isStable(minPlayers = 1): boolean {
    return this.stableTimer >= STABLE_THRESHOLD && this.lastPlayerCount >= minPlayers;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private async detect(canvasWidth: number, canvasHeight: number): Promise<void> {
    try {
      const result = await this.landmarker?.detectForVideo(this.video, performance.now());
      if (!result) {
        return;
      }

      this.applyDetection(result, canvasWidth, canvasHeight);
    } catch (error) {
      console.error('[DVD] Pose detection failed', error);
    } finally {
      this.pendingDetection = false;
    }
  }

  private applyDetection(result: PoseLandmarkerResult, canvasWidth: number, canvasHeight: number): void {
    const detections = result.landmarks ?? [];
    const normalizedPlayers = detections
      .map((landmarks) => {
        const torsoCenter = computeLandmarkAverage([11, 12, 23, 24], landmarks);
        const wristsCenter = computeLandmarkAverage([15, 16], landmarks);
        const fallback = torsoCenter ?? wristsCenter;
        if (!fallback) {
          return null;
        }

        const confidence = computeConfidence(landmarks);
        if (confidence < 0.1) {
          return null;
        }

        const normalizedX = this.mirror ? 1 - fallback.x : fallback.x;
        const normalizedY = fallback.y;

        return {
          x: clamp(normalizedX, 0, 1),
          y: clamp(normalizedY, 0, 1),
          confidence,
        };
      })
      .filter((entry): entry is { x: number; y: number; confidence: number } => entry !== null)
      .slice(0, MAX_PLAYERS)
      .sort((a, b) => a.x - b.x);

    const smoothing = 0.45;

    normalizedPlayers.forEach((player, index) => {
      const track = this.tracks[index];
      const targetX = player.x * canvasWidth;
      const targetY = player.y * canvasHeight;
      track.position.x = lerp(track.position.x, targetX, smoothing);
      track.position.y = lerp(track.position.y, targetY, smoothing);
      track.confidence = lerp(track.confidence, player.confidence, 0.4);
      track.visible = player.confidence >= 0.15;
      track.lastSeen = 0;
    });

    if (normalizedPlayers.length === 0) {
      for (const track of this.tracks) {
        track.visible = false;
      }
    }
  }
}
