#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
if [[ $# -lt 2 || $# -gt 3 ]]; then
  printf 'Usage: %s [privacy-only|workflow|preferred-mods|combined] /path/to/SKlauncher.AppImage [/path/to/output.AppImage]\n' "$0" >&2
  exit 2
fi

MODE="$1"
SOURCE_INPUT="$2"
[[ -f "$SOURCE_INPUT" ]] || { printf 'SKlauncher AppImage not found: %s\n' "$SOURCE_INPUT" >&2; exit 1; }
[[ -x "$SOURCE_INPUT" ]] || { printf 'The AppImage is not executable. Run: chmod +x %q\n' "$SOURCE_INPUT" >&2; exit 1; }

SOURCE="$(realpath "$SOURCE_INPUT")"
if [[ $# -eq 3 ]]; then
  OUTPUT="$(realpath -m "$3")"
else
  case "$MODE" in
    privacy-only) OUTPUT="$(dirname "$SOURCE")/SK-Protect-4.0.54-Privacy-Only.AppImage" ;;
    workflow) OUTPUT="$(dirname "$SOURCE")/SK-Protect-4.0.54-Multi-Instance-Mod-Installer.AppImage" ;;
    preferred-mods) OUTPUT="$(dirname "$SOURCE")/SK-Protect-4.0.54-Preferred-Mods-Installer.AppImage" ;;
    combined) OUTPUT="$(dirname "$SOURCE")/SK-Protect-4.0.54-Final-1.0.AppImage" ;;
    *) printf 'Unknown patch: %s\n' "$MODE" >&2; exit 2 ;;
  esac
fi

[[ "$OUTPUT" != "$SOURCE" ]] || { printf 'Refusing to overwrite the source AppImage.\n' >&2; exit 1; }
[[ ! -e "$OUTPUT" ]] || { printf 'Refusing to overwrite an existing output: %s\n' "$OUTPUT" >&2; exit 1; }

SK_PROTECT_OUTPUT="$OUTPUT" bash "$ROOT/build-appimage.sh" "$MODE" "$SOURCE"
printf '\nCreated: %s\nKeep the original AppImage for rollback.\n' "$OUTPUT"
