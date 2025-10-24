#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: tools/codex-commit.sh \"<task/prompt>\" [branch] [msg]"
  exit 1
fi

TASK="$1"
BRANCH="${2:-codex/$(date +%Y%m%d-%H%M%S)}"
MSG="${3:-Codex: $TASK}"

# 確実に最新状態へ
git fetch origin || true

# ブランチ作成/切替
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git switch "$BRANCH"
else
  git switch -c "$BRANCH"
fi

# Codexに書き換えさせる（指示書を読みつつ apply）
if [ -f CODEX.md ]; then
  codex -f CODEX.md --apply "$TASK"
else
  codex --apply "$TASK"
fi

# チェック（失敗してもコミットは阻害しないが、ログには出す）
npm run lint --silent || echo "[warn] lint failed"
npm run typecheck || echo "[warn] typecheck failed"
npm run build || echo "[warn] build failed"

# 変更があればコミット→プッシュ
if ! git diff --quiet; then
  git add -A
  git commit -m "$MSG" || true
  git push -u origin "$BRANCH"
  # GitHub CLI があればPRを自動作成
  if command -v gh >/dev/null 2>&1; then
    gh pr create --head "$BRANCH" --base main --title "$MSG" --body "Automated by Codex.\n\nTask:\n$TASK" || true
  fi
else
  echo "No changes produced by Codex."
fi
