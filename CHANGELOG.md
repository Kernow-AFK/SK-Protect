# Changelog

## Final Version 1.0 — 2026-10-18

Combined release of Patch 1, Patch 2, and Patch 3 for SKlauncher 4.0.54 Linux x86_64.

- Privacy controls: analytics, Discord Rich Presence, automatic updater, secure-DNS setting, and selected launcher-owned background routes.
- Workflow controls: stay-on-page installation, multi-instance installation, visible selection states, and reversible uninstall marking.
- Preferred Mods: persistent personal mod list, fresh provider/version resolution, per-instance compatibility review, and optional automatic application after new-instance creation.
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
