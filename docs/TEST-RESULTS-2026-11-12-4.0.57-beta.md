# Test results — 2026-11-12 — SKlauncher 4.0.57 beta candidates

> These are private beta test candidates, not a stable release. The publisher labels SKlauncher 4.0 as beta; stable 3.2.18 uses a separate Java JAR and has not been ported. No candidate is approved for redistribution.

## Source identity

- Official source: `SKlauncher-4.0.57-x86_64.AppImage` on PC3 project storage.
- Source SHA-256: `ff117d7519f6d036897312b79ae9a1a7be695a75d43bb06576ab6b56791140f9`.
- The source AppImage was not modified. Candidate outputs are ignored local artifacts; no launcher-derived files were added to Git.

## Built candidates

All four builds completed with the patch guards and bundled static verifiers passing:

| Mode | Candidate file | SHA-256 |
|---|---|---|
| Privacy only | `SK-Protect-4.0.57-Privacy-Only-candidate.AppImage` | `be97e340a3c66b0b9375c6d45a4b54c4be25bba36984b156abfbdd46970f46b6` |
| Preferred Mods | `SK-Protect-4.0.57-Preferred-Mods-candidate-v2.AppImage` | `12ab51e2db317ad7fe0c9043d6739e32aba8b899cedcc3cb121be2e76be2bf86` |
| Workflow | `SK-Protect-4.0.57-Workflow-candidate-v2.AppImage` | `26f9d09855e5f2d494f5505c062db9800c569d2ef687f153c63d738f366ce832` |
| Combined | `SK-Protect-4.0.57-Combined-candidate.AppImage` | `222fcd0fb2ef1e59f10efba4f3912bb1ed9517c40babf31eb24865d005be58e3` |

## Runtime evidence and remaining limits

- Privacy-only and combined candidates each reached `Initialization complete` in a 25-second Xvfb smoke run with separate isolated profiles. Xvfb emitted headless WebGL/blocklist messages; this is startup smoke evidence only, not interactive acceptance.
- Preferred Mods and Workflow candidates have not passed startup smoke or interactive UI testing.
- No full mouse/keyboard workflow, provider compatibility, screen-reader, authentication, network-capture comparison, or rollback matrix has been completed for 4.0.57.
- The combined candidate copied to the PC3 Desktop was renamed to `SK-Protect-4.0.57-BETA-Combined-candidate.AppImage`; its verified SHA-256 remains `222fcd0fb2ef1e59f10efba4f3912bb1ed9517c40babf31eb24865d005be58e3`.

These results do not resolve the stable-channel requirement or justify a stable-release claim.

## Preferred Mods navigation lifecycle fix — 2026-11-13

- Reproduced the reported route-lifecycle defect in the patched 4.0.57 renderer: entering Preferred Mods from Customization left the injected page mounted after navigation, and repeated entries could accumulate duplicate sections.
- Updated the patch to remove its injected page on exit from the Preferred Mods route, remove stale copies before mounting, and mark the root so duplicate mounts can be detected.
- Built a new combined candidate from the same untouched official 4.0.57 source. Candidate SHA-256: `e4ba2b3e34539b71131bd2c95a33a1b5a1063aeaf49dbc793c7afd57f9e36fbc`.
- Extracted the packaged main, preload, and renderer from the exact combined candidate; syntax checks and privacy, Preferred Mods, store, combined-patch, and Preferred Mods UI verifiers passed. No launcher process was started for this check.
- Copied the candidate to the PC3 Desktop as `SK-Protect-4.0.57-BETA-Combined-page-lifecycle-fix-candidate.AppImage`; source and Desktop SHA-256 values match. The previous Desktop candidate was preserved.
- Interactive confirmation that Customization → Manage Preferred Mods now returns to the previous single-page behavior remains for the maintainer's manual test. This is still a beta candidate, not a stable release.

### Follow-up from the maintainer's screenshot

- The first lifecycle candidate did not clear the injected section when the launcher switched directly to an instance detail page. The screenshot shows the Preferred Mods panel still above the instance content, so that candidate did not pass the manual route test.
- Root cause: instance detail changes the app shell's `currentPage` directly and bypasses the sidebar navigation function guarded by the first fix.
- Updated both app-shell route renderers to remove the Preferred Mods section whenever `currentPage` is not `preferredMods`; the build verifier confirms both anchors and the cleanup condition.
- Built a replacement combined beta candidate: `SK-Protect-4.0.57-BETA-Combined-instance-route-fix-candidate.AppImage`, SHA-256 `cff1d5321c1ac3535d35139d4b62018f69ade9193328d627d35e8d3fd846c692`. A matching copy is on the PC3 Desktop; both earlier candidates remain untouched.
- The full build-time patch, UI, store, and combined verifiers passed. The maintainer still needs to repeat the same screen-switch test on this replacement; it has not been launched interactively.

## Preferred Mods selection flow update — 2026-11-13

- Moved Apply to Instance beside the instance selector and made “Select instance…” the initial option.
- Fixed Add Mods to use the launcher's app-page navigation callback, open Content Hub with the Mods filter selected, and show “Add to Preferred Mods” on mod cards only while this entry flow is active. The ordinary Content Hub route retains its normal Install label and behavior; navigating away clears the temporary mode.
- Build-time UI assertions passed for the route callback, mod-only filter, conditional card label, selection placeholder/layout, and mode cleanup. Privacy, combined patch, Preferred Mods store, and batch-install verifiers passed in the same build.
- Built `SK-Protect-4.0.57-BETA-Combined-preferred-mods-flow-candidate.AppImage` from official 4.0.57. SHA-256: `64e075281df9e01ff603c289395a7f00b4ec97898724691bc0da85267c08a412`. A hash-verified copy is on PC3 Desktop; prior candidates remain unchanged.
- This UI flow has not been tested interactively. Maintainer acceptance is still required before any release/stability claim.

### Add Mods navigation follow-up

- The maintainer reported that the preceding flow candidate still did not navigate from the Preferred Mods page to Content Hub.
- Inspection showed the callback had been attached to a content-layout helper rather than the sidebar's actual `onNavigate({page})` handler. The Add Mods action now uses that real sidebar callback.
- Built `SK-Protect-4.0.57-BETA-Combined-preferred-mods-navigation-fix-candidate.AppImage` from the official 4.0.57 source. SHA-256: `fbd94397f0cd29db687a1fafef9725097f6e3279491bf6563d33244b451c6fdc`. The PC3 Desktop copy matches; previous candidates are preserved.
- Build-time checks passed for the sidebar callback, route, mod filter, conditional “Add to Preferred Mods” action label, and mode cleanup, along with the existing privacy, batch install, and Preferred Mods checks. Interactive navigation still needs the maintainer's confirmation.

## Instance shortcut and version-aware Preferred Mods apply — 2026-11-13

- Added an `Add Preferred Mods` shortcut beside the instance content page's native Add action. It carries that instance ID into the Preferred Mods page so Apply targets the instance just created without manually choosing it again.
- Apply now requests provider releases for both the instance's Minecraft version and its loader, then runs the existing instance compatibility check. It checks the instance manifest by provider/project identity and skips already installed mods.
- Replaced the direct `Sr.installMod` call that produced `TypeError: t.dependencies is not iterable` with the launcher's normal `window.api.installation.start` download flow used by the combined installer. Apply outcomes are shown in the page in readable multiline text.
- Build-time route, version/loader, installed-mod skip, install API, and result display checks passed, as did privacy, store, combined, and batch-install checks. No interactive launch or live provider installation has been performed.
- Built `SK-Protect-4.0.57-BETA-Combined-instance-version-aware-candidate.AppImage` from the official 4.0.57 source. SHA-256: `3f356e2fb64dc9701d198c558af7b5d94194b98eb8e879e2df8994aceb23aea8`. The Desktop copy matches, and earlier candidates are preserved.
- Maintainer testing is still needed to confirm the shortcut route, correct Fabric/Forge/vanilla release choice, installed-mod skipping, and successful installation of missing mods.

## Preferred Mods add-mode session correction — 2026-11-13

- The maintainer's screenshot showed that adding the first mod cleared the temporary add mode: later cards reverted to normal Install, and clicking one opened the ordinary instance picker.
- The mode now stays active for the whole Content Hub visit started by Preferred Mods → Add Mods. Its content type remains pinned to Mods. Leaving Content Hub clears the mode, so a later normal Content Hub visit uses the standard Install action.
- Build-time assertions passed for session persistence, mod-only filtering, reset on route exit, and the existing instance-specific version/loader install flow.
- Built `SK-Protect-4.0.57-BETA-Combined-preferred-mode-session-candidate.AppImage` from official 4.0.57. SHA-256: `576f880eaeeb99c751b97dd815c7cadf2e2ea74fc2037190f2268618ea50ddf1`. A verified copy is on PC3 Desktop; prior candidates were preserved.
- Interactive confirmation is still required: add multiple mods in one visit, then leave and open Content Hub normally to verify Install is restored.

## Revalidation — 2026-11-13

The official release page still listed 4.0.57 as the latest 4.0 build. All four existing candidate AppImages were rehashed against the records above, then their embedded ASAR bundles were extracted into temporary PC3 storage and checked without running the launcher. Main, preload, and renderer syntax checks passed. The privacy-only, Preferred Mods, workflow, and combined verifier suites all passed against their respective exact candidate bundles. Temporary extraction directories were removed. The outputs remain beta candidates because interactive acceptance is still outstanding.

## Feedback links and multi-instance selection correction — 2026-11-13

- Routed GitHub and email feedback links in the Preferred Mods and global feedback popovers through the SKlauncher 4.0.57 `window.api.system.openExternal` bridge. The links remain restricted to the project issue page and feedback email address.
- Fixed the legacy multi-instance batch handler: instances marked for removal are excluded from the install callback after removals run. This prevents an uninstall selection from immediately triggering a reinstall.
- Repository checks, patch verifiers, and build-time UI assertions passed. Built a new combined beta candidate from the official 4.0.57 AppImage: `SK-Protect-4.0.57-BETA-Combined-feedback-install-fix-candidate.AppImage`, SHA-256 `a5b915cc3b6eb294ff36f93ed2ea1ddcf8d7a62ab73fb5a3f7dbdaddab81a3c7`.
- A matching executable copy is on the PC3 Desktop. This is a static/build-verified beta candidate; interactive feedback-link opening and install/remove behavior still need the maintainer's test.

## Feedback IPC and selector wording follow-up — 2026-11-13

- Inspection of the official 4.0.57 main process showed that its external-link IPC accepted HTTP(S) only, which rejected the feedback `mailto:` URL. Extended that handler to allow only `mailto:Kernow-AFK@protonmail.com`, while preserving HTTP(S) links. Feedback anchors now bind click handlers directly to avoid relying on overlay event bubbling.
- Added visible GitHub and Email links at the bottom of the multi-instance install picker. Reworded the instructions to describe the actual action: select a compatible uninstalled instance to mark it for installation; select an installed instance to mark it for removal; Apply Selected performs those changes; Select All Compatible selects only compatible, uninstalled instances.
- Build-time verifiers passed for the mailto allowlist, picker wording and footer links, feedback click handlers, and existing install/remove logic. Built `SK-Protect-4.0.57-BETA-Combined-feedback-picker-footer-candidate.AppImage` from official 4.0.57, SHA-256 `34cffee7215ef36bbe59228a02debaa062fc65c6688f8aaeb146681de169db26`.
- A checksum-matched executable copy is on PC3 Desktop. These checks do not establish that desktop handlers opened a browser or mail client at runtime; please verify those links and the picker actions interactively.

## Public profile destination and platform scope — 2026-11-13

- The maintainer reported the previous GitHub issue-creation link prompted for sign-in and specified the public profile URL instead. Updated every in-app GitHub feedback target to `https://github.com/kernow-afk`.
- Updated the repository README and selector description. It now records the maintainer-reported successful workflow testing on PC3 running Linux Mint 22.3, explicitly says other operating systems are unverified, and keeps the current 4.0.57 candidate separate from the published 4.0.54 release.
- Patch and repository checks passed. Built `SK-Protect-4.0.57-BETA-Combined-github-profile-linux-mint-candidate.AppImage` from official 4.0.57. SHA-256: `0c2ecf18bc7b02f49a8c0058dfc43b683c4eea182ea07d8fb78973bf1aad07cb`. Its executable PC3 Desktop copy matches.
- The profile URL and Email link are configured in this candidate; the maintainer has not yet confirmed the profile link opens in their browser. Do not present the link change as runtime-verified or the candidate as a stable release.

## Per-instance Preferred Mods review dialog — 2026-11-14

- Changed the instance-page **Add Preferred Mods** action to open an overlay without navigating away. It reviews enabled mods against that instance's Minecraft version and loader, preselects compatible missing mods, lets the user exclude each, skips installed mods, and labels incompatible entries “Not available for this version.” Apply uses the normal SKlauncher installation API for the current instance; Cancel closes without applying.
- Added feedback links inside the overlay. Added a separate “Part of SK Protect” information section to Preferred Mods with links to the GitHub README and `https://sk-protect.whitechub18.chatgpt.site`. The Preferred Mods management workflow itself remains in place.
- Build-time checks passed for modal/instance context, version and loader filtering, labels, selection toggles, installed-mod skipping, buttons, feedback, project links, and install route. The combined beta candidate is `SK-Protect-4.0.57-BETA-Combined-instance-preferred-review-candidate-v2.AppImage`, SHA-256 `841a3d5642de6c3a2713674464c6937011bbcd45060dcabda2ad3b180a88c3e0`; its executable copy on PC3 Desktop matches.
- Interactive checks remain: verify unavailable and installed rows, toggles, Cancel, Apply targeting only the open instance, and both help links. This candidate remains beta.


## Preferred Mods branding and automatic installation — 2026-11-14

- Corrected the Preferred Mods page description: when enabled, compatible mods install automatically on every new instance. The 4.0.57 instance-created hook now runs the compatibility-filtered installer without navigating to the Preferred Mods page and skips mods already present.
- Added the supplied mascot artwork as a restrained brand image and list watermark, blue mod rows, a green instance selector, amber Remove controls, and larger checkboxes. The SK Protect text now says it helps restrict personal data leakage from SKlauncher. The upstream icon rail and News sidebar remain unchanged in the patch.
- `./test.sh` passed on PC3. The combined build's privacy, Preferred Mods data-store, multi-instance workflow, UI, and combined verifiers all passed. One first build attempt caught an outdated verifier string; its expectation was updated and the subsequent build passed.
- Built `SK-Protect-4.0.57-BETA-Combined-branding-auto-install-candidate.AppImage` from the unchanged official 4.0.57 source. Source SHA-256: `ff117d7519f6d036897312b79ae9a1a7be695a75d43bb06576ab6b56791140f9`. Candidate SHA-256: `02826caad1bfb79b48f14839c44807f9a692b092987fed13a544c589513393d3`.
- Copied the executable candidate to the PC3 Desktop and confirmed the copy's SHA-256 matches the build. Previous candidates were left in place. The launcher was not started; appearance, automatic installation behavior, external links, and normal navigation still need the maintainer's interactive check.

## Screenshot follow-up: branding layout — 2026-11-14

- The maintainer's screenshot showed that the brand artwork area was visually collapsed and the watermark behind the mod rows was too strong. Updated the renderer-injected CSS with explicit layout, a dedicated mascot area, and a much darker watermark overlay. This keeps text and controls readable while retaining the requested artwork and color accents.
- `./test.sh` and the combined build-time verification suite passed on PC3 after the adjustment.
- Built `SK-Protect-4.0.57-BETA-Combined-branding-layout-fix-candidate.AppImage` from the unchanged official 4.0.57 AppImage (SHA-256 `ff117d7519f6d036897312b79ae9a1a7be695a75d43bb06576ab6b56791140f9`). Candidate SHA-256: `7f1685597337054133d32c1ba395c9e33238b986b59d782cb0ef43c5c98454e1`.
- The build output and executable copy at `/home/kernow/Desktop/SK-Protect-4.0.57-BETA-Combined-branding-layout-fix-candidate.AppImage` have matching hashes and size 148,541,416 bytes. Earlier candidates remain preserved. The launcher was not started; visual confirmation and interactive behavior remain for the maintainer.

## Color hierarchy follow-up — 2026-11-14

- Updated the top SK Protect panel and automatic-install option with separate blue treatments; gave the SK Protect, SK Mod Installer, and SK Preferred Mods tiles distinct blue shades; retained the mascot artwork visibly behind the mod rows; and added a subdued red tint behind the amber Remove controls.
- Local `git diff --check` and `./test.sh` passed. On PC3, `./test.sh` and the combined build's privacy, data-store, workflow, Preferred Mods UI, and packaging verifiers passed, including the new color and artwork assertions.
- Built from the unchanged official 4.0.57 source (`ff117d7519f6d036897312b79ae9a1a7be695a75d43bb06576ab6b56791140f9`). Candidate `SK-Protect-4.0.57-BETA-Combined-color-hierarchy-candidate.AppImage` SHA-256: `a2ef7ce73742fca215b90dec6f7536a5a3a7e3847f7ec3575938121338febf8a`.
- The executable PC3 Desktop copy has the same hash and is 148,541,416 bytes. Prior candidates and the remote pre-update source backups remain preserved. The launcher was not started; maintainer visual and interactive review remains pending.

## Product cards and image gradient — 2026-11-14

- Kept the mascot art at the left of the SK Protect panel, restored the shield beside the Preferred Mods heading, and styled the three product tiles with separate pictograms, diagonal accents, and blue/purple gradients.
- Changed the mod-list background and row fills to fade horizontally toward greater transparency, making the supplied art more visible on the right while retaining readable names and controls.
- `./test.sh` and the full PC3 combined build-time suite passed, including checks for the shield, tile gradients/pictograms, and transparent background gradient.
- Built from official `SKlauncher-4.0.57-x86_64.AppImage`, source SHA-256 `ff117d7519f6d036897312b79ae9a1a7be695a75d43bb06576ab6b56791140f9`. Candidate `SK-Protect-4.0.57-BETA-Combined-product-cards-candidate.AppImage`, SHA-256 `c229597d6af410bc27ddf7196b68d1ad3a9543d1b63664790bc1d53f538e3322`.
- The executable Desktop copy matches the candidate hash and is 148,541,416 bytes. Previous candidates remain preserved. The launcher was not started; visual and interaction review remains with the maintainer.

## Settings About and custom text colors — 2026-11-14

- Added an About card identifying SK Protect `1.1.0-beta.1` as a beta candidate for SKlauncher 4.0.57, separately identifying the latest published SK Protect project release `v1.0.0`, and linking to the project website and GitHub repository.
- Added primary and secondary text color pickers under Appearance, below the instance-detail option. The selected colors persist in local storage on that device and style launcher white/heading and muted gray text classes.
- Repository checks and all PC3 combined build-time verifiers passed, including checks for Settings route detection, picker persistence, target text classes, release labeling, and external project links.
- Built from official SKlauncher 4.0.57 AppImage SHA-256 `ff117d7519f6d036897312b79ae9a1a7be695a75d43bb06576ab6b56791140f9`. Candidate `SK-Protect-4.0.57-BETA-Combined-about-appearance-colors-candidate.AppImage`, SHA-256 `2ff9f92af0b8c5ec459932e81e2ec34fcdfc2f8214c4d57258d988e2e9bcf8fb`.
- The executable Desktop copy has the matching checksum and is 148,541,416 bytes. The launcher was not started. Maintainer must confirm the About links and that color choices remain clear and persist after reopening Settings.
- Refined the Settings observer to coalesce scans per animation frame while observing route changes and text updates. The final combined build suite passed again. Candidate `SK-Protect-4.0.57-BETA-Combined-about-appearance-colors-v2-candidate.AppImage`, SHA-256 `59354d41a68b906732c41b30777c1663a9a73103bc28c982d36c997f66948fa8`; its executable Desktop copy matches. Prior candidates remain preserved.
- Moved the Custom text colors panel out of the Layout card's two-column row and after the complete Layout card. The panel now occupies a dedicated full-width line, separate from “Open details on instance click.” All combined checks passed. Final candidate `SK-Protect-4.0.57-BETA-Combined-about-appearance-colors-v3-layout-candidate.AppImage`, SHA-256 `e2c6ac1f3675945140ae405f7d44f3c3f180d11b7864fc34d68158da77e3f2bb`; the executable PC3 Desktop copy matches. Maintainer visual confirmation remains pending.
