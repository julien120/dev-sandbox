# dev-sandbox / webgames

Unity エンジニアでも取り掛かりやすいように、開発体制・構成をコンパクトにまとめています。TypeScript と Vite を使った Web 向けゲーム群をまとめて管理し、GitHub Pages へ配信するリポジトリです。

## 全体像

- **目的**: いくつかの小さな Web ゲームを共通エンジンで動かし、`https://julien120.github.io/dev-sandbox/` から公開する。
- **ホスト環境**: Node.js 20 系 / npm ワークスペース。ブラウザは最新の Chromium / Firefox / Safari を対象。
- **ゲーム構成**: それぞれを Vite プロジェクトとして分離し、`packages/engine` で共通ロジックを提供。

## ディレクトリ構成ハイライト

```text
dev-sandbox/
├─ webgames/                  # 実際のゲーム群とサイトを格納するメインワークスペース
│  ├─ apps/                   # 各ゲーム（fish, space, tetris, toilet など）の Vite プロジェクト
│  ├─ packages/engine/        # TypeScript 製の共有ゲームエンジン (Game/Scene/Input など)
│  ├─ site/                   # ポータルサイト (ゲーム一覧 / ルーティングなしの静的ページ)
│  ├─ assets/                 # 共通の画像・音声など。差し替え前提の仮素材を格納
│  ├─ dist/                   # `npm run build` で生成されるビルド成果物（Git 管理外）
│  ├─ .github/workflows/      # GitHub Pages 用の自動デプロイワークフロー
│  └─ tools/                  # 補助スクリプト (`codex-commit.sh` など)
└─ package-lock.json          # ルートで npm ワークスペースを束ねるロックファイル
```

> Unity でいうところの「プロジェクト」は `webgames/apps/<game>` に相当し、`packages/engine` が共通ライブラリに当たります。ビルド成果物は `dist/` にまとまるため、`Library` や `Build` ディレクトリのイメージで捉えると分かりやすいです。

## 使用技術と言語

- **言語**: TypeScript (ESNext 準拠)。スタイルは ESLint + Prettier で統一。
- **ビルドツール**: [Vite](https://vitejs.dev/)。各ゲームおよびポータルサイトが個別に設定を持つ。
- **共通ロジック**: `packages/engine` にゲームループ、入力、スプライト管理などを集約。
- **その他ツール**: npm workspaces、TypeScript のプロジェクト参照 (`tsconfig.json` / `tsconfig.base.json`)。

### DOM と描画の扱い

- **DOM (Document Object Model)** はブラウザ上の UI ツリー。撮影スタジオのセットのように、要素の追加・削除・スタイル変更を通じて画面を構成します。
- 本プロジェクトではゲーム本体の描画は `<canvas>` を用いた WebGL / 2D コンテキストを想定し、UI 部分のみ最小限の DOM 操作を行います。
- Unity の UI システムと似ており、UI コンポーネントを DOM 要素、レンダリングターゲットを `<canvas>` と捉えると理解しやすいです。

### Vite の仕組み

- **Vite** はモジュールバンドラ＋開発サーバで、ESM (ECMAScript Modules) をネイティブに扱い、超高速なビルド・ホットリロードを実現します。
- 開発時はブラウザにそのままモジュールを読み込ませ、差分だけを即座に再配信するため、Unity の「Play」→「止めて再コンパイル」といった時間が大幅に削減されます。
- 本番ビルドでは Rollup を内部的に利用し、不要コードの除去や最適化を自動で行います。

### GitHub Actions の仕組み

- `.github/workflows/deploy.yml` が CI/CD の定義です。`master` ブランチへの push または手動トリガで実行。
- ワークフロー内では Node.js をセットアップ後、`npm ci` で依存を取得し、各ワークスペースの `build` スクリプトを順番に実行します。
- ビルドした成果物を `_site/` に集約し、`actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4` の流れで GitHub Pages にアップロードされます。
- Unity の Cloud Build のように、ビルド環境をクラウドに固定化しておけるため、ローカル差異を気にせずに配信可能です。

### Node.js をゲーム開発に用いる利点

- **高速な反復**: npm eco-system のツール（Vite, ESLint, Prettier, Vitest など）で変更の即時反映や自動チェックが可能。
- **フロントエンド連携が容易**: Web API、Service Worker、PWA といったブラウザネイティブ機能と直結しやすい。
- **バックエンドとの統一言語**: Node.js サーバも TypeScript で書けるため、将来的にスコア保存やマルチプレイ API を追加する際にコード共有がしやすい。
- **依存管理が簡潔**: npm workspaces によりゲームごとの依存と共通部分を適切に分割でき、Unity の Package Manager に近い運用ができます。

## 開発の始め方

1. **依存関係を取得**
   ```bash
   npm ci
   ```
2. **全ゲームまとめてホットリロード**
   ```bash
   npm run dev
   ```
   各ワークスペースの `dev` スクリプトが並列実行され、Vite の開発サーバが立ち上がります。
3. **特定ゲームだけ起動したい場合**
   ```bash
   npm --workspace apps/fish run dev
   # 他ゲームも fish を入れ替えるだけ
   ```
4. **コードスタイル / 型チェック**
   ```bash
   npm run lint
   npm run typecheck
   ```
5. **ローカルビルド**
   ```bash
   npm run build
   ```
   各ゲームの成果物は `dist/<game>/`、ポータルは `dist/site/` に出力されます。

## デプロイフロー

1. `npm run build` でローカルと同様に各ゲーム・サイトをビルド。
2. `.github/workflows/deploy.yml` の「Deploy Pages」ワークフローが、`master` ブランチへの push で自動トリガー。
   - `npm ci`
   - 各ワークスペースの `npm run build`
   - ビルド済み成果物を `_site/` に集約（`dist/site` → ルート、`dist/<game>` → `_site/games/<game>`）
   - `_site` を GitHub Pages のアーティファクトとしてアップロード
3. GitHub Pages が `_site` を配信し、`/dev-sandbox/` 以下にポータルとゲームを配置。

> Unity の「Build & Run」に相当する工程を GitHub Actions が肩代わりしてくれるイメージです。ローカルで `npm run build` が通れば、CI でも基本的に同じ結果になります。

## 開発時のコツ

- **共通エンジンを優先**: 一度エンジンへ取り込むと各ゲームで再利用でき、Unity の Prefab 化と似たメリットがあります。
- **DOM 操作は最小限**: ゲームロジックはエンジン側で完結させ、UI レイヤーのみ DOM を扱う想定です。
- **Git 運用**: 作業は `codex/xxxx` 形式のブランチで行い、PR では変更点・テスト結果・既知の課題をまとめます。
- **パフォーマンス**: ガベージ削減・固定フレームレート (60fps) を意識した実装が推奨されています。

## よく使う npm コマンド早見表

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 全ワークスペースの開発サーバを起動 |
| `npm --workspace apps/<game> run dev` | 指定ゲームのみ開発サーバを起動 |
| `npm run build` | すべてのゲームとサイトを本番ビルド |
| `npm run lint` | ESLint チェック |
| `npm run typecheck` | TypeScript プロジェクト参照ビルド |

---

Web 技術になじみがなくても、上記のコマンドとディレクトリ対応を押さえておけば迷わず触り始められます。Unity でのシーン・プレハブ構成をイメージしながら `apps/` と `packages/` を行き来すると理解しやすいはずです。
