# Codex 作業指示（共通・恒常）

## Codex Environment

node: 20

## 目的

本リポは複数の Web ゲームを GitHub Pages で公開する。あなた(Codex)は実装担当、人間はコードレビューのみを行う。

## ルール

- 変更は必ず `codex/hoge` ブランチで行う。
- TypeScript + Vite。DOM 直操作は最小。ロジックは `packages/engine` に集約。
- パフォーマンス優先：GC 削減、アロケーション抑制、矩形と円の簡易当たり判定を基本。
- 入力はキーボード、タッチ両対応（Tab ナビ/ARIA 考慮）。
- すべて ESLint/Prettier/TS typecheck を通すこと。
- GitHub Pages の公開URLは `https://julien120.github.io/dev-sandbox/`。Actions/Pages のワークフローは必ずリポジトリ直下 `.github/workflows` に置き、Vite の `base` と `build.outDir` を `/dev-sandbox/…` に揃えること。
- 画像/音源は暫定アセットで OK。必ず差し替え前提の抽象化を行う（`assets/`参照）。
- 新しいゲームを追加するときは、このドキュメントの該当セクションのみを更新し、ほかのゲームの記述を崩さないこと。
- 新しいゲーム/ツールを追加したら、`.github/workflows/deploy.yml` で該当アプリの `npm --workspace apps/<name> run build` と `_site/games/<name>` / `_site/tools/<name>` へのコピー処理を忘れずに追加すること。
- バグ修正の時は何が問題だったか分析結果を記述してから実装に移ること

## 出力物（PR に必須）

- 変更ファイル
- `CHANGELOG` 風の要約（箇条書き）
- テスト（可能な範囲でロジック単体テスト）
- 動作手順（dev/build の実行例）
- 既知の制限/TODO
- 、GitHub Markdown の見出し・箇条書きを使って PR 本文（概要、変更点、テスト、既知の課題など）を返答すること
- branchは人間が作成するので勝手に作成したり、pushしないこと

## タスク粒度

- 1PR = 1 トピック。大きい機能は下位タスクに分割。

## ゲーム別の最初の実装キット

- suika: スイカゲーム。フルーツを落として合体させるフィジカルパズルを想定。
- tetris: Tetris を作成する
- space: シューティング、縦スクロール、敵 Wave、弾管理 Pool、爆発エフェクト
- flappy: フラッピーバードライク。タップ/スペースで上昇、パイプ通過でスコア加算。画像差し替え前提のアセット構造。
- emotion: カメラ映像と FaceDetector で表情を推定し、指定された感情を判定する。
- gifmaker: 動画ファイルから GIF を生成するツール。Drag & Drop、10MB以下へのサイズ調整。
- ramen: Three.js でラーメンをモデリングし、ドラッグで360°回転させるビジュアルツール。
- vj: Tone.js と Three.js を組み合わせ、クリックで音楽を生成し、マウス操作で音色とVJ演出が変化するツール。
- netliteracy: 写真から顔を検出し、ぼかしてダウンロードできるプライバシー保護ツール。
  - 推論前に長辺1500pxへダウンサンプリングし、FaceDetectorは `short_range` モデルを 0.5/0.75/1/1.5/2.0 倍のマルチスケールで実行してLandmarkerとマージする。
  - Google公式の face detector full-range モデルURLは2025-11-01時点で404のため未導入。公開されたら `apps/netliteracy/scripts/sync-assets.mjs` へ追記すること。
- styleforge: MeCab で文章を解析し、指定した文体へリライトするテキストスタイリングツール。
  - `mecab-wasm` を利用してブラウザ上で形態素解析を実行し、ですます調／である調／カジュアル／ビジネスメール調をサポート。
  - 入力テキストは文体変換前に MeCab 解析結果（形態素一覧）も表示して開発者がトークン化結果を確認できるようにする。

## 着手テンプレ（例）

- `apps/suika/src/main.ts` を作成。エンジンから `Game`, `Scene`, `Input`, `Sprite` を使用して最小ステージを描画する。
- `packages/engine` に `SceneManager`, `Ticker`, `RectCollider`, `CircleCollider`, `AssetLoader` を実装して再利用可能にする。
- fps60 前提、タイムステップ固定（可変補間あり）。

## 受け入れ条件（例： 初期 PR）

- ローカルで `npm ci && npm run dev` で起動し、WASD/矢印で移動、障害物に触れると HP 減少、0 でゲームオーバー。
- スコア UI 表示。再スタート可。
- `npm run build` 成功。Pages 配置パス `/dev-sandbox/games/suika/` で動作。

## 言語設定

Codex はすべての出力・要約・コメント・思考メモを日本語で行うこと。
英語のラベル（例: Explored, Planned, Next Steps）は以下のように日本語で表記する：

- Explored → 調査中
- Planning → 計画中
- Next Steps → 次に行うこと
- Reviewing → レビュー中
- Summary → まとめ

技術用語は必要に応じて英語のまま残してよい。
