# 感情ネットワーク可視化 — CODEX.md（日本語版）

このドキュメントは、TypeScript + Vite で「感情ネットワーク」を可視化するアプリを生成するための設計・実装指示書です。  
プリキュアの歌詞OP 2020 年から 2025 年までの**時代ごとの感情構造の違いを比較可視化**できます。  
このアプリはフロントエンドのみで動作し、GitHub Pages 等への静的デプロイが可能です。

---

## 🎯 目的と非目的

### 目的

- 感情同士の関係を「ノード（感情）」と「リンク（共起関係）」で表す。
- **ノードのサイズ**＝出現頻度、**リンクの太さ**＝共起強度、**透明度**＝関連の強さ。
- **2 つの時代を並列表示**し、感情構造の違いを直感的に比較できる。
- ノードにマウスを重ねると詳細情報がツールチップ表示される。
- グラフのエクスポート（SVG / PNG）に対応。

---

## 🧩 技術スタック

| 項目     | 使用技術                     | 目的                                       |
| -------- | ---------------------------- | ------------------------------------------ |
| 言語     | TypeScript                   | 安全で拡張性の高い実装                     |
| 開発環境 | Vite                         | 高速なビルドと HMR                         |
| 可視化   | D3.js（または Cytoscape.js） | 力学シミュレーションによるネットワーク描画 |
| スタイル | Tailwind CSS                 | レスポンシブな UI 構築                     |
| テスト   | Vitest / Playwright          | 基本動作検証                               |
| 整形     | ESLint / Prettier            | コード品質維持                             |

---

## 🗂 ディレクトリ構成

```
src/
 ├─ data/
 │   ├─ mr_children.json
 │   └─ mrs_green_apple.json
 ├─ components/
 │   ├─ Graph.ts
 │   ├─ EraCompare.ts
 │   ├─ Legend.ts
 │   └─ Toolbar.ts
 ├─ utils/
 │   ├─ loadData.ts
 │   └─ export.ts
 ├─ colorMap.ts
 ├─ main.ts
 └─ style.css
```

---

## 💾 データ仕様

### JSON 構造

```ts
type EmotionNode = {
  id: string; // 感情名
  value: number; // 出現頻度
  color?: string; // 任意指定色
};

type EmotionLink = {
  source: string; // 接続元ノード
  target: string; // 接続先ノード
  weight: number; // 強度（0〜1）
};

type EraGraph = {
  era: string; // 時代ラベル
  nodes: EmotionNode[];
  links: EmotionLink[];
};
```

### 例

```json
{
  "era": "Mr.Children (1992–2004)",
  "nodes": [
    { "id": "Hope", "value": 42 },
    { "id": "Anxiety", "value": 28 },
    { "id": "Joy", "value": 30 }
  ],
  "links": [
    { "source": "Hope", "target": "Joy", "weight": 0.85 },
    { "source": "Hope", "target": "Anxiety", "weight": 0.67 }
  ]
}
```

---

## 🎨 表示仕様

### ノード

- **半径**：`value` に比例。
- **色**：感情カテゴリに応じた固定色。
- **ラベル**：中央表示、常に可読。
- **ホバー**：ツールチップ表示。

### リンク

- **太さ**：`weight` に比例。
- **透明度**：`weight` に応じて薄く。
- **曲線化**：重なりを避けるため軽いベジェカーブ。

### インタラクション

- ノードホバーで強調＋ツールチップ。
- ノードクリックで関連感情を強調。
- 検索フィルター。
- ズーム・パン対応。

---

## 🌈 カラーマップ例

```ts
export const EMOTION_COLORS = {
  Hope: '#4CCB6F',
  Joy: '#FFD44D',
  Anxiety: '#A06BE3',
  Romance: '#F15B6C',
  Sadness: '#4AA3DF',
  Regret: '#6B7C8F',
};
```

---

## ⚙️ 実装ポイント

### Graph.ts

- D3 の`forceSimulation`を使用。
- ノード・リンクを SVG で描画。
- ホバー／クリックイベントを付与。
- `update()`でデータ更新をサポート。

### EraCompare.ts

- 2 つのデータを並列表示。
- スケールを統一して比較可能に。
- 同一ノード名はハイライト連動。

---

## 🧭 UI 要素

- ヘッダー：時代切替、タイトル。
- メイン：2 つのグラフ（並列）。
- サイドバー：凡例、エクスポート。
- フッター：統計情報。

---

## 🧰 開発コマンド

```bash
npm create vite@latest emotion-network -- --template vanilla-ts
cd emotion-network
npm i d3 tailwindcss postcss autoprefixer
npm i -D eslint prettier vitest
npx tailwindcss init -p
npm run dev
```

---

## 🧪 完了条件（Done）

- ✅ 両時代のグラフが並列表示。
- ✅ ノードサイズ・リンク太さが共通スケール。
- ✅ ホバー・クリック動作が正しく動く。
- ✅ SVG/PNG 出力が可能。
- ✅ ESLint/Prettier エラーなし。

---

## 💡 Codex 指示例

```md
「感情ネットワーク可視化アプリ」を作りたい。
以下の要件で `Graph.ts` を生成してください。

- D3.js の forceSimulation を使用
- ノードサイズは value に比例
- ノードカラーは colorMap から取得
- リンク線の太さは weight に比例
- ホバー時にツールチップを表示
- 更新 API（update）を実装
```

---

## ✅ 次のステップ

1. Vite + TS プロジェクト初期化
2. D3.js による Graph.ts 作成
3. EraCompare.ts で並列表示
4. Tailwind で UI 構築
5. データ投入とテスト
6. GitHub Pages へデプロイ

---

_End of CODEX.md（日本語版）_
