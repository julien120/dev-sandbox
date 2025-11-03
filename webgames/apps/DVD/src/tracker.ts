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

export type BodyJointId =
  | 'head'
  | 'torso'
  | 'leftShoulder'
  | 'rightShoulder'
  | 'leftElbow'
  | 'rightElbow'
  | 'leftWrist'
  | 'rightWrist'
  | 'leftHip'
  | 'rightHip'
  | 'leftKnee'
  | 'rightKnee'
  | 'leftAnkle'
  | 'rightAnkle';

type JointConfig = {
  id: BodyJointId;
  indices: number[];
  radiusScale: number;
};

const JOINT_CONFIG: JointConfig[] = [
  { id: 'head', indices: [0, 1, 2, 3, 4], radiusScale: 1.15 },
  { id: 'torso', indices: [11, 12, 23, 24], radiusScale: 1.45 },
  { id: 'leftShoulder', indices: [11], radiusScale: 1 },
  { id: 'rightShoulder', indices: [12], radiusScale: 1 },
  { id: 'leftElbow', indices: [13], radiusScale: 0.95 },
  { id: 'rightElbow', indices: [14], radiusScale: 0.95 },
  { id: 'leftWrist', indices: [15], radiusScale: 0.95 },
  { id: 'rightWrist', indices: [16], radiusScale: 0.95 },
  { id: 'leftHip', indices: [23], radiusScale: 1.1 },
  { id: 'rightHip', indices: [24], radiusScale: 1.1 },
  { id: 'leftKnee', indices: [25], radiusScale: 1 },
  { id: 'rightKnee', indices: [26], radiusScale: 1 },
  { id: 'leftAnkle', indices: [27], radiusScale: 0.9 },
  { id: 'rightAnkle', indices: [28], radiusScale: 0.9 },
];

export type BodyCollider = {
  id: BodyJointId;
  position: Vector2;
  radius: number;
  confidence: number;
};

export type TrackedPlayer = {
  id: number;
  position: Vector2;
  radius: number;
  confidence: number;
  visible: boolean;
  colliders: BodyCollider[];
};

type InternalTrack = {
  position: Vector2;
  confidence: number;
  visible: boolean;
  lastSeen: number;
  colliders: Record<BodyJointId, BodyCollider>;
};

const getBaseRadius = (): number => {
  return window.matchMedia('(max-width: 768px)').matches ? 36 : 28;
};

type LandmarkInfo = {
  position: Vector2;
  confidence: number;
};

const computeLandmarkInfo = (
  indices: number[],
  landmarks: NormalizedLandmark[],
): LandmarkInfo | null => {
  let totalX = 0;
  let totalY = 0;
  let totalWeight = 0;
  let totalConfidence = 0;

  for (const index of indices) {
    const landmark = landmarks[index];
    if (!landmark) {
      continue;
    }
    const visibility = clamp(landmark.visibility ?? 0, 0, 1);
    if (visibility <= 0) {
      continue;
    }
    totalX += landmark.x * visibility;
    totalY += landmark.y * visibility;
    totalWeight += visibility;
    totalConfidence += visibility;
  }

  if (totalWeight <= 0) {
    return null;
  }

  const count = indices.length || 1;
  const averageVisibility = clamp(totalConfidence / count, 0, 1);
  return {
    position: vec2(totalX / totalWeight, totalY / totalWeight),
    confidence: averageVisibility,
  };
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
  private readonly tracks: InternalTrack[];
  private stableTimer = 0;
  private lastPlayerCount = 0;
  private initialized = false;
  private readonly radius = getBaseRadius();

  constructor(private readonly video: HTMLVideoElement, private readonly mirror = true) {
    this.tracks = Array.from({ length: MAX_PLAYERS }, () => this.createEmptyTrack());
  }

  private createEmptyTrack(): InternalTrack {
    const colliders = JOINT_CONFIG.reduce<Record<BodyJointId, BodyCollider>>((acc, config) => {
      acc[config.id] = {
        id: config.id,
        position: vec2(0.5, 0.5),
        radius: this.radius * config.radiusScale,
        confidence: 0,
      };
      return acc;
    }, {} as Record<BodyJointId, BodyCollider>);

    return {
      position: vec2(0.5, 0.5),
      confidence: 0,
      visible: false,
      lastSeen: 0,
      colliders,
    };
  }

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
        for (const collider of Object.values(track.colliders)) {
          collider.confidence = Math.max(0, collider.confidence - dt * 2);
        }
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

    const activePlayers = this.tracks.filter(
      (track) =>
        track.visible &&
        track.confidence >= CONFIDENCE_THRESHOLD &&
        Object.values(track.colliders).some((collider) => collider.confidence >= 0.25),
    );
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
        colliders: Object.values(track.colliders)
          .filter((collider) => collider.confidence >= 0.2)
          .map<BodyCollider>((collider) => ({
            id: collider.id,
            position: vec2(collider.position.x, collider.position.y),
            radius: collider.radius,
            confidence: collider.confidence,
          })),
      }))
      .filter((player) => player.visible && player.colliders.length > 0);
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
        const torsoInfo = computeLandmarkInfo([11, 12, 23, 24], landmarks);
        const wristsInfo = computeLandmarkInfo([15, 16], landmarks);
        const headInfo = computeLandmarkInfo([0, 1, 2, 3, 4], landmarks);
        const fallbackInfo = torsoInfo ?? wristsInfo ?? headInfo;
        if (!fallbackInfo) {
          return null;
        }

        const confidence = computeConfidence(landmarks);
        if (confidence < 0.1) {
          return null;
        }

        const normalizedX = this.mirror ? 1 - fallbackInfo.position.x : fallbackInfo.position.x;
        const normalizedY = fallbackInfo.position.y;

        return {
          x: clamp(normalizedX, 0, 1),
          y: clamp(normalizedY, 0, 1),
          confidence,
          colliders: this.buildColliderTargets(landmarks, canvasWidth, canvasHeight),
        };
      })
      .filter(
        (
          entry,
        ): entry is {
          x: number;
          y: number;
          confidence: number;
          colliders: BodyCollider[];
        } => entry !== null,
      )
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

      const activeIds = new Set<BodyJointId>();
      player.colliders.forEach((colliderTarget) => {
        activeIds.add(colliderTarget.id);
        const trackCollider = track.colliders[colliderTarget.id];
        if (trackCollider) {
          trackCollider.position.x = lerp(trackCollider.position.x, colliderTarget.position.x, smoothing);
          trackCollider.position.y = lerp(trackCollider.position.y, colliderTarget.position.y, smoothing);
          trackCollider.radius = lerp(trackCollider.radius, colliderTarget.radius, 0.35);
          trackCollider.confidence = lerp(trackCollider.confidence, colliderTarget.confidence, 0.5);
        } else {
          track.colliders[colliderTarget.id] = {
            id: colliderTarget.id,
            position: vec2(colliderTarget.position.x, colliderTarget.position.y),
            radius: colliderTarget.radius,
            confidence: colliderTarget.confidence,
          };
        }
      });

      Object.entries(track.colliders).forEach(([id, collider]) => {
        if (!activeIds.has(id as BodyJointId)) {
          collider.confidence = Math.max(0, collider.confidence - 0.1);
        }
      });
    });

    if (normalizedPlayers.length === 0) {
      for (const track of this.tracks) {
        track.visible = false;
      }
    }
  }

  private buildColliderTargets(
    landmarks: NormalizedLandmark[],
    canvasWidth: number,
    canvasHeight: number,
  ): BodyCollider[] {
    const colliders: BodyCollider[] = [];
    for (const config of JOINT_CONFIG) {
      const info = computeLandmarkInfo(config.indices, landmarks);
      if (!info) {
        continue;
      }
      const normalizedX = this.mirror ? 1 - info.position.x : info.position.x;
      const clampedX = clamp(normalizedX, 0, 1);
      const clampedY = clamp(info.position.y, 0, 1);
      colliders.push({
        id: config.id,
        position: vec2(clampedX * canvasWidth, clampedY * canvasHeight),
        radius: this.radius * config.radiusScale,
        confidence: info.confidence,
      });
    }
    return colliders;
  }
}
