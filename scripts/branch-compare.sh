#!/usr/bin/env bash
set -euo pipefail

# Compare origin/main with all origin/* branches and report any files present in a branch but missing from main
# Written for bash. On Windows run under WSL or Git Bash.

REMOTE="origin"
MAIN_REF="${REMOTE}/main"

tmpdir() {
  mktemp -d 2>/dev/null || mktemp -d -t branch-compare
}

WORKDIR=$(pwd)
OUT_DIR=$(mktemp -d)
REPORT="$OUT_DIR/branch-compare-report.txt"

echo "Fetching ${REMOTE}..."
git fetch "$REMOTE" --prune --quiet

echo "Listing files in ${MAIN_REF}..."
git ls-tree -r --name-only "$MAIN_REF" | sort > "$OUT_DIR/main-files.txt"

echo "Enumerating remote branches..."
git for-each-ref --format='%(refname:short)' refs/remotes/$REMOTE | grep -v '^HEAD$' | while read -r remote_branch; do
  # skip main itself
  if [ "$remote_branch" = "${REMOTE}/main" ]; then
    continue
  fi
  branch_name=${remote_branch#${REMOTE}/}
  echo "Checking branch: $branch_name"
  git ls-tree -r --name-only "$remote_branch" | sort > "$OUT_DIR/${branch_name}-files.txt" || true

  # files present in branch but missing from main
  missing=$(comm -23 "$OUT_DIR/${branch_name}-files.txt" "$OUT_DIR/main-files.txt" || true)
  if [ -n "$missing" ]; then
    echo "Branch: $branch_name" >> "$REPORT"
    echo "Files present in ${branch_name} but not in main:" >> "$REPORT"
    echo "$missing" >> "$REPORT"
    echo "" >> "$REPORT"
  fi
done

if [ -f "$REPORT" ]; then
  echo "Discrepancies found. See report: $REPORT"
  cat "$REPORT"
  exit 2
else
  echo "All remote branches' files are contained in ${MAIN_REF}."
  exit 0
fi
