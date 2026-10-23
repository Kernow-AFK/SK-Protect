# Test results — 2026-10-18

Branch: `release/public-readiness`

## Source

- User-supplied official download: `SKlauncher-4.0.54-original.AppImage`
- Size: 148,216,841 bytes
- SHA-256 supplied by the user and independently matched after chunk reassembly: `6f7ae5220f6f1ecfe310ce37d20b67a9357209b12655ccf2772ef1243a1b8c48`
- Format observed by `file`: x86-64 ELF AppImage runtime
- Source hash after all builds: unchanged

The source, chunks, ASAR contents, generated AppImages, and build directories are Git-ignored and were not pushed.

## Successful automated builds

All builds used the same source and stopped on any failed guard or verifier.

| Mode | Result | Output size | SHA-256 |
|---|---:|---:|---|
| `privacy-only` | PASS | 148,062,184 | `806bedb8f4aeb559b3126ded72434ad296fc757f1b51184e55a5d73ae5a70005` |
| `workflow` | PASS | 148,062,184 | `6c2858d2b3b0a000eae4793077517682572a78a2003002dd851d39b7dcb279f8` |
| `preferred-mods` | PASS | 148,066,280 | `a8db3f3f6822a7e34929d8335239d361288b00a33f79a928bd80c9c845fff8ce` |
| `combined` | PASS | 148,066,280 | `ee654a2860ddba39cc960ddeb1a91c9411099b176366eb65cd88144a6d89c82c` |

The privacy allowlist cases, disabled-updater state, secure-DNS preservation, workflow guards, selection/uninstall accessibility assertions, Preferred Mods data API, store behavior, compatibility-resolution hooks, new-instance hook, and combined patch interaction all passed their automated verifiers.

## Fresh-clone reproduction

Commit `a96a104` was cloned from GitHub into a new temporary directory and tested using the same checksum-verified source. The repository checks and all four builds/verifier suites passed again. The generated AppImage hashes differed from the first run, so the present repack process is functionally repeatable but not byte-for-byte reproducible. SquashFS or copied-file timestamps are the likely cause; the hashes above identify only the first test outputs and must not be published as universal build checksums.

## Startup attempts

The untouched source and all four outputs were launched with separate empty profile roots. Every AppImage stopped before launcher code because the VM lacks `libfuse.so.2`. Extraction mode successfully enumerated the AppImage contents but could not provide a graphical run environment. The VM also has no display server or Xvfb.

This establishes identical environment-level behavior for original and patched files; it does **not** establish successful launcher startup or interactive behavior. Clean-profile UI, provider compatibility, navigation, accessibility, authentication, and runtime network tests remain manual blockers.

## Build environment note

System package installation was unavailable. SquashFS Tools 4.7.4 was built locally from its upstream tagged source with gzip support and kept under the ignored `work/` directory. This local tool was used only for repacking test outputs.
