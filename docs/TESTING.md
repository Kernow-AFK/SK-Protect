# Testing and release evidence

## Automated checks available without SKlauncher

Run `./test.sh`. It checks JavaScript and shell syntax, repository hygiene, privacy allowlist behavior, safe installer refusal paths, documentation links, and the Preferred Mods store fixture where possible.

## Full build matrix (official AppImage required)

Build `privacy-only`, `workflow`, `preferred-mods`, and `combined` from the same untouched official 4.0.54 Linux x86_64 AppImage. Record source hash locally, output hashes, patch output, and verification output. Confirm that the source hash does not change and every output path is new.

The latest recorded automated matrix is [TEST-RESULTS-2026-10-18.md](TEST-RESULTS-2026-10-18.md).

## Manual clean-profile matrix

- Untouched launcher starts from a disposable profile and remains usable.
- Each of the four patched builds starts from its own disposable profile.
- Privacy build: analytics/RPC/updater state and baseline-versus-patched traffic are observed.
- Workflow build: install into compatible and incompatible instances; selected, not selected, unavailable, and uninstall states work by mouse and keyboard; installation completion does not navigate away.
- Preferred Mods build: add, disable, enable, remove, review, exclude, and apply mods to existing instances; create a new instance with automatic application off and on; incompatible releases are skipped and reported.
- Combined build repeats the critical paths to detect patch interaction.
- UI help is reachable by Tab, visible on focus/hover, labelled to screen readers, understandable without colour, and does not cover controls.
- Rollback launches the untouched source AppImage and does not require deleting the patched output or profile.

Do not mark a row tested from source inspection alone. Record distribution, desktop session, display scale, launcher login state, Minecraft/loader versions, provider, test project, expected result, actual result, and redacted evidence.
