# Changesets

This folder contains "changesets" — descriptions of intended package changes that drive versioning and changelog generation.

## Add a changeset

```sh
pnpm changeset
```

Pick the changed packages, the bump type (`patch` / `minor` / `major`), and write a short summary. Commit the generated `.changeset/*.md` file together with your change.

## Release flow

1. PRs include changeset files.
2. On merge to `main`, the `release` workflow opens (or updates) a "Version Packages" PR that bumps versions and updates `CHANGELOG.md` for each package.
3. Merging that PR publishes the affected packages to GitHub Packages and creates GitHub Releases.
