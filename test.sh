#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

for file in ./*.js; do node --check "$file"; done
for file in ./*.sh; do bash -n "$file"; done

if find . -type f \( -name '*.AppImage' -o -name '*.asar' \) -print -quit | grep -q .; then
  printf 'FAIL: proprietary/generated launcher artifact found in repository\n' >&2
  exit 1
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf -- "$tmp_dir"' EXIT
touch "$tmp_dir/source.AppImage"
chmod 755 "$tmp_dir/source.AppImage"
touch "$tmp_dir/output.AppImage"
if ./patch.sh combined "$tmp_dir/source.AppImage" "$tmp_dir/output.AppImage" >"$tmp_dir/out" 2>&1; then
  printf 'FAIL: patch.sh accepted an existing output\n' >&2
  exit 1
fi
grep -q 'Refusing to overwrite an existing output' "$tmp_dir/out"

for doc in README.md CONTRIBUTING.md SECURITY.md RELEASE_CHECKLIST.md docs/PRIVACY-THREAT-MODEL.md docs/TESTING.md; do
  [[ -s "$doc" ]] || { printf 'FAIL: missing documentation: %s\n' "$doc" >&2; exit 1; }
done

printf 'PASS: repository syntax, hygiene, documentation, and installer refusal checks\n'
