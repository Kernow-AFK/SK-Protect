# Changelog

## v1.1.0-beta.1 — 2026-11-14 — SKlauncher 4.0.57

- Ported the SK Protect suite to the official SKlauncher 4.0.57 Linux x86_64 AppImage beta line.
- Added Custom text colors under Settings → Appearance. Users can choose separate primary and secondary text colors, saved locally, to improve readability in dark mode and other themes.
- Added SK Protect version and release information with project website and GitHub links under Settings → About.
- Refreshed Preferred Mods with SK Protect product cards, supplied mascot artwork, a blue list treatment, and clearer checkbox wording.
- Kept the individual-instance Preferred Mods review flow and improved compatibility-aware handling; enabled compatible preferred mods can be installed automatically on each newly created instance when selected in settings.
- Retained separate privacy-only, workflow, Preferred Mods, and combined patch modes.
- Beta status: tested and built on PC3 running Linux Mint 22.3. Other operating systems and stable SKlauncher 3.2.18 are not verified/supported by this release. See the open checks in `RELEASE_CHECKLIST.md`.
- Source/docs/artwork release only. No launcher AppImage, ASAR, extracted bundle, profiles, logs, or user data are included.

## Unreleased — public testing preparation

- Restyled the Preferred Mods page with SK Protect branding, a supplied mascot artwork watermark, subdued blue mod rows, and clearer instance controls.
- Clarified that enabled compatible Preferred Mods install automatically on each new instance when that option is checked.
- Kept SKlauncher navigation and its News sidebar unchanged; described SK Protect as helping restrict personal data leakage from SKlauncher.

- Rewrote the README around player-visible privacy, browsing, multi-instance, and Preferred Mods behavior, with explicit limits and test status.
- Added contribution, security, privacy-threat-model, testing, update-design, licensing-decision, media-capture, and release-checklist documentation.
- Added player/bug issue forms and a pull-request template.
- Added a one-command combined installer for a user-supplied official AppImage; SK Protect does not download or redistribute the launcher.
- Preserved the launcher/user secure-DNS setting after finding no technical dependency that justified forcing it off.
- Hardened the build pipeline against overwriting an existing output and added repository-level checks.
- Built and statically verified all four modes from the same checksum-verified official 4.0.54 AppImage; interactive graphical testing remains pending.

This section describes work on a testing branch and is not a stable release declaration.

## Historical patch version 1.0 — 2026-10-18

Combined release of Patch 1, Patch 2, and Patch 3 for SKlauncher 4.0.54 Linux x86_64.

- Privacy controls: analytics, Discord Rich Presence, automatic updater, secure-DNS setting, and selected launcher-owned background routes.
- Multi-Instance Mod Installer: stay-on-page installation, multi-instance installation, visible selection states, and reversible uninstall marking.
- Preferred Mods Installer: persistent personal mod list, fresh provider/version resolution, per-instance compatibility review, and optional automatic application after new-instance creation.
- Added Dashboard, Library, Customization, sidebar, and per-instance entry points.
- Added isolated clean-profile testing helper.
- Kept generated AppImages, ASAR archives, accounts, worlds, instances, and extracted launcher bundles out of the repository.

## v5.1 — 2026-10-18

- Fixed automatic Preferred Mods application after a new instance is successfully created.
- Preserved the manual review/install workflow.
- Rebuilt from the untouched official 4.0.54 AppImage.

## v5 — 2026-10-17

- Added the Preferred Mods master list and provider-aware compatibility review.
- Added entry points across the launcher interface.
- Added project artwork and public-facing documentation.

## v4.4 — 2026-10-14

- Added the yellow uninstall state for installed individual mods.
- Added confirmation and manifest-aware removal.
- Added the visible green/red/dark-red selection key and invalid-updater-time guard.

## Earlier workflow patches

- Prevented successful background installs from forcing navigation away from the current Content Hub page.
- Added guarded multi-instance installation for compatible mods while retaining the original single-instance path.
