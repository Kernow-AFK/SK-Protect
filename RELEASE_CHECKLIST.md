# Public testing release checklist

## Current channel and candidate status — 2026-11-12

- The publisher labels 3.2.18 stable and 4.0 beta. The current patch implementation targets the 4.0 Electron/AppImage codebase; stable 3.2.18 is a separate Java `.jar` product and has not been ported.
- 4.0.57 privacy-only, workflow, Preferred Mods, and combined AppImages have been built from the untouched official 4.0.57 source. They are beta candidates, not stable release artifacts.
- Privacy-only and combined beta candidates reached `Initialization complete` under isolated Xvfb startup. This does not establish interactive UI behavior. Preferred Mods and workflow candidates still need startup and full interactive testing.
- No build is promoted. Stable support, manual interaction, accessibility, provider compatibility, network comparison, and rollback remain blockers.

## 4.0.57 latest-version revalidation — 2026-11-13

- [x] Confirm 4.0.57 remains the latest 4.0 release listed by the official binaries release page; 4.0 remains beta and stable remains 3.2.18.
- [x] Recheck hashes for the untouched 4.0.57 source, all four candidate AppImages, and the PC3 Desktop combined candidate.
- [x] Extract the exact renderer, main, and preload bundles from all four candidates without launching them; JavaScript syntax and each applicable privacy, workflow, Preferred Mods, store, and combined verifier passed.
- [ ] Interactive clean-profile testing, provider responses, accessibility, baseline network capture, and rollback remain outstanding.

## Preferred Mods page lifecycle correction — 2026-11-13

- [x] Remove the mounted Preferred Mods page when navigating to any other route and prevent duplicate page roots when opening it again.
- [x] Build a new combined 4.0.57 beta candidate and verify its packaged main, preload, and renderer syntax plus privacy, Preferred Mods, store, combined-patch, and UI lifecycle checks.
- [x] Place a separately named, SHA-256-verified copy on the PC3 Desktop while preserving the previous candidate.
- [ ] Maintainer manually verifies entering Preferred Mods from Customization, navigating to other screens, and returning without a persistent or duplicated banner. Candidate: `SK-Protect-4.0.57-BETA-Combined-page-lifecycle-fix-candidate.AppImage` on PC3 Desktop.

### Screenshot follow-up

- [x] Record that the first lifecycle candidate still showed Preferred Mods over instance detail; that manual check failed.
- [x] Correct both app-shell route renderers to clear the section when their `currentPage` becomes any other route, including instance detail.
- [x] Build and place a replacement combined beta candidate on PC3 Desktop: `SK-Protect-4.0.57-BETA-Combined-instance-route-fix-candidate.AppImage` (SHA-256 `cff1d5321c1ac3535d35139d4b62018f69ade9193328d627d35e8d3fd846c692`).
- [ ] Maintainer repeats the route-switch test on the replacement candidate; keep release status beta until accepted.

## Preferred Mods flow follow-up — 2026-11-13

- [x] Put Apply to Instance on the selector row and show “Select instance…” before a selection is made.
- [x] Make Add Mods navigate to Content Hub through the app page callback, set the Mods filter, and change the card action to “Add to Preferred Mods” only in that flow; normal Content Hub installation remains the default.
- [x] Pass build-time UI, privacy, combined-patch, store, and batch-install verifiers.
- [x] Place a distinct candidate on PC3 Desktop: `SK-Protect-4.0.57-BETA-Combined-preferred-mods-flow-candidate.AppImage` (SHA-256 `64e075281df9e01ff603c289395a7f00b4ec97898724691bc0da85267c08a412`).
- [ ] Maintainer manually tests selector default, Add Mods navigation/filter/label, adding a mod, and ordinary Content Hub Install behavior. Keep beta until confirmed.

### Sidebar route correction

- [x] Replace the ineffective content-layout navigation callback with the launcher's actual sidebar `onNavigate({page})` handler.
- [x] Rebuild and place `SK-Protect-4.0.57-BETA-Combined-preferred-mods-navigation-fix-candidate.AppImage` on PC3 Desktop (SHA-256 `fbd94397f0cd29db687a1fafef9725097f6e3279491bf6563d33244b451c6fdc`).
- [ ] Maintainer confirms Add Mods opens the Mods-filtered Content Hub directly and the standard Content Hub still installs normally.

## Instance apply follow-up — 2026-11-13

- [x] Add a shortcut beside the individual instance page's Add action; carry the instance ID into Preferred Mods so it is selected for Apply.
- [x] Restrict release lookup to that instance's Minecraft version and loader.
- [x] Skip entries already installed in the selected instance; install only missing enabled preferred mods through the launcher's normal installation API.
- [x] Pass the updated route, version/loader, installed-mod, installation, privacy, store, and combined build verifiers.
- [x] Place `SK-Protect-4.0.57-BETA-Combined-instance-version-aware-candidate.AppImage` on PC3 Desktop (SHA-256 `3f356e2fb64dc9701d198c558af7b5d94194b98eb8e879e2df8994aceb23aea8`).
- [ ] Maintainer tests the instance shortcut and confirms correct loader/version selection, installed-mod skipping, and successful installation of missing mods. Keep beta until confirmed.

## Instance-page review dialog and SK Protect help links — 2026-11-14

- [x] Change the individual instance page shortcut to open a modal over the current instance rather than navigating to Preferred Mods.
- [x] Resolve enabled preferred mods against the current instance's Minecraft version and loader; mark compatible missing mods for installation, allow toggling them off, skip installed mods, and show incompatible releases as unavailable.
- [x] Add Cancel and Apply controls plus feedback links to the modal.
- [x] Add a separate “Part of SK Protect” info section on the Preferred Mods page with the GitHub README and maintainer-provided project website.
- [x] Build `SK-Protect-4.0.57-BETA-Combined-instance-preferred-review-candidate-v2.AppImage` from the official 4.0.57 AppImage and place a checksum-matched executable copy on PC3 Desktop (SHA-256 `841a3d5642de6c3a2713674464c6937011bbcd45060dcabda2ad3b180a88c3e0`).
- [ ] Maintainer interactively checks available/unavailable/installed rows, toggling, Cancel without changes, Apply to the current instance only, and both help links. Keep beta until accepted.

## Preferred Mods add-mode session correction — 2026-11-13

- [x] Keep all mod cards in “Add to Preferred Mods” mode after the first addition during the same Add Mods Content Hub visit.
- [x] Keep the content type pinned to Mods in that visit; clear the temporary mode when leaving Content Hub so normal visits use normal Install.
- [x] Build and place `SK-Protect-4.0.57-BETA-Combined-preferred-mode-session-candidate.AppImage` on PC3 Desktop (SHA-256 `576f880eaeeb99c751b97dd815c7cadf2e2ea74fc2037190f2268618ea50ddf1`).
- [ ] Maintainer verifies multiple preferred additions in one visit and normal Install after leaving and reopening Content Hub.

## Completed in the public-readiness branch

- [x] Audit repository layout, recent history, tracked artifacts, and available tests.
- [x] Preserve standalone privacy, workflow, Preferred Mods, and combined modes.
- [x] Document privacy scope, boundaries, failure modes, and observed-versus-inferred evidence.
- [x] Stop forcing secure DNS off; preserve the user/upstream setting.
- [x] Add contribution, security, testing, update-design, licensing-decision, and media guidance.
- [x] Add safe combined-build convenience entry point using a user-supplied official AppImage.

## Blocked decisions

- [x] **Maintainer chose MIT and confirmed ownership of the original scripts, tests, documentation, and artwork.** The licence is scoped to those materials; SKlauncher's proprietary materials remain excluded.
- [x] Confirm the maintainer's official 4.0.54 source AppImage locally. SHA-256: `6f7ae5220f6f1ecfe310ce37d20b67a9357209b12655ccf2772ef1243a1b8c48`.
- [ ] Confirm a stable official version/release-note mechanism before any update-check implementation.
- [ ] Provide the future Ko-fi URL; donations remain optional and secondary to participation.

Stable-source investigation: PC3 contains no 3.2.18 JAR. The publisher page identifies Linux stable as a JAR, but its download control was still loading and blocked by the page's anti-adblock challenge during this check. No download URL has been guessed and no third-party mirror has been used.

## Required verification before promotion

- [x] Build all four modes from the same untouched official AppImage; all patch guards and bundled verifiers passed. See `docs/TEST-RESULTS-2026-10-18.md` and the local ignored outputs under `backups/`.
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

## Preferred Mods branding and automatic-install wording — 2026-11-14

- [x] Restyle the Preferred Mods center page with the supplied `sk-my-mods-v2.webp` mascot artwork, a subdued blue list panel, green instance control, amber Remove controls, and larger checkboxes.
- [x] Describe the checkbox accurately: enabled compatible Preferred Mods install automatically on each new instance.
- [x] Update the 4.0.57 instance-created hook to run compatibility-filtered automatic installation without navigating away to the Preferred Mods page.
- [x] Describe SK Protect as helping restrict personal data leakage from SKlauncher; keep the launcher icon rail and News sidebar unchanged.
- [x] Run repository checks and all bundled privacy, store, workflow, Preferred Mods, combined, and UI verifiers on PC3.
- [x] Build the combined candidate from official `SKlauncher-4.0.57-x86_64.AppImage` (source SHA-256 `ff117d7519f6d036897312b79ae9a1a7be695a75d43bb06576ab6b56791140f9`): `SK-Protect-4.0.57-BETA-Combined-branding-auto-install-candidate.AppImage`, SHA-256 `02826caad1bfb79b48f14839c44807f9a692b092987fed13a544c589513393d3`.
- [x] Copy the executable candidate to PC3 Desktop and verify its SHA-256 matches the build output. Earlier desktop candidates were preserved.
- [ ] Maintainer manually tests the visual treatment, checkbox auto-install behavior, instance routes, and unchanged News sidebar. Keep this as a beta candidate until accepted.

### Screenshot follow-up: branding layout — 2026-11-14

- [x] Adjust the brand panel so its mascot artwork remains visible in a dedicated area instead of collapsing into the heading.
- [x] Darken the mod-list watermark so it no longer competes with names and controls; retain the blue row styling, green instance control, and amber Remove controls.
- [x] Run `./test.sh` and the combined build-time verifier suite on PC3; all checks passed.
- [x] Build from the unchanged official 4.0.57 source and place the executable candidate on PC3 Desktop: `SK-Protect-4.0.57-BETA-Combined-branding-layout-fix-candidate.AppImage`, SHA-256 `7f1685597337054133d32c1ba395c9e33238b986b59d782cb0ef43c5c98454e1`. The build output and Desktop copy hashes match.
- [ ] Maintainer visually checks this candidate and confirms the Preferred Mods controls and unchanged News panel interact as expected. Do not publish before that review.

### Follow-up: requested color hierarchy — 2026-11-14

- [x] Give the SK Protect feature panel and automatic-install section distinct blue treatments; shade the three suite tiles individually.
- [x] Keep the mascot artwork visible behind the mod rows and add a restrained red tint behind the amber Remove controls.
- [x] Run `./test.sh` and the combined build-time verification suite on PC3; all checks passed.
- [x] Build from the unchanged official 4.0.57 source and place the executable candidate on PC3 Desktop: `SK-Protect-4.0.57-BETA-Combined-color-hierarchy-candidate.AppImage`, SHA-256 `a2ef7ce73742fca215b90dec6f7536a5a3a7e3847f7ec3575938121338febf8a`. Build and Desktop copy hashes match.
- [ ] Maintainer visually accepts the color and artwork treatment and confirms interactive behavior. Keep the release beta until then.

### Follow-up: product cards and image gradient — 2026-11-14

- [x] Keep the mascot art at the left of the SK Protect panel and restore a shield mark beside the Preferred Mods title.
- [x] Restyle the three suite tiles as distinct product cards with individual pictograms, diagonal accents, and blue/purple gradients.
- [x] Make the mod-list background and row fills fade horizontally toward greater transparency so the supplied image shows through more on the right while keeping labels readable.
- [x] Pass `./test.sh` and the full combined build-time verifier suite on PC3.
- [x] Build from the unchanged official 4.0.57 source and place the executable candidate on PC3 Desktop: `SK-Protect-4.0.57-BETA-Combined-product-cards-candidate.AppImage`, SHA-256 `c229597d6af410bc27ddf7196b68d1ad3a9543d1b63664790bc1d53f538e3322`. Build and Desktop hashes match.
- [ ] Maintainer visually accepts the product cards, shield, and image gradient. Keep the release beta pending that review.

### About release details and custom text colors — 2026-11-14

- [x] Add an SK Protect About card with the current beta-candidate identifier, latest published project version, and external website/GitHub links.
- [x] Add primary and secondary text color pickers to Appearance; save choices in local storage and apply them to bright heading text and muted gray utility text.
- [x] Run repository checks and all combined build-time privacy, workflow, Preferred Mods, UI, and Settings verifiers on PC3.
- [x] Build from the unchanged official 4.0.57 source and copy the executable candidate to PC3 Desktop: `SK-Protect-4.0.57-BETA-Combined-about-appearance-colors-candidate.AppImage`, SHA-256 `2ff9f92af0b8c5ec459932e81e2ec34fcdfc2f8214c4d57258d988e2e9bcf8fb`. Build and Desktop hashes match.
- [ ] Maintainer confirms both About links, saved color picker behavior, and readability across instances and mod pages. Do not publish before interactive review.

#### Settings observer refinement

- [x] Coalesce Settings DOM rescans to one per animation frame and observe both tab content and text changes.
- [x] Rebuild and verify the final candidate: `SK-Protect-4.0.57-BETA-Combined-about-appearance-colors-v2-candidate.AppImage`, SHA-256 `59354d41a68b906732c41b30777c1663a9a73103bc28c982d36c997f66948fa8`; matching executable copy is on PC3 Desktop.
- [ ] Maintain the interactive review gate above.

#### Appearance panel spacing correction

- [x] Place the Custom text colors panel after the full Layout card and give it a full-width row, so it no longer occupies the row beside “Open details on instance click.”
- [x] Pass the full combined verification suite and build from the unchanged official source.
- [x] Install the corrected candidate on PC3 Desktop: `SK-Protect-4.0.57-BETA-Combined-about-appearance-colors-v3-layout-candidate.AppImage`, SHA-256 `e2c6ac1f3675945140ae405f7d44f3c3f180d11b7864fc34d68158da77e3f2bb`; Desktop and build hashes match.
- [ ] Maintainer confirms the separate row visually in Appearance settings.
