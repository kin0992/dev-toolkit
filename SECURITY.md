# Security Policy

## Reporting a vulnerability

Please **do not open a public issue or pull request** for security-sensitive
reports.

Report vulnerabilities privately via GitHub Security Advisories:

<https://github.com/kin0992/dev-toolkit/security/advisories/new>

You can expect:

- An acknowledgement within 72 hours.
- A triage decision (accepted / needs-info / not-applicable) within 7 days.
- A fix or mitigation within 14 days for confirmed vulnerabilities, sooner
  for actively exploited issues.

## Scope

`dev-toolkit` distributes three artifact classes; all are in scope:

- Reusable GitHub workflows and composite actions under `.github/`.
- `@kin0992/*` npm packages published from `packages/`.
- AI Skills and plugins shipped through the marketplace manifests.

The Pulumi program under `infra/` manages the repository itself; reports about
its IaC code are also in scope.

## Supported versions

Security fixes target the latest tagged release of each `@kin0992/*` package
and the current `main` branch for the reusable workflows. Older tags are not
backported.
