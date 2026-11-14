<p align="center"><img src="images/sk-protect-overview-v1.png" alt="SK Protect artwork showing a launcher-style dashboard and a shield blocking data cards" width="100%"></p>

<h1 align="center">SK Protect</h1>

<p align="center"><strong>Independent, unofficial patches for SKlauncher 4.0.57 beta on Linux x86_64</strong></p>
<p align="center">Choose privacy controls, smoother mod browsing, reusable Preferred Mods—or all three.</p>

> [!IMPORTANT]
> SK Protect is not affiliated with or endorsed by SKlauncher, SKmedix, Mojang, Microsoft, Discord, Modrinth, or CurseForge. It does not host or redistribute SKlauncher. You download the official AppImage directly from the publisher and supply it locally; SK Protect creates a separate patched copy.

> [!WARNING]
> This beta release targets SKlauncher 4.0.57 for Linux x86_64. The publisher labels the SKlauncher 4.0 line beta; stable 3.2.18 has not been ported, so this project has no stable-compatible release. The maintainer reports testing on PC3 running Linux Mint 22.3; other operating systems have not been verified. Open items for clean-profile, accessibility, provider, network, and rollback testing remain listed in [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). Do not describe this as a stable or cross-platform release.

> **New in v1.1.0-beta.1:** Custom text colors are now available in **Settings → Appearance**. Choose local primary and secondary text colors to make launcher text easier to read. [Get the matching SK Protect source release](https://github.com/Kernow-AFK/SK-Protect/releases/tag/v1.1.0-beta.1); this beta is specifically for **SKlauncher 4.0.57 Linux x86_64** and does not include a patched AppImage.

## Contents

- [What changes for players](#what-changes-for-players)
- [Help test and improve SK Protect](#help-test-and-improve-sk-protect)
- [Choose a patch](#choose-a-patch)
- [Beginner installation](#beginner-installation)
- [Privacy boundaries and verification](#privacy-boundaries-and-verification)
- [Custom text colors](#custom-text-colors)
- [Updates](#updates-without-automatic-replacement)
- [Testing, limitations, and rollback](#testing-limitations-and-rollback)
- [Contributing and project status](#contributing-and-project-status)


## Match SK Protect to your SKlauncher version

| Installed SKlauncher | Matching SK Protect release | Notes |
|---|---|---|
| 4.0.57 beta, Linux x86_64 | [v1.1.0-beta.1](https://github.com/Kernow-AFK/SK-Protect/releases/tag/v1.1.0-beta.1) | Current beta source release; build locally with your official 4.0.57 AppImage. |
| 4.0.54, Linux x86_64 | [v1.0.0](https://github.com/Kernow-AFK/SK-Protect/releases/tag/v1.0.0) | Historical patch release for that exact launcher version. |
| 3.2.18 stable or any other version | No matching release | Do not apply a different version's patch; wait for a matching compatibility release. |

## What changes for players

### Privacy controls: fewer optional launcher connections

SK Protect was developed because its author wanted more control over optional connections made by the Minecraft launcher. We found no evidence in the launcher code paths inspected that SKlauncher developers intentionally collect, sell, or misuse personal information. The launcher can interact with third-party services, including Discord, and those services may process information under their own policies; this project cannot establish every later use of received information.

The privacy patch disables launcher analytics, removes its stored analytics client identifier while settings load, disables Discord Rich Presence, disables automatic updating, and blocks selected launcher-owned remote-configuration, library-patch, profile/tracking, and background routes. Exact HTTPS read-only routes for launcher news and the public-server list, numeric details, icons, and safe banner images remain permitted. Microsoft/Mojang authentication remains available, as do provider connections needed to browse and install mods.

It does **not** block Java, Minecraft, multiplayer, Realms, LAN, mods, browsers, other processes, or every possible launcher connection. It is not a firewall, anonymity tool, antivirus, or universal network blocker. Someone may still prefer it because the guarded source transformations and narrow route policy provide more inspectable control over optional launcher behavior.

Review the patch and its allowlist checks, build each mode separately, and compare an untouched launcher with a patched build under the same clean-profile network capture. Precise boundaries, limitations, and a capture plan are in [the privacy threat model](docs/PRIVACY-THREAT-MODEL.md).

### Uninterrupted mod browsing

Normally, you might be halfway through a large Content Hub description, select **Install**, then keep reading other mods. When installation finishes, SKlauncher may take you away from that page and return you to the instance library.

The workflow patch removes that completion-time navigation. Installation continues in the background while Content Hub stays where you left it, so you can keep reading, compare projects, and select more mods without repeatedly finding your place again. Manual Library navigation remains available.

### Install one mod into several instances

Open a mod, choose the Minecraft instances that should receive it, and apply the selection once instead of opening every instance separately. For each selected instance, the patch reuses SKlauncher's compatibility predicate and preferred-release selection, taking provider, mod loader, Minecraft version, and content type into account before handing a compatible release to the normal per-instance installer.

The picker reports which instances already have the mod. Select a compatible, uninstalled instance to mark it for installation. Select an installed instance to mark it for removal; SKlauncher asks for confirmation before uninstalling. **Select All Compatible** selects only compatible instances where the mod is not already installed. Unavailable instances cannot be selected.

The maintainer reports that the tested workflows are working on PC3 running Linux Mint 22.3. This is a single-OS report, not cross-platform verification. Other operating systems, accessibility coverage, network comparison, clean-profile testing, and rollback remain release checks; see [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

### Reuse your Preferred Mods

Maintain one reusable list of favourite or essential mods—Sodium, FerriteCore, or Distant Horizons, for example, wherever a compatible release exists. Add or remove entries, enable or disable individual mods, review an existing instance's compatibility, and exclude a compatible mod before confirming installation.

When **Install Preferred Mods on every new instance** is checked, enabled mods with compatible releases install automatically after a new instance is created. It is off by default. The implementation resolves project and release information afresh for that instance and reuses the launcher's compatibility and installation routes; it stores project identity and preferences, not chosen JAR URLs or account tokens.

On an individual instance page, **Add Preferred Mods** opens a review window for that instance without leaving its page. Compatible, missing mods begin selected; click one to exclude it for this instance. Existing mods are skipped, and releases unavailable for that Minecraft version or loader are shown as unavailable. **Apply** installs the remaining selections on that instance; **Cancel** closes the review without applying changes. The maintainer has now interactively checked the newly added flows on PC3 running Linux Mint 22.3 and reports they work as intended. Broader clean-profile, accessibility, network-comparison, provider-edge-case, and rollback checks remain open.

Read the [SK Protect guide on GitHub](https://github.com/Kernow-AFK/SK-Protect#readme) or visit the [SK Protect website](https://sk-protect.kernowspace.chatgpt.site).

### Custom text colors

The combined patch adds **Custom text colors** under **Settings → Appearance**. Choose separate colors for primary text (headings and bright text) and secondary text (descriptions and supporting details). The choices are saved locally in the launcher's settings storage. This feature grew out of a readability problem: some muted gray text in the launcher's dark theme was too difficult to read on screen. The controls let each user choose more legible colors for their display.

This is integrated into the combined SK Protect patch, not a separately installable color-picker package. It shares the version-specific patching and verification flow with the other SK Protect features, so users download one source package and choose the combined build.

Unsupported or failed releases are skipped rather than forced. Existing-instance review shows unavailable items, but automatic new-instance application currently records skips/errors in the developer console rather than a complete player-facing summary. Improving that report is a tracked release requirement, not a guarantee hidden by the documentation.

## Help test and improve SK Protect

This is the maintainer's first public open-source software project, and constructive criticism is welcome.

Developers can review code structure and maintainability, exact patch guards, verification quality, the threat model and privacy assumptions, bugs and regressions, installer safety, usability, accessibility, documentation, and rollback procedures. Minecraft players can report what works, what is confusing, installation failures, missing functionality, incorrect compatibility results, unexpected interface behavior, and better workflow ideas.

The in-app GitHub feedback link opens the [maintainer’s public GitHub profile](https://github.com/kernow-afk). Remove account details, tokens, private paths, server addresses, and proprietary launcher files. See [CONTRIBUTING.md](CONTRIBUTING.md) for pull-request guidance or [SECURITY.md](SECURITY.md) for private vulnerability reporting.

## Choose a patch

| Mode | Player-facing result |
|---|---|
| `privacy-only` | Privacy controls only; no mod-workflow changes. |
| `workflow` | Uninterrupted browsing plus the multi-instance selector. |
| `preferred-mods` | Reusable Preferred Mods list and optional new-instance application. |
| `combined` | All three patches in one guarded build. |

This release targets the official **SKlauncher 4.0.57 Linux x86_64 AppImage** on the 4.0 Electron/AppImage line. The publisher identifies that line as beta. Stable 3.2.18 has not been ported.

## Beginner installation

Requirements: Linux x86_64, Node.js 18+, `mksquashfs` (usually `squashfs-tools`), and the official SKlauncher 4.0.57 Linux x86_64 AppImage.

1. Download the official 4.0 AppImage yourself from the [official SKlauncher publisher page](https://next.skmedix.pl/downloads). SK Protect deliberately does not automate this download: it must not host, mirror, scrape, bypass publisher controls, or guess an unverified binary URL. The publisher currently labels 4.0 as beta.
2. Keep it as your untouched rollback copy.
3. Download the source archive from the matching [v1.1.0-beta.1 GitHub release](https://github.com/Kernow-AFK/SK-Protect/releases/tag/v1.1.0-beta.1) and extract it, or clone the repository at that tag. The release source archive is not a prebuilt AppImage.
4. Open a terminal in the extracted folder and run:

```bash
chmod +x install.sh SKlauncher-4.0.57.AppImage
./install.sh ./SKlauncher-4.0.57.AppImage ./SK-Protect-4.0.57-beta.1.AppImage
```

The installer creates a separate output, refuses to overwrite either file, applies all guarded transformations, runs the bundled static verifiers, and reports the final location. It needs no administrator privileges and does not modify your launcher profile during the build.

```bash
./SK-Protect-4.0.57-beta.1.AppImage
```

An exact official publisher checksum or signature has not yet been independently documented here. Guarded 4.0.57 code anchors provide compatibility checking, not cryptographic publisher authentication.

### Advanced and offline installation

Choose a mode and new output path explicitly:

```bash
./patch.sh privacy-only ./SKlauncher-4.0.57.AppImage ./out/privacy.AppImage
./patch.sh workflow ./SKlauncher-4.0.57.AppImage ./out/workflow.AppImage
./patch.sh preferred-mods ./SKlauncher-4.0.57.AppImage ./out/preferred.AppImage
./patch.sh combined ./SKlauncher-4.0.57.AppImage ./out/combined.AppImage
```

The process is offline after you supply the AppImage and repository. A missing, duplicated, or changed version-specific anchor stops the build instead of guessing.

## Privacy boundaries and verification

Allowed launcher-owned routes are deliberately narrow, but hosts outside the filter are not globally denied. Microsoft/Mojang login, Content Hub providers, Java, Minecraft, multiplayer servers, Realms, mods, and other processes remain outside this patch's protection.

The audit found no technical reason for an earlier behavior that forcibly disabled the launcher's secure-DNS setting. Disabling encrypted DNS is not inherently privacy-improving, so this branch preserves the user's/upstream setting. This correction needs full AppImage confirmation before release.

Read [docs/PRIVACY-THREAT-MODEL.md](docs/PRIVACY-THREAT-MODEL.md) before making privacy claims.

## Updates without automatic replacement

Privacy and combined builds disable SKlauncher's updater so it cannot silently replace patched files. SK Protect does not currently check for new versions in the background or on demand. Visit the official publisher page manually, review release notes—especially security fixes—and use the official unpatched launcher whenever updating promptly matters more than patch compatibility.

A user-initiated, notification-only proposal is in [docs/UPDATE-DESIGN.md](docs/UPDATE-DESIGN.md). It will not be implemented until an authoritative, privacy-appropriate upstream version/changelog mechanism is verified. It will never automatically replace a patched launcher.

## Testing, limitations, and rollback

- A successful build proves guarded transformations and static verifiers passed; it does not prove every launcher feature works at runtime.
- Generated AppImages, ASARs, accounts, worlds, instances, and extracted launcher bundles are never committed.
- Future SKlauncher versions require a new compatibility review and SK Protect release.
- Automatic Preferred Mods skip reporting needs a clearer player-facing summary.
- Real screenshots, video, clean-profile tests, and baseline-versus-patched network captures remain required before broad promotion.

For a disposable profile:

```bash
./run-isolated.sh ./SK-Protect-4.0.57-beta.1.AppImage "$HOME/SK-Protect-clean-test"
```

For rollback, close the patched launcher and run the untouched official AppImage. Building does not overwrite it or change your normal profile. Back up important launcher data before interactive testing.

See [docs/TESTING.md](docs/TESTING.md), [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md), [CHANGELOG.md](CHANGELOG.md), and [RELEASE_NOTES.md](RELEASE_NOTES.md).

## Repository map

| Path | Purpose |
|---|---|
| `install.sh` | Beginner combined build using a user-supplied AppImage |
| `patch.sh` / `build-appimage.sh` | Safe wrapper and extract/patch/verify/repack pipeline |
| `privacy-patch.js` / `verify-privacy.js` | Privacy transformations and policy checks |
| `apply-fix.js` / `verify-patch.js` | Browsing and multi-instance transformations and checks |
| `preferred-mods-*.js` / verifiers | Preferred Mods data, UI, and checks |
| `run-isolated.sh` | Disposable-profile launcher helper |
| `docs/` | Threat model, testing, updates, licensing, and media plan |

## Contributing and project status

The original SK Protect scripts, tests, documentation, and owned artwork are licensed under MIT. This does not grant rights to SKlauncher's code, executable, assets, or trademarks.

This branch is being prepared for **public testing**, not declared stable. The maintainer has reported successful workflow testing on Linux Mint 22.3 only; other operating systems remain unverified. Use the [GitHub profile](https://github.com/kernow-afk) or contact **Kernow-AFK@protonmail.com**.

### Support development

A modest optional Ko-fi link will be added here after the maintainer supplies and approves the real URL. Testing, code review, issue reports, and contributions remain the most useful ways to help; no donation URL has been invented.
