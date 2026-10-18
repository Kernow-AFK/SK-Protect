#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

if [[ $# -lt 1 || $# -gt 2 ]]; then
  printf 'Usage: %s /path/to/existing-SKlauncher.AppImage [/path/to/output.AppImage]\n' "$0" >&2
  exit 2
fi

SOURCE_INPUT="$1"
[[ -f "$SOURCE_INPUT" ]] || {
  printf 'SKlauncher AppImage not found: %s\n' "$SOURCE_INPUT" >&2
  exit 1
}
[[ -x "$SOURCE_INPUT" ]] || {
  printf 'The AppImage is not executable. Run: chmod +x %q\n' "$SOURCE_INPUT" >&2
  exit 1
}

SOURCE="$(realpath "$SOURCE_INPUT")"
if [[ $# -eq 2 ]]; then
  OUTPUT="$(realpath -m "$2")"
else
  OUTPUT="$(dirname "$SOURCE")/SK-Protect-4.0.54.AppImage"
fi

if [[ "$OUTPUT" == "$SOURCE" ]]; then
  printf 'Refusing to overwrite the existing SKlauncher AppImage.\n' >&2
  exit 1
fi
if [[ -e "$OUTPUT" ]]; then
  printf 'Refusing to overwrite an existing output: %s\n' "$OUTPUT" >&2
  printf 'Move it aside or provide a different output path as the second argument.\n' >&2
  exit 1
fi

printf 'Source launcher (kept unchanged): %s\n' "$SOURCE"
printf 'New SK Protect launcher:          %s\n' "$OUTPUT"

SK_PROTECT_OUTPUT="$OUTPUT" bash "$ROOT/build-appimage.sh" combined "$SOURCE"

printf '\nPatch complete. Your existing SKlauncher profile was not edited during the build.\n'
printf 'Run the new AppImage normally to use that existing profile:\n'
printf '  %q\n' "$OUTPUT"
printf '\nKeep the original AppImage for rollback.\n'
