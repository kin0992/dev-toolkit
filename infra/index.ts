import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';

const cfg = new pulumi.Config('devToolkit');
const repoName = cfg.get('repoName') ?? 'dev-toolkit';
// npmjs.org Automation token consumed by the release workflow to publish
// @kin0992/* packages with provenance.
const npmToken = cfg.requireSecret('npmToken');

export const repo = new github.Repository('dev-toolkit', {
  name: repoName,
  description:
    'Platform Engineering toolkit: reusable GitHub Actions, AI Skills, and shared TypeScript configs.',
  visibility: 'public',
  hasIssues: false,
  hasDiscussions: false,
  hasProjects: false,
  hasWiki: false,
  allowAutoMerge: true,
  allowMergeCommit: false,
  allowSquashMerge: true,
  allowRebaseMerge: false,
  deleteBranchOnMerge: true,
  squashMergeCommitTitle: 'PR_TITLE',
  squashMergeCommitMessage: 'PR_BODY',
  vulnerabilityAlerts: true,
  allowUpdateBranch: true,
  topics: [
    'platform-engineering',
    'github-actions',
    'pnpm',
    'turborepo',
    'typescript',
    'pulumi',
    'changesets',
    'agent-skills',
    'claude-code',
    'copilot-cli',
    'marketplace',
  ],
  archiveOnDestroy: true,
});

export const branchProtection = new github.BranchProtection(
  'main-protection',
  {
    repositoryId: repo.nodeId,
    pattern: 'main',
    enforceAdmins: false,
    requireConversationResolution: true,
    requiredLinearHistory: true,
    allowsDeletions: false,
    allowsForcePushes: false,
    requiredPullRequestReviews: [
      {
        dismissStaleReviews: true,
        requireCodeOwnerReviews: false,
        requiredApprovingReviewCount: 0,
      },
    ],
    requiredStatusChecks: [
      {
        strict: true,
        contexts: ['Static Analysis (self)'],
      },
    ],
  },
  { dependsOn: [repo] },
);

new github.ActionsRepositoryPermissions('actions-permissions', {
  repository: repo.name,
  allowedActions: 'all',
  enabled: true,
});

new github.RepositoryDependabotSecurityUpdates('dependabot-updates', {
  repository: repo.name,
  enabled: true,
});

new github.ActionsSecret('npm-token', {
  repository: repo.name,
  secretName: 'NPM_TOKEN',
  value: npmToken,
});

// TODO: Move Private Vulnerability Reporting under Pulumi when
// @pulumi/github exposes the resource (upstream Terraform gap).
// Enabled out-of-band: PUT /repos/{owner}/{repo}/private-vulnerability-reporting.

export const repoUrl = repo.htmlUrl;
export const repoFullName = repo.fullName;
