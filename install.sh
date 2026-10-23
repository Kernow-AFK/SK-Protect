#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

if [[ $# -lt 1 || $# -gt 2 ]]; then
  printf 'Usage: %s /path/to/official-SKlauncher-4.0.54.AppImage [/path/to/output.AppImage]\n' "$0" >&2
  exit 2
fi

SOURCE_INPUT="$1"
if [[ $# -eq 2 ]]; then
  exec bash "$ROOT/patch.sh" combined "$SOURCE_INPUT" "$2"
fi
exec bash "$ROOT/patch.sh" combined "$SOURCE_INPUT"
