# Privacy threat model

Status: source-reviewed for the patch scripts; runtime capture still required. This document distinguishes patch intent and static verification from observed network traffic.

## Goal and trust boundary

The privacy patch reduces selected optional connections initiated through inspected SKlauncher Electron code paths. It is designed for users who want more control over launcher-owned analytics, Discord Rich Presence, updater behavior, identifiers, and selected background routes.

We found no evidence in the inspected code paths that SKlauncher developers intentionally collect, sell, or misuse personal information. Third-party services can process information under their own policies, and this project cannot establish every later use of received information.

This is not a firewall, anonymity system, malware scanner, or universal network blocker. Code outside the guarded Electron routes can make connections that this patch does not intercept.

## Statically enforced behavior

The patch:

- sets launcher analytics disabled and consent chosen, removes the stored analytics `clientId` during settings load, gates analytics client initialization, replaces the analytics IPC handler with a no-op, and exposes a no-op preload analytics API;
- disables Discord Rich Presence through the launcher's setting;
- disables the automatic updater and its install/restart IPC operations so it cannot replace the patched application;
- filters matching Electron-session requests to SKmedix, Xyrios, Google Analytics, and mclo.gs hosts;
- applies the same policy to the inspected main-process `net.fetch` wrapper.

For those filtered hosts, only these exact HTTPS `GET` routes are allowed:

| Host | Permitted path |
|---|---|
| `beta.skmedix.pl` | `/news.json` |
| `cdn.xyrios.com` | `/api/servers.json` |
| `cdn.xyrios.com` | numeric `/api/servers/<id>.png` icons |
| `cdn.xyrios.com` | one-file `/banners/<safe-name>.(png|gif|webp|jpg|jpeg)` images |
| `xyrios.com` | numeric `/api/servers/<id>` details |

Other routes on those host families, including inspected remote configuration, library-patch, profile/tracking, and server IP-copy routes, are rejected by the filter. POST requests are rejected even when their path resembles an allowed GET route.

The allowlist does not mean those permitted services collect nothing. It means the launcher feature remains reachable through the inspected route. Users should consult the relevant service policies.

## Authentication and traffic outside scope

Microsoft/Mojang authentication and entitlement traffic remains available. The patch does not block or proxy Java, Minecraft, multiplayer servers, Realms, LAN discovery, mod loaders, game telemetry, a mod's own network requests, provider downloads, operating-system services, browser links, or other processes. Modrinth and CurseForge access is required by the mod workflows and is not blocked here.

## Secure DNS decision

Earlier code forcibly changed the launcher's `secureDns` setting to false. The audit found no dependency between that setting and the route filter, analytics controls, Discord setting, or updater disabling. Disabling encrypted DNS can expose DNS queries to the network's configured resolver and is not inherently privacy-improving. The public-readiness branch therefore preserves the user's/upstream secure-DNS setting. This correction requires a full patched-AppImage regression test before release.

## Limitations and bypass possibilities

- The filter covers host patterns and two inspected Electron request paths, not every possible networking API.
- A future upstream bundle can rename, move, or replace code. Exact patch guards should then stop the build, but they cannot prove semantic equivalence.
- Allowed responses could reference other hosts, and unlisted hosts are not globally denied.
- Extensions, Java, Minecraft, mods, native components, child processes, and opened browsers remain out of scope.
- DNS lookups, TLS metadata, IP addresses, and traffic content may still be visible to network or service operators as applicable.
- Local compromise, a malicious source AppImage, or a compromised dependency invalidates this model.
- Disabling updater automation can delay awareness of upstream security fixes. Users should check official releases manually and may revert to the official launcher at any time.

## Failure modes and unverified assumptions

Static checks confirm injected strings, guard anchors, allowlist decisions, and disabled updater state. They do not prove that every runtime request flows through those code paths. Runtime baseline-versus-patched capture is still required on a clean profile. The official AppImage's authenticity currently cannot be established by this repository because no independently verified upstream checksum or signature is recorded.

## Reproducible runtime verification plan

Use the same clean profile procedure, same UI actions, and same capture tool for an untouched official AppImage and each patched build. Record DNS and connection metadata without account tokens or payloads. Exercise startup, news, public-server browsing, Content Hub, authentication, and shutdown. Compare destinations and request methods, then classify each result as observed, blocked with an application error, or inferred only. See [TESTING.md](TESTING.md).
