## Overview

`webgames` は複数のブラウザゲームと共通エンジンで構成されるモノレポです。
`packages/engine` が描画・入力・サウンドなどの基盤機能を提供し、各ゲームは
`apps/<name>` 配下で独立した Vite アプリとして構築します。

## Workspaces

- `apps/*`: 各ゲームのフロントエンド。`@engine/*` エイリアスでエンジンのソースを参照します。
- `packages/engine`: シーン管理、レンダリング、入力処理、当たり判定などを担当します。
- `site`: GitHub Pages 上で公開するランディングページ。各ゲームへのリンクを提供します。

## Build & Deployment

- ルートの `package.json` で npm workspaces を定義しています。
- `npm run dev` で全ワークスペースの開発サーバーを並列起動、`npm run build` で全成果物を生成します。
- GitHub Pages では `site` のビルド成果物をルート、各ゲームは `/games/<name>/` に配置します。
- 各 Vite プロジェクトでは `base: '/webgames/'` を指定し、Pages 上で正しいパス解決を行います。

## Engine Layer

- `SceneManager`: シーン遷移と現在シーンの更新・描画を制御。
- `Ticker`: 固定タイムステップ (60fps) の更新ループを司り、`requestAnimationFrame` をラップします。
- `Renderer`: Canvas 2D を抽象化し、バッチ描画・スプライト管理を行います。
- `Input`: キーボード/タッチ入力を正規化して各ゲームに提供します。
- `AudioManager`: 簡易な効果音/音楽再生を管理。ミュート制御あり。
- `Collider`: 矩形・円の衝突判定をサポートし、境界ボリュームの最適化を行います。

## Game Layer

- ゲーム固有のエンティティとシーンロジックのみを記述し、描画/入力/当たり判定はエンジンに委譲します。
- ステート管理はシーンごとに行い、再スタートやゲームオーバー演出はエンジンのフックを利用します。

## Testing

- エンジンのロジックは可能な限り純粋な TypeScript 関数で実装し、単体テストを追加します。
- ゲームごとにクリティカルな計算（スコア・体力など）はテスト対象とします。
