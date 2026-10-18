#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
MODE="${1:-privacy}"
SOURCE_INPUT="${2:-${SKLAUNCHER_SOURCE:-$ROOT/backups/SKlauncher-4.0.54-original.AppImage}}"

case "$MODE" in
  privacy-only|workflow|preferred-mods|combined|privacy|navigation|multi-instance) ;;
  *) printf 'Usage: %s [privacy-only|workflow|preferred-mods|combined] /path/to/SKlauncher-4.0.54.AppImage\n' "$0" >&2; exit 2 ;;
esac

for command_name in node mksquashfs mktemp realpath; do
  command -v "$command_name" >/dev/null || {
    printf 'Missing required command: %s\n' "$command_name" >&2
    exit 1
  }
done

[[ -f "$SOURCE_INPUT" ]] || {
  printf 'Official SKlauncher AppImage not found: %s\n' "$SOURCE_INPUT" >&2
  exit 1
}
[[ -x "$SOURCE_INPUT" ]] || {
  printf 'The AppImage is not executable. Run: chmod +x %q\n' "$SOURCE_INPUT" >&2
  exit 1
}

SOURCE="$(realpath "$SOURCE_INPUT")"
WORK_ROOT="${SK_PROTECT_WORK_DIR:-$ROOT/work}"
mkdir -p "$WORK_ROOT"
BUILD_DIR="$(mktemp -d "$WORK_ROOT/build.XXXXXX")"
SQUASHFS="$BUILD_DIR/squashfs-root"
EXTRACTED="$BUILD_DIR/extracted"
PATCHED_RENDERER="$BUILD_DIR/patched-renderer.js"
PATCHED_ASAR="$BUILD_DIR/patched-app.asar"
PATCHED_SQUASHFS="$BUILD_DIR/patched.squashfs"
SOURCE_ASAR="$SQUASHFS/resources/app.asar"

case "$MODE" in
  privacy-only) DEFAULT_OUTPUT="$ROOT/SK-Protect-4.0.54-Privacy-Only.AppImage" ;;
  preferred-mods) DEFAULT_OUTPUT="$ROOT/SK-Protect-4.0.54-Preferred-Mods.AppImage" ;;
  workflow) DEFAULT_OUTPUT="$ROOT/SK-Protect-4.0.54-Workflow.AppImage" ;;
  privacy) DEFAULT_OUTPUT="$ROOT/SK-Protect-4.0.54.AppImage" ;;
  combined) DEFAULT_OUTPUT="$ROOT/SKlauncher-4.0.54-Workflow-Fixes.AppImage" ;;
  navigation) DEFAULT_OUTPUT="$ROOT/SKlauncher-4.0.54-Navigation-Fix.AppImage" ;;
  multi-instance) DEFAULT_OUTPUT="$ROOT/SKlauncher-4.0.54-Multi-Instance-Fix.AppImage" ;;
esac
OUTPUT="${SK_PROTECT_OUTPUT:-$DEFAULT_OUTPUT}"

if [[ "$(realpath -m "$OUTPUT")" == "$SOURCE" ]]; then
  printf 'Refusing to overwrite the official source AppImage.\n' >&2
  exit 1
fi

cleanup() {
  if [[ "${SK_PROTECT_KEEP_WORK:-0}" != 1 ]]; then
    rm -rf -- "$BUILD_DIR"
  else
    printf 'Kept build workspace: %s\n' "$BUILD_DIR"
  fi
}
trap cleanup EXIT

printf 'Extracting official AppImage into an isolated build directory...\n'
(
  cd "$BUILD_DIR"
  "$SOURCE" --appimage-extract >extract.log
)
[[ -f "$SOURCE_ASAR" ]] || {
  printf 'Expected resources/app.asar was not found. This may not be the matching SKlauncher 4.0.54 AppImage.\n' >&2
  exit 1
}

node "$ROOT/asar-tools.js" "$SOURCE_ASAR" extract "$EXTRACTED" \
  out/main/index.js \
  out/preload/index.js \
  out/renderer/assets/index-cw0H0b6L.js

DO_PRIVACY=0
DO_WORKFLOW=0
DO_PREFERRED=0
case "$MODE" in
  privacy-only) DO_PRIVACY=1 ;;
  preferred-mods) DO_PREFERRED=1 ;;
  workflow|navigation|multi-instance) DO_WORKFLOW=1 ;;
  combined|privacy) DO_PRIVACY=1; DO_WORKFLOW=1; DO_PREFERRED=1 ;;
esac

if [[ "$DO_PRIVACY" == 1 ]]; then
  node "$ROOT/privacy-patch.js" \
    "$EXTRACTED/out/main/index.js" \
    "$EXTRACTED/out/preload/index.js"
fi
if [[ "$DO_PREFERRED" == 1 ]]; then
  node "$ROOT/preferred-mods-patch.js" \
    "$EXTRACTED/out/main/index.js" \
    "$EXTRACTED/out/preload/index.js"
fi
if [[ "$DO_PRIVACY" == 1 ]]; then
  node --check "$EXTRACTED/out/main/index.js"
  node --check "$EXTRACTED/out/preload/index.js"
  node "$ROOT/verify-privacy.js" \
    "$EXTRACTED/out/main/index.js" \
    "$EXTRACTED/out/preload/index.js"
fi
if [[ "$DO_PREFERRED" == 1 ]]; then
  node "$ROOT/verify-preferred-mods.js" \
    "$EXTRACTED/out/main/index.js" \
    "$EXTRACTED/out/preload/index.js"
  node "$ROOT/test-preferred-mods-store.js" \
    "$EXTRACTED/out/main/index.js"
fi

if [[ "$DO_WORKFLOW" == 1 ]]; then
  WORKFLOW_MODE="$MODE"
  [[ "$MODE" == privacy || "$MODE" == workflow ]] && WORKFLOW_MODE=combined
  node "$ROOT/apply-fix.js" \
    "$EXTRACTED/out/renderer/assets/index-cw0H0b6L.js" \
    "$PATCHED_RENDERER" \
    "$WORKFLOW_MODE"
else
  cp -p "$EXTRACTED/out/renderer/assets/index-cw0H0b6L.js" "$PATCHED_RENDERER"
fi
if [[ "$DO_PREFERRED" == 1 ]]; then
  node "$ROOT/preferred-mods-ui-patch.js" "$PATCHED_RENDERER"
fi
node --check "$PATCHED_RENDERER"
if [[ "$DO_WORKFLOW" == 1 ]]; then
  node "$ROOT/verify-patch.js" "$PATCHED_RENDERER" "$WORKFLOW_MODE"
fi
if [[ "$DO_PREFERRED" == 1 ]]; then
  node "$ROOT/verify-preferred-mods-ui.js" "$PATCHED_RENDERER"
fi

if [[ "$DO_PRIVACY" == 1 || "$DO_PREFERRED" == 1 ]]; then
  node "$ROOT/pack-asar.js" \
    "$SOURCE_ASAR" \
    "$PATCHED_RENDERER" \
    "$PATCHED_ASAR" \
    "$EXTRACTED/out/main/index.js" \
    "$EXTRACTED/out/preload/index.js"
else
  node "$ROOT/pack-asar.js" \
    "$SOURCE_ASAR" \
    "$PATCHED_RENDERER" \
    "$PATCHED_ASAR"
fi
cp -p "$PATCHED_ASAR" "$SOURCE_ASAR"

RUNTIME_OFFSET="$("$SOURCE" --appimage-offset)"
node --input-type=commonjs - "$SOURCE" "$OUTPUT" "$RUNTIME_OFFSET" <<'NODE'
const fs = require('node:fs');
const [source, output, rawOffset] = process.argv.slice(2);
const offset = Number(rawOffset);
if (!Number.isSafeInteger(offset) || offset <= 0) throw new Error('Invalid AppImage runtime offset');
const input = fs.openSync(source, 'r');
const target = fs.openSync(output, 'w', 0o755);
try {
  const buffer = Buffer.alloc(offset);
  const count = fs.readSync(input, buffer, 0, offset, 0);
  if (count !== offset) throw new Error('Could not copy complete AppImage runtime prefix');
  fs.writeSync(target, buffer);
} finally {
  fs.closeSync(input);
  fs.closeSync(target);
}
NODE

mksquashfs "$SQUASHFS" "$PATCHED_SQUASHFS" -noappend -comp gzip -b 131072 >/dev/null
node --input-type=commonjs - "$PATCHED_SQUASHFS" "$OUTPUT" <<'NODE'
const fs = require('node:fs');
const [source, output] = process.argv.slice(2);
const input = fs.openSync(source, 'r');
const target = fs.openSync(output, 'a');
const buffer = Buffer.allocUnsafe(1024 * 1024);
try {
  let position = 0;
  while (true) {
    const count = fs.readSync(input, buffer, 0, buffer.length, position);
    if (count === 0) break;
    fs.writeSync(target, buffer, 0, count);
    position += count;
  }
} finally {
  fs.closeSync(input);
  fs.closeSync(target);
}
NODE

chmod 755 "$OUTPUT"
printf 'Built: %s\n' "$OUTPUT"
stat -c 'mode=%a size=%s' "$OUTPUT"

if [[ -n "${SKLAUNCHER_DESKTOP_COPY:-}" ]]; then
  install -m 755 "$OUTPUT" "$SKLAUNCHER_DESKTOP_COPY"
  printf 'Updated requested copy: %s\n' "$SKLAUNCHER_DESKTOP_COPY"
fi

printf '\nTest without touching your normal SKlauncher profile:\n'
printf '  bash %q %q\n' "$ROOT/run-isolated.sh" "$OUTPUT"
