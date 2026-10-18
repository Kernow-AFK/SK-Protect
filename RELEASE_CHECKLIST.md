# Public testing release checklist

## Completed in the public-readiness branch

- [x] Audit repository layout, recent history, tracked artifacts, and available tests.
- [x] Preserve standalone privacy, workflow, Preferred Mods, and combined modes.
- [x] Document privacy scope, boundaries, failure modes, and observed-versus-inferred evidence.
- [x] Stop forcing secure DNS off; preserve the user/upstream setting.
- [x] Add contribution, security, testing, update-design, licensing-decision, and media guidance.
- [x] Add safe combined-build convenience entry point using a user-supplied official AppImage.

## Blocked decisions

- [ ] **Maintainer: choose MIT or Apache-2.0 and confirm ownership/scope before `LICENSE` is added.**
- [ ] Confirm an authoritative official 4.0.54 checksum/signature or document that none is offered.
- [ ] Confirm a stable official version/release-note mechanism before any update-check implementation.
- [ ] Provide the future Ko-fi URL; donations remain optional and secondary to participation.

## Required verification before promotion

- [x] Build all four modes from the same untouched official AppImage; all patch guards and bundled verifiers passed. See `docs/TEST-RESULTS-2026-10-18.md`.
- [x] Clone the pushed branch into a fresh directory and reproduce all four successful builds and verifier suites.
- [ ] Decide whether byte-for-byte reproducible AppImages are required; current clean rebuilds pass functionally but produce different hashes because build metadata is not normalized.
- [ ] Run clean-profile startup and the full manual matrix in `docs/TESTING.md`.
- [ ] Capture baseline-versus-patched network evidence; label observed and inferred results separately.
- [x] Confirm the secure-DNS correction in real privacy and combined builds through bundled verification; runtime settings inspection remains part of manual UI testing.
- [ ] Verify installer and rollback on a clean Linux x86_64 environment.
- [ ] Review UI help, keyboard navigation, contrast, screen-reader labels, and no-colour-only states interactively.
- [ ] Test unsupported Preferred Mods reporting; current automatic path logs skips and needs user-visible reporting review.

## Media — do not close without maintainer approval

- [ ] **Maintainer supplies or approves real screenshots A–E.**
- [ ] **Maintainer supplies or approves the real demonstration video.**
- [ ] Add approved media provenance and verify that no private information is exposed.

## GitHub administration

- [ ] Set repository description and topics in GitHub settings.
- [x] Configure `feedback` and `needs-triage` issue labels used by templates.
- [ ] Publish only after release artifacts and manual evidence are reviewed; do not label this branch stable yet.

The connected GitHub token could create labels but returned HTTP 403 for repository metadata. Description/topics therefore require a maintainer action in GitHub settings.
