#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
APPIMAGE_INPUT="${1:-$ROOT/SK-Protect-4.0.54.AppImage}"
PROFILE_ROOT="${2:-$ROOT/test-profile}"

[[ -f "$APPIMAGE_INPUT" ]] || {
  printf 'Patched AppImage not found: %s\n' "$APPIMAGE_INPUT" >&2
  exit 1
}
[[ -x "$APPIMAGE_INPUT" ]] || {
  printf 'The AppImage is not executable: %s\n' "$APPIMAGE_INPUT" >&2
  exit 1
}

if [[ -e "$PROFILE_ROOT" ]] && find "$PROFILE_ROOT" -mindepth 1 -print -quit | grep -q .; then
  printf 'Refusing to reuse a non-empty test profile: %s\n' "$PROFILE_ROOT" >&2
  printf 'Choose a new folder as the second argument.\n' >&2
  exit 1
fi

mkdir -p \
  "$PROFILE_ROOT/home" \
  "$PROFILE_ROOT/config" \
  "$PROFILE_ROOT/data" \
  "$PROFILE_ROOT/cache"

APPIMAGE="$(realpath "$APPIMAGE_INPUT")"
PROFILE_ROOT="$(realpath "$PROFILE_ROOT")"

printf 'Launching with an isolated profile. Normal ~/.sklauncher and ~/.config/sklauncher are not used.\n'
printf 'Test profile: %s\n' "$PROFILE_ROOT"

exec env \
  HOME="$PROFILE_ROOT/home" \
  XDG_CONFIG_HOME="$PROFILE_ROOT/config" \
  XDG_DATA_HOME="$PROFILE_ROOT/data" \
  XDG_CACHE_HOME="$PROFILE_ROOT/cache" \
  "$APPIMAGE"
