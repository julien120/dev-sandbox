#!/usr/bin/env python3
"""顔画像から埋め込みベクトルを生成し、apps/julien で利用できる JSON を出力するスクリプト."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List

import cv2
import numpy as np
from insightface.app import FaceAnalysis
from tqdm import tqdm


@dataclass
class FaceSample:
    label: str
    path: Path
    embedding: np.ndarray
    score: float


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Generate face embeddings for You Are Julien?')
    parser.add_argument('--input', type=Path, default=Path('input'), help='ルート入力ディレクトリ (ラベルごとのサブディレクトリ)')
    parser.add_argument('--output', type=Path, default=Path('../apps/julien/src/data/julien-embeddings.json'), help='出力JSONのパス')
    parser.add_argument('--model', default='buffalo_l', help='InsightFace FaceAnalysis モデル名')
    parser.add_argument('--device', default='cpu', choices=['cpu', 'gpu'], help='推論デバイス (ctx)')
    parser.add_argument('--min-score', type=float, default=0.25, help='顔検出スコアのしきい値')
    parser.add_argument('--limit', type=int, default=0, help='各ラベルにつき最大何枚まで利用するか (0は無制限)')
    return parser.parse_args()


def iter_image_files(root: Path) -> Dict[str, List[Path]]:
    mapping: Dict[str, List[Path]] = {}
    if not root.exists():
        raise FileNotFoundError(f'input dir not found: {root.resolve()}')
    for label_dir in root.iterdir():
        if not label_dir.is_dir():
            continue
        images = [p for p in label_dir.glob('**/*') if p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'}]
        if images:
            mapping[label_dir.name] = sorted(images)
    if not mapping:
        raise RuntimeError('入力フォルダに画像が見つかりません')
    return mapping


def init_face_app(model_name: str, device: str, det_thresh: float) -> FaceAnalysis:
    ctx_id = -1 if device == 'cpu' else 0
    app = FaceAnalysis(name=model_name, providers=['CPUExecutionProvider'] if ctx_id == -1 else None)
    app.prepare(ctx_id=ctx_id, det_size=(640, 640), det_thresh=det_thresh)
    return app


def load_image(path: Path) -> np.ndarray:
    img = cv2.imread(str(path))
    if img is None:
        raise RuntimeError(f'画像を読み込めませんでした: {path}')
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


def process_label(label: str, files: List[Path], app: FaceAnalysis, limit: int) -> List[FaceSample]:
    samples: List[FaceSample] = []
    for path in tqdm(files, desc=f'[{label}]', unit='img'):
        if limit and len(samples) >= limit:
            break
        try:
            img = load_image(path)
        except RuntimeError as exc:
            print(exc, file=sys.stderr)
            continue
        faces = app.get(img)
        faces = [face for face in faces if face.det_score >= app.det_thresh]
        if not faces:
            continue
        best_face = max(faces, key=lambda f: f.det_score * (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
        emb = np.asarray(best_face.embedding, dtype=np.float32)
        samples.append(FaceSample(label=label, path=path, embedding=emb, score=float(best_face.det_score)))
    return samples


def main() -> None:
    args = parse_args()
    label_to_files = iter_image_files(args.input)
    app = init_face_app(args.model, args.device, args.min_score)

    embeddings: Dict[str, List[List[float]]] = {}
    for label, files in label_to_files.items():
        samples = process_label(label, files, app, args.limit)
        if not samples:
            print(f'ラベル {label} に有効な顔が見つかりませんでした', file=sys.stderr)
            continue
        embeddings[label] = [sample.embedding.tolist() for sample in samples]
        print(f'ラベル {label}: {len(samples)} 件の埋め込みを生成しました')

    if not embeddings:
        raise RuntimeError('埋め込みが一件も生成されませんでした')

    output = {
        'model': args.model,
        'createdAt': datetime.now(tz=timezone.utc).isoformat(),
        'dimension': len(next(iter(embeddings.values()))[0]),
        'embeddings': embeddings,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open('w', encoding='utf-8') as fh:
        json.dump(output, fh, ensure_ascii=False, indent=2)
    print(f'埋め込みを {args.output.resolve()} に書き出しました')


if __name__ == '__main__':
    main()
