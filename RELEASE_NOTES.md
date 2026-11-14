# SK Protect release notes

## v1.1.0-beta.1 — SKlauncher 4.0.57 — 2026-11-14

This beta combines the SK Protect privacy controls, SK Mod Installer workflow changes, and SK Preferred Mods for the official SKlauncher 4.0.57 Linux x86_64 AppImage.

- Add Custom text colors under Settings → Appearance, with locally saved primary and secondary text choices for headings and supporting text.
- Add SK Protect version information and website/GitHub links under Settings → About.
- Refresh Preferred Mods branding and presentation, including a supplied project image and three product cards.
- Apply enabled compatible Preferred Mods automatically to each new instance when the option is enabled; keep existing instances under user review.
- Keep installed preferred mods from being installed a second time when applying the list to an instance.

This is a beta, not a stable release. The maintainer reports testing on Linux Mint 22.3 only. Stable SKlauncher 3.2.18 and other operating systems are not supported by this build. Clean-profile startup, accessibility, provider edge cases, network comparison, and clean-environment installer/rollback checks remain open. See [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

Build from the official AppImage obtained directly from SKlauncher's publisher. The GitHub release contains source, documentation, and project artwork only; it does not include launcher-derived files.

## Historical patch version 1.0 notes

> Historical notes for the 4.0.54 implementation. They do not describe a current stable release. The SKlauncher 4.0 line is beta; stable 3.2.18 has not been ported. Current beta candidate status and verification are tracked in [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

Version 1.0 was the combined SK Protect patch for SKlauncher 4.0.54 Linux x86_64.

It is intended for a person who already has the official launcher installed. They download their own official AppImage, run the selected local patch, and receive a separate patched AppImage. The original remains available for rollback.

The combined build includes:

1. Privacy controls and narrower launcher-owned network policy.
2. Multi-Instance Mod Installer: Content Hub and multi-instance workflow improvements.
3. Preferred Mods Installer, including optional automatic application to newly created instances.

The project makes no allegation that SKlauncher developers collect or sell personal data. The aim is user-controlled reduction of optional routes and convenience improvements. Review the limitations before use, keep the official source AppImage, and test a clean profile before using the patched copy with important worlds or accounts.
