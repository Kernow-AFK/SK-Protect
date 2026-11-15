<p align="center"><img src="images/sk-protect-overview-v1.png" alt="SK Protect artwork illustrating privacy controls and Minecraft mod workflows" width="100%"></p>

<h1 align="center">SK Protect</h1>

<p align="center"><strong>Independent, unofficial SKlauncher patches for Linux x86_64</strong></p>

SK Protect adds privacy controls and mod-management improvements to selected SKlauncher 4.0 releases. It is not affiliated with SKlauncher, SKmedix, Mojang, Microsoft, Discord, Modrinth, or CurseForge.

## Choose the matching release

Check **SKlauncher → Settings → About**. Match the SKlauncher version exactly; Minecraft instance versions do not determine which patch to use.

| SKlauncher version | SK Protect release | Included features |
|---|---|---|
| **4.0.57 Open Beta** (Linux x86_64 AppImage) | [v1.1.0](https://github.com/Kernow-AFK/SK-Protect/releases/tag/v1.1.0) | SK Protect privacy controls, SK Mod Installer, SK Preferred Mods, and Custom text colors in Settings → Appearance. |
| **4.0.54** (Linux x86_64 AppImage) | [v1.0.0](https://github.com/Kernow-AFK/SK-Protect/releases/tag/v1.0.0) | SK Protect privacy controls, SK Mod Installer, and SK Preferred Mods. Custom text colors are not included. |
| **4.0.56** | No patch | No matching SK Protect patch is available. |
| **3.2.18 stable** | No patch | This is a separate Java-based launcher. Do not use a 4.0 AppImage patch with it. |
| Any other version or operating system | No verified patch | Do not apply a patch built for another version. |

## What SK Protect adds

### Privacy controls

The privacy patch disables selected optional launcher analytics, Discord Rich Presence, automatic updating, and selected launcher-owned background routes. It preserves required sign-in, content-provider, game-version, and multiplayer connections. It does not block every network connection, Minecraft, Java, other applications, or third-party services. It is not a firewall, antivirus, or anonymity tool. See the [privacy threat model](docs/PRIVACY-THREAT-MODEL.md) for the scope and limitations.

### SK Mod Installer

Keep Content Hub open while a mod installs, and review compatible instances together. The instance picker shows compatible, already-installed, and unavailable states; installed mods can be selected for removal.

### SK Preferred Mods

Save a reusable mod list, review compatibility for an instance, skip mods already installed, and choose which compatible mods to install. When the new-instance option is enabled, compatible preferred mods are applied to each new instance.

### Custom text colors (4.0.57)

Choose separate primary and secondary text colors in **Settings → Appearance**. The choices are saved locally and can make muted text easier to read, including in dark mode.

## Install the patch

SK Protect patches a separate copy of an official AppImage you download from the [SKlauncher publisher](https://skmedix.pl/downloads/). It does not download, host, or redistribute SKlauncher. Keep the original file unchanged for rollback.

Requirements: Linux x86_64, Node.js 18 or newer, and `mksquashfs` (usually provided by `squashfs-tools`).

### SKlauncher 4.0.57

Download the source archive from the [v1.1.0 release](https://github.com/Kernow-AFK/SK-Protect/releases/tag/v1.1.0), then extract it. In a terminal opened in that folder, run:

```bash
chmod +x install.sh SKlauncher-4.0.57-x86_64.AppImage
./install.sh ./SKlauncher-4.0.57-x86_64.AppImage ./SK-Protect-4.0.57.AppImage
```

Change the input filename if your downloaded AppImage has a different name. The build creates a new patched file, refuses to overwrite the original or an existing output, and runs the bundled compatibility checks.

### SKlauncher 4.0.54

Download the matching source archive from [v1.0.0](https://github.com/Kernow-AFK/SK-Protect/releases/tag/v1.0.0), then run:

```bash
chmod +x patch.sh SKlauncher-4.0.54-x86_64.AppImage
./patch.sh combined ./SKlauncher-4.0.54-x86_64.AppImage ./SK-Protect-4.0.54.AppImage
```

Use only the patch release that matches the exact SKlauncher version. The source release contains SK Protect code, documentation, and project artwork; it does not contain a patched launcher AppImage.

## Privacy and external links

SK Protect preserves essential authentication and service connections. Optional route filtering is limited to the routes described in the source and threat model; it does not claim to prevent all data sharing. Review the code and privacy boundaries before use.

## Project links

- [GitHub releases](https://github.com/Kernow-AFK/SK-Protect/releases)
- [Project website](https://sk-protect.whitechub18.chatgpt.site)
- [Report a bug or suggest an improvement](https://github.com/Kernow-AFK/SK-Protect/issues)
- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

SK Protect's original scripts, documentation, and project artwork are licensed under MIT. The license does not cover SKlauncher's proprietary code, executable, assets, or trademarks.
