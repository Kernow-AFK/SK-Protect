# Contributing to SK Protect

SK Protect is the maintainer's first public open-source software project. Constructive criticism is welcome, including criticism of the architecture, threat model, patch guards, installer safety, usability, accessibility, tests, documentation, and rollback process.

## Before opening an issue

1. Confirm that you used the official SKlauncher 4.0.54 Linux x86_64 AppImage.
2. State which patch mode you used: `privacy-only`, `workflow`, `preferred-mods`, or `combined`.
3. Include the SK Protect commit or release, distribution, Node.js version, and `mksquashfs -version` output.
4. Remove usernames, account details, tokens, local private paths, server addresses, and launcher logs that contain private data.
5. Explain whether the result came from an automated check or a manual launcher test.

Security reports should follow [SECURITY.md](SECURITY.md), not a public issue.

## Pull requests

- Keep changes version-specific and guarded. A missing or repeated upstream anchor must stop the build.
- Do not commit an AppImage, ASAR, extracted SKlauncher source, account data, instance data, worlds, logs, or proprietary assets.
- Preserve each standalone patch and the combined build.
- Add or update verification for every patch transformation.
- Run `./test.sh` and report the result. If you have a legally obtained 4.0.54 AppImage, also build every mode and test with a disposable profile.
- Separate observed behavior from conclusions inferred from source.
- Keep UI controls keyboard accessible, labelled, understandable without colour, and usable at normal zoom.

By contributing, you affirm that you have the right to submit your work. The project licence is still awaiting an explicit maintainer choice; substantial contributions should wait until that decision is recorded in `LICENSE`.

## Developer test matrix

Run the repository-only checks:

```bash
./test.sh
```

With an official source AppImage, create all four outputs at distinct paths:

```bash
./patch.sh privacy-only ./SKlauncher-4.0.54.AppImage ./out/privacy.AppImage
./patch.sh workflow ./SKlauncher-4.0.54.AppImage ./out/workflow.AppImage
./patch.sh preferred-mods ./SKlauncher-4.0.54.AppImage ./out/preferred.AppImage
./patch.sh combined ./SKlauncher-4.0.54.AppImage ./out/combined.AppImage
```

Use a fresh directory with `run-isolated.sh` for each launch. The manual checks and expected evidence are tracked in [docs/TESTING.md](docs/TESTING.md).
