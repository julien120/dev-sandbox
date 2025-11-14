# You Are Julien? — 埋め込み生成パイプライン

この `python/` ディレクトリには、ジュリアン本人/その他の人物の顔画像から埋め込みベクトルを生成し、`apps/julien` の判定ロジックへ連携するためのスクリプトと入力構造をまとめています。

## セットアップ

```bash
cd python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

> **ライブラリについて**
>
> - `insightface` の `FaceAnalysis` を利用して顔検出＋アライン＋埋め込みをワンストップで行います。
> - 既定では `buffalo_l` モデル(512次元) を使用します。別モデルに差し替える場合は `--model` オプションを指定してください。

## 入力ディレクトリ構造

```
python/
├── input/
│   ├── julien/   # ジュリアン本人の顔画像(JPG/PNG)。15〜20枚以上推奨
│   └── others/   # 否ジュリアン（家族/チームメンバーなど）の顔画像
└── embed_julien.py
```

- 任意の人物カテゴリを増やしたい場合は `python/input/<label>/` を作成してください。フォルダ名がそのままラベルになります。
- 画像はカメラ目線・斜め・表情違い・明るさ違いなどバリエーションを揃えると埋め込みの分布が安定します。

## 埋め込み生成

```bash
cd python
python embed_julien.py \
  --input ./input \
  --output ../apps/julien/src/data/julien-embeddings.json \
  --min-score 0.25
```

- `--input` : ラベルごとの画像フォルダを束ねたディレクトリ。
- `--output` : JSON を書き出す先。既定では `../apps/julien/src/data/julien-embeddings.json`。
- `--model` : InsightFace のモデル名 (既定 `buffalo_l`)。
- `--min-score` : 顔検出スコアのしきい値。低すぎるとブレたフレームも残るので 0.2〜0.3 がおすすめ。

### 出力 JSON 形式

```json
{
  "model": "buffalo_l",
  "createdAt": "2025-11-12T02:34:00.000Z",
  "dimension": 512,
  "embeddings": {
    "julien": [[0.02, 0.13, ...], ...],
    "others": [[-0.11, 0.08, ...], ...]
  }
}
```

`apps/julien` 側では、この JSON を読み込み、Webカメラから得たフレームの埋め込みとコサイン類似度を比較するだけで「ジュリアン本人か」の判定が可能になります。

## 参考

- [InsightFace GitHub](https://github.com/deepinsight/insightface)
- [ONNXRuntime](https://onnxruntime.ai/)

> **注意**: 元画像ファイルはリポジトリにはコミットしないでください。埋め込み JSON だけをバージョン管理し、本番では安全なストレージに画像を保管する運用を推奨します。
>
> 実データで判定したい場合は python/input/julien/ と python/input/others/ に画像を配置し、python/embed_julien.py --input ./input --output ../apps/julien/src/data/
> julien-embeddings.json を実行してください。生成された埋め込みを読み込む形で判定ロジックを差し替える想定です（元画像はリポジトリにコミットしない運用を推奨）。
