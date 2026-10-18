# Why there are no bundled `.patch` diffs

SKlauncher 4.0.54 ships minified JavaScript with extremely long lines. A conventional unified diff of those bundles can include hundreds of kilobytes of unchanged proprietary source on each changed line.

For that reason, the GitHub-ready repository intentionally omits the generated `.patch` files. The public patch logic is expressed by small guarded transformation scripts:

- `../privacy-patch.js`
- `../apply-fix.js`
- `../verify-privacy.js`
- `../verify-patch.js`

The scripts require exact version-specific snippets and stop if a matcher is missing or duplicated. They operate only on an official AppImage supplied locally by the user. Generated bundles and AppImages remain excluded by `.gitignore` and must not be redistributed.
