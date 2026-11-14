# SK Protect v1.1.0-beta.1 — SKlauncher 4.0.57

## Release description

SK Protect v1.1.0-beta.1 updates the independent SK Protect patch kit for the **SKlauncher 4.0.57 Linux x86_64 AppImage**. This is a beta release for public testing on Linux Mint 22.3. It is not a stable release, and other operating systems have not been verified.

### What's included

- **Privacy controls** that disable selected optional launcher analytics, Discord Rich Presence, automatic updating, and selected launcher-owned background routes. This is a narrow launcher patch, not a firewall, antivirus, or complete network privacy tool.
- **SK Mod Installer** improvements: keep Content Hub open after installation and review compatible instances together, including installed and uninstall states.
- **SK Preferred Mods**: save a personal mod list, review compatibility for a chosen instance, skip already-installed mods, and optionally install enabled compatible mods on each new instance when the setting is checked.
- **Custom text colors** in **Settings → Appearance**. Choose local primary and secondary text colors to improve readability, including muted gray text in dark mode.
- A refreshed Preferred Mods page with SK Protect identity, supplied mascot artwork, distinct product cards, and revised colors.
- SK Protect version and project links in **Settings → About**.

### Testing and known limits

The maintainer has now interactively checked all newly added features on the current 4.0.57 candidate on PC3 running Linux Mint 22.3 and reports they work as intended. Repository and bundled build-time verifiers passed on PC3. The reported interactive test environment is Linux Mint 22.3; other operating systems are unverified. Clean-profile startup, accessibility review, provider edge cases, baseline-versus-patched network capture, and clean-environment installer/rollback checks remain open. Stable SKlauncher 3.2.18 has not been ported. See [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) and [the test record](docs/TEST-RESULTS-2026-11-12-4.0.57-beta.md).

### Installation

Download the official SKlauncher 4.0.57 AppImage from the publisher's own download flow. Keep that original unchanged for rollback. Download this repository and build a separate combined copy locally:

```bash
chmod +x install.sh SKlauncher-4.0.57.AppImage
./install.sh ./SKlauncher-4.0.57.AppImage ./SK-Protect-4.0.57-beta.1.AppImage
```

The release contains source, documentation, and project artwork only. **No SKlauncher AppImage, ASAR, extracted launcher bundle, profiles, logs, or user data are attached or redistributed.**

## Release asset policy

Publish the source tag/archive and documentation only. Do not upload the patched candidate AppImage or any launcher-derived files.
