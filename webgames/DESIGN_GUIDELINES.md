# デザインガイドライン（UX心理学ベース）

本ガイドは松下村塾株式会社「[UX心理学](https://www.shokasonjuku.com/ux-psychology)」で紹介されている行動心理・認知バイアスを参考に、当リポジトリのゲーム／ツールで一貫した体験を作るための要点をまとめたものです。

## 適用範囲
- GitHub Pages 上の全ゲーム／ツール（`/dev-sandbox/*`）のUI。
- 新規画面の設計、既存画面の改善、オンボーディングやモーダルのテキスト。

## 基本原則（抜粋 15 項目）
- **美的ユーザビリティ効果** ([link](https://www.shokasonjuku.com/ux-psychology/aesthetic-usability-effect)): 見た目の良さは使いやすさの知覚を高める。配色・余白・タイポをまず整える。
- **認知負荷の最小化** ([link](https://www.shokasonjuku.com/ux-psychology/cognitive-load)): 一画面の選択肢・情報量を絞り、主要ボタンを 1〜2 個に絞る。
- **デフォルト効果** ([link](https://www.shokasonjuku.com/ux-psychology/default-bias)): 初期設定で推奨パスを提示する（例: 推奨解像度、音量ON）。
- **アンカー効果** ([link](https://www.shokasonjuku.com/ux-psychology/anchor-effect)): 先に基準値を提示し、以降の選択肢の比較負荷を下げる（例: 難易度の簡単→標準→高難度の順）。
- **フレーミング** ([link](https://www.shokasonjuku.com/ux-psychology/framing)): 同じ結果でも肯定的表現を優先し、成功確率やメリットを明示する。
- **バナー・ブラインドネス回避** ([link](https://www.shokasonjuku.com/ux-psychology/banner-blindness)): 重要な案内は広告風レイアウトを避け、コンテンツフロー内に配置。
- **好奇心ギャップ** ([link](https://www.shokasonjuku.com/ux-psychology/curiosity-gap)): 「あと〇〇で解放」「もう少しでスコア更新」のような未完感でリトライ意欲を刺激。
- **段階的開示 (Progressive Disclosure)** ([link](https://www.shokasonjuku.com/ux-psychology/progressive-disclosure)): 初回は最小操作のみ見せ、詳細設定は「詳細を開く」にまとめる。
- **目標勾配効果** ([link](https://www.shokasonjuku.com/ux-psychology/goal-gradient-effect)): 進捗バーや残タスク数を表示し、ゴールに近づくほどモチベーションを高める。
- **ピーク・エンドの法則** ([link](https://www.shokasonjuku.com/ux-psychology/peak-end-rule)): 体験のピークと終了時にポジティブ演出（効果音・アニメ）を集中させる。
- **社会的証明** ([link](https://www.shokasonjuku.com/ux-psychology/social-proof)): スコア共有や「〇人がプレイ中」を表示し安心感と参加感を与える。
- **損失回避** ([link](https://www.shokasonjuku.com/ux-psychology/loss-aversion)): 失敗時も「経験値を保持」「次は◯%伸びそう」と損失より得を強調。
- **希少性** ([link](https://www.shokasonjuku.com/ux-psychology/scarcity)): 限定スキンや期間限定イベントは残り時間表示で価値を伝える。
- **選択的注意** ([link](https://www.shokasonjuku.com/ux-psychology/selective-attention)): 強調色は 1 画面 1〜2 色に抑え、最重要CTAへ集中させる。
- **変動型報酬** ([link](https://www.shokasonjuku.com/ux-psychology/variable-reward)): 獲得報酬の一部にランダム性を入れ、継続プレイを促す（頻度は控えめに）。

## 実装チェックリスト
- 主CTAは1つに絞り、視線誘導を行う（色・サイズ・余白）。
- 初回訪問はチュートリアルを段階表示し、スキップ可能にする。
- 進捗・結果画面では成果ハイライトと次アクション（リトライ/共有）をセットで提示。
- 設定や危険操作は確認ダイアログで文脈説明を入れる（フレーミング・損失回避）。
- 広告風の装飾を避け、重要情報は本文フロー内に配置する。

## 運用
- 新規画面を追加する際は、上記原則のどれを適用したか PR 本文で明記する。
- ユーザーテストやヒートマップで「認知負荷」「ブラインドネス」兆候が出た箇所を優先的に改善する。
