#!/usr/bin/env bash
# Deploy aeio: commit + push to main. GitHub Actions builds and publishes
# to https://richardli03.github.io/aeio/
#
# Usage:  depaeio ["commit message"]
set -euo pipefail

# Run from the repo root regardless of where it's called.
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REPO_URL="https://github.com/richardli03/aeio"
LIVE_URL="https://richardli03.github.io/aeio/"
# Default message is a valid Conventional Commit (see CLAUDE.md). Pass your own
# as the first arg, also in Conventional Commits form, e.g.
#   depaeio 'feat(songs): add best of me'
msg="${1:-chore(deploy): publish $(date '+%Y-%m-%d %H:%M')}"

branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" != "main" ]; then
  echo "✗ on '$branch', not 'main'. Pages only deploys from main. Aborting." >&2
  exit 1
fi

git add -A
if git diff --cached --quiet; then
  echo "• no changes to commit."
else
  git commit -m "$msg"
fi

echo "• pushing to origin/main…"
git push origin main

echo
echo "✓ pushed. Actions is building now."
echo "  watch:  ${REPO_URL}/actions"
echo "  live:   ${LIVE_URL}  (updates when the run goes green)"
