import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';

const cfg = new pulumi.Config('devToolkit');
const repoName = cfg.get('repoName') ?? 'dev-toolkit';
const defaultBranch = cfg.get('defaultBranch') ?? 'main';

export const repo = new github.Repository('dev-toolkit', {
  name: repoName,
  description:
    'Platform Engineering toolkit: reusable GitHub Actions, AI Skills, and shared TypeScript configs.',
  visibility: 'public',
  hasIssues: true,
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
  topics: [
    'platform-engineering',
    'github-actions',
    'pnpm',
    'turborepo',
    'typescript',
    'pulumi',
    'changesets',
  ],
  archiveOnDestroy: true,
});

export const branchProtection = new github.BranchProtection(
  'main-protection',
  {
    repositoryId: repo.nodeId,
    pattern: defaultBranch,
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

export const repoUrl = repo.htmlUrl;
export const repoFullName = repo.fullName;
