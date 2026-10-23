<p align="center"><img src="images/sk-protect-overview-v1.png" alt="SK Protect artwork showing a launcher-style dashboard and a shield blocking data cards" width="100%"></p>

<h1 align="center">SK Protect</h1>

<p align="center"><strong>Independent, unofficial patches for SKlauncher 4.0.54 on Linux x86_64</strong></p>
<p align="center">Choose privacy controls, smoother mod browsing, reusable Preferred Mods—or all three.</p>

> [!IMPORTANT]
> SK Protect is not affiliated with or endorsed by SKlauncher, SKmedix, Mojang, Microsoft, Discord, Modrinth, or CurseForge. It does not host or redistribute SKlauncher. You download the official AppImage directly from the publisher and supply it locally; SK Protect creates a separate patched copy.

## Contents

- [What changes for players](#what-changes-for-players)
- [Help test and improve SK Protect](#help-test-and-improve-sk-protect)
- [Choose a patch](#choose-a-patch)
- [Beginner installation](#beginner-installation)
- [Privacy boundaries and verification](#privacy-boundaries-and-verification)
- [Updates](#updates-without-automatic-replacement)
- [Testing, limitations, and rollback](#testing-limitations-and-rollback)
- [Contributing and project status](#contributing-and-project-status)

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

The selector uses text and symbols as well as colour:

- **✓ Selected** (green): the mod will be installed, or is already installed.
- **× Not selected** (red): compatible, but not currently selected.
- **N/A Not available** (dark red): no compatible release was resolved.
- **🗑 Uninstall** (yellow): an installed individual mod is marked for removal after confirmation.

Static verification covers the selection logic and normal manifest-aware removal route. Real provider responses and the interactive matrix still require release testing; see [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

### Reuse your Preferred Mods

Maintain one reusable list of favourite or essential mods—Sodium, FerriteCore, or Distant Horizons, for example, wherever a compatible release exists. Add or remove entries, enable or disable individual mods, review an existing instance's compatibility, and exclude a compatible mod before confirming installation.

The optional **Offer Preferred Mods for new instances** setting applies enabled, supported entries after a new instance is created. It is off by default and never mandatory. The implementation resolves project and release information afresh for that instance and reuses the launcher's compatibility and installation routes; it stores project identity and preferences, not chosen JAR URLs or account tokens.

Unsupported or failed releases are skipped rather than forced. Existing-instance review shows unavailable items, but automatic new-instance application currently records skips/errors in the developer console rather than a complete player-facing summary. Improving that report is a tracked release requirement, not a guarantee hidden by the documentation.

## Help test and improve SK Protect

This is the maintainer's first public open-source software project, and constructive criticism is welcome.

Developers can review code structure and maintainability, exact patch guards, verification quality, the threat model and privacy assumptions, bugs and regressions, installer safety, usability, accessibility, documentation, and rollback procedures. Minecraft players can report what works, what is confusing, installation failures, missing functionality, incorrect compatibility results, unexpected interface behavior, and better workflow ideas.

Use the issue templates to [open an issue](https://github.com/Kernow-AFK/SK-Protect/issues/new/choose). Remove account details, tokens, private paths, server addresses, and proprietary launcher files. See [CONTRIBUTING.md](CONTRIBUTING.md) for pull-request guidance or [SECURITY.md](SECURITY.md) for private vulnerability reporting.

## Choose a patch

| Mode | Player-facing result |
|---|---|
| `privacy-only` | Privacy controls only; no mod-workflow changes. |
| `workflow` | Uninterrupted browsing plus the multi-instance selector. |
| `preferred-mods` | Reusable Preferred Mods list and optional new-instance application. |
| `combined` | All three patches in one guarded build. |

All modes target only the official **SKlauncher 4.0.54 Linux x86_64 AppImage**.

## Beginner installation

Requirements: Linux x86_64, Node.js 18+, `mksquashfs` (usually `squashfs-tools`), and the official SKlauncher 4.0.54 Linux x86_64 AppImage.

1. Download the exact AppImage yourself from the [official SKlauncher publisher page](https://next.skmedix.pl/downloads). SK Protect deliberately does not automate this download: it must not host, mirror, scrape, bypass publisher controls, or guess an unverified binary URL.
2. Keep it as your untouched rollback copy.
3. Download this repository using **Code → Download ZIP** and extract it, or clone it with Git.
4. Open a terminal in the extracted folder and run:

```bash
chmod +x install.sh SKlauncher-4.0.54.AppImage
./install.sh ./SKlauncher-4.0.54.AppImage
```

The installer creates `SK-Protect-4.0.54-Final-1.0.AppImage` beside the source, refuses to overwrite either file, applies all guarded transformations, runs the bundled static verifiers, and reports the final location. It needs no administrator privileges and does not modify your launcher profile during the build.

```bash
./SK-Protect-4.0.54-Final-1.0.AppImage
```

An exact official publisher checksum or signature has not yet been independently documented here. Until one is confirmed, guarded 4.0.54 code anchors provide compatibility checking, not cryptographic publisher authentication.

### Advanced and offline installation

Choose a mode and new output path explicitly:

```bash
./patch.sh privacy-only ./SKlauncher-4.0.54.AppImage ./out/privacy.AppImage
./patch.sh workflow ./SKlauncher-4.0.54.AppImage ./out/workflow.AppImage
./patch.sh preferred-mods ./SKlauncher-4.0.54.AppImage ./out/preferred.AppImage
./patch.sh combined ./SKlauncher-4.0.54.AppImage ./out/combined.AppImage
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
./run-isolated.sh ./SK-Protect-4.0.54-Final-1.0.AppImage "$HOME/SK-Protect-clean-test"
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

Publicly available source is not automatically legally open-source. The maintainer must choose MIT or Apache-2.0; trade-offs and the proprietary-code boundary are in [docs/LICENSING-DECISION.md](docs/LICENSING-DECISION.md). No choice grants rights to SKlauncher's code, executable, assets, or trademarks.

This branch is being prepared for **public testing**, not declared stable. Contact **Kernow-AFK@protonmail.com** as an alternative to GitHub issues.

### Support development

A modest optional Ko-fi link will be added here after the maintainer supplies and approves the real URL. Testing, code review, issue reports, and contributions remain the most useful ways to help; no donation URL has been invented.
