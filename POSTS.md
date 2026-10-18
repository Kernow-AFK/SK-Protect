# SK Protect launch copy

Repository: https://github.com/Kernow-AFK/SK-Protect. Do not attach an AppImage, ASAR, extracted bundle, account file, or private launcher log.

## GitHub / forum announcement

### SK Protect: patch the SKlauncher AppImage you already use

I built **SK Protect** because I wanted clearer control over what my launcher does in the background—without redistributing SKlauncher itself.

SK Protect takes the official SKlauncher 4.0.54 Linux AppImage already on your computer and builds a separate protected copy locally. Your original AppImage remains available for rollback, and the new copy can use the SKlauncher profile you already have. It disables the automatic updater, launcher analytics, Discord Rich Presence, and selected launcher-owned background routes. It keeps the exact news and public-server routes needed for a useful offline library, and it also includes the tested multi-instance install selector, uninstall toggle, and Preferred Mods workflow.

To be completely clear: this is not an accusation that the SKlauncher developers collect or sell personal information. I found no evidence of that in the code paths inspected. The aim is to reduce optional routes through which activity metadata can reach third-party services. Discord documents that activity sharing can expose game/activity details and that its service may collect device and connection information; SK Protect simply disables the launcher's Rich Presence integration.

The repository contains the transformation and verification scripts only. It does **not** contain SKlauncher, an AppImage, an ASAR archive, account data, worlds, or extracted proprietary bundles.

The normal workflow is one command from the extracted repository: `./patch.sh combined /path/to/SKlauncher.AppImage`. For cautious evaluation, the included helper can launch the protected build with a completely separate `HOME` and XDG configuration/data/cache tree, without using your normal `~/.sklauncher` or `~/.config/sklauncher` folders.

This is an independent project, not an official SKlauncher release and not a firewall. Its filter is limited to the Electron launcher; it is not intended to block the Java game, Minecraft multiplayer/LAN/Realms, Microsoft/Mojang services, or a mod's own servers. It currently targets SKlauncher 4.0.54 on Linux x86_64. The release was statically validated and live-tested for single- and multi-instance installs, unavailable-version handling, uninstall toggling, Preferred Mods compatibility, and automatic application to new instances.

The artwork is conceptual and does not claim that SKlauncher collects every category shown.

Read the limitations and build it locally: https://github.com/Kernow-AFK/SK-Protect

**SK Protect — We keep your data safe.**

## Short social post

Introducing **SK Protect**: an independent local patch kit for the SKlauncher 4.0.54 Linux AppImage you already use.

It creates a separate protected copy from your own official AppImage, reduces selected launcher background activity, disables automatic updating/analytics/Discord RPC, and includes a genuinely isolated test-profile launcher. No SKlauncher binary, account data, worlds, or extracted bundle is included in the repo. This is privacy hardening, not an allegation of misconduct by SKlauncher.

Version-specific and not a firewall—but transparent, testable, and ready for careful feedback.

https://github.com/Kernow-AFK/SK-Protect

Project contact: Kernow-AFK@protonmail.com

## Discord-sized post

I’ve prepared **SK Protect Final Version 1.0**, an unofficial local patch kit for SKlauncher 4.0.54 on Linux. Point it at the official AppImage you already use and it creates a separate protected copy that can continue using your existing profile. Choose Patch 1 for privacy controls, Patch 2 for the tested install workflow, Patch 3 for Preferred Mods, or the combined build for all three. This is not an accusation against SKlauncher; I found no evidence of developer misuse in the paths inspected. The repo contains scripts and docs only—no launcher binary or account/game data: https://github.com/Kernow-AFK/SK-Protect

Project contact: Kernow-AFK@protonmail.com
