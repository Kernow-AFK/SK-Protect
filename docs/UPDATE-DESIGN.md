# Safe update notification design

## Current behavior

The privacy and combined patches disable SKlauncher's updater, including checks, download/install, restart, and channel operations. There is currently no SK Protect update-notification feature. Users must visit the official SKlauncher download/release page themselves.

## Proposed behavior (not implemented)

Add a clearly labelled **Check official SKlauncher release** action. It would run only after a user activates it, contact one documented official endpoint, and show current version, official latest version, official release notes/link, known security notes, and SK Protect compatibility status. It must never download, replace, or execute a launcher.

An optional periodic reminder could be considered later only with explicit opt-in, a visible last-check time, an off switch, and no stable identifier. Manual checking is the preferred design.

If the new version is not supported, the UI should say:

> A newer SKlauncher release is available. SK Protect has not yet been verified for this version. Please review the official changes, especially security updates, before deciding whether to upgrade. We will work to provide a compatible patch release.

It should also state that installing another AppImage creates or uses a separate executable, may not include SK Protect, and that users can always use a fresh official launcher when an important security update outweighs patch compatibility.

## Blockers before implementation

- Identify and document the official version and release-note endpoint from authoritative upstream material.
- Determine its request/response contract, privacy policy, stability, and rate limits.
- Verify that a request can be made without identifiers beyond ordinary network metadata.
- Define how SK Protect publishes a signed or otherwise trustworthy compatibility statement.
- Add fixture-based parsing tests, hostile/malformed response tests, timeout behavior, and an interactive UI test.

The publisher's downloads page was inspected on 2026-10-18. It linked to a public `/changelog` page, but its rendered site configuration exposed `launcherVersion: "4.0.1"`, which does not match this patch project's inspected launcher build identifier `4.0.54`. That page value is therefore not a sufficiently reliable compatibility signal. No update checker was implemented from it.

Until these are resolved, introducing a network check would conflict with the project's promise not to add hidden background traffic.
