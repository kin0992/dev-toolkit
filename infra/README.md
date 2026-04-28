# dev-toolkit infrastructure (Pulumi)

Manages the `kin0992/dev-toolkit` GitHub repository declaratively. Drift on this stack is detected by the toolkit's own `iac-drift.yml` reusable workflow — the repo manages itself.

## Resources

- `github.Repository` — the `dev-toolkit` repo (settings, topics, merge rules, vulnerability alerts).
- `github.BranchProtection` — `main` protection: linear history, required status check `Static Analysis (self)`, conversation resolution.
- `github.ActionsRepositoryPermissions` — Actions enabled with `all` policy.
- `github.RepositoryDependabotSecurityUpdates` — Dependabot security updates on.

## Prerequisites

- A Pulumi backend (Pulumi Cloud or self-managed).
- A GitHub PAT exported as `GITHUB_TOKEN` with `repo` and `admin:repo_hook` scopes (or a fine-grained token with equivalent permissions on the target repo).

## Bootstrap

Because this stack creates the repo it lives in, the first apply needs to import the repo if you create it manually first, OR run the stack from a different working copy / a temporary location.

Recommended bootstrap order:

```sh
cd infra
pnpm install

# Create / select stack
pulumi stack init prod

# Configure
pulumi config set github:owner kin0992
pulumi config set devToolkit:repoName dev-toolkit
pulumi config set devToolkit:defaultBranch main

# First-time apply (will create the repo)
GITHUB_TOKEN=ghp_xxx pulumi up
```

If the repo already exists, import it first:

```sh
pulumi import github:index/repository:Repository dev-toolkit dev-toolkit
```

## Drift detection

The repo CI calls the reusable `iac-drift.yml` workflow on a schedule and on PRs that touch `infra/**`. See `.github/workflows/drift.yml`.
