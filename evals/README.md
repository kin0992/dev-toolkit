# Skill evaluation

`*/eval.yaml` runs offline **mock harness smoke checks** in CI. These checks
exercise evaluation plumbing; they do not demonstrate writing quality,
trigger accuracy against a real model, or approval safety.

`*/quality/suite.yaml` is an opt-in live companion suite using `copilot-sdk`.
It checks actual output formats, fixture-supported claims, template handling,
and draft quality. It requires authenticated Copilot access and incurs model
usage, including prompt-based grading.

## Run live checks

Use the same Waza version pinned in `.github/workflows/eval.yml`. Choose an
available model with `waza models`, then run a companion suite explicitly
from the repository root with the read-only launcher:

```sh
COPILOT_HOME=/absolute/path/to/disposable-copilot-profile \
COPILOT_CLI_PATH="$PWD/scripts/copilot-readonly.js" \
  waza run evals/commit-message/quality/suite.yaml \
  --context-dir evals/commit-message/fixtures \
  --model <model-id> --trials 3 --output /absolute/path/commit-quality.json
```

Live evaluation requires Node and an installed, authenticated `copilot` CLI
in addition to Waza. These are maintainer requirements, not extra plugin
installation steps. The SDK invokes the `.js` override with Node; the launcher
disables built-in GitHub/MCP servers and custom instructions. Keep the disposable
profile separate from your normal configuration.

Each suite uses the evaluation-only agent in `quality-driver/` to enforce a
read-only SDK session policy. It allows skill loading, file reads/searches, and
Waza's two grading tools. The real skill is still discovered from its canonical
source and invoked for the task. The driver is not part of any installed plugin.
CLI tool filters alone do not constrain SDK-created sessions.

Use the pinned Waza version: v0.33.0 has an incompatible permission callback
and cannot connect to the current Copilot CLI. The launcher preauthorizes reads
while the agent policy denies command and write tools. Do not work around failed
reads by enabling all tools or weakening graders.

Repeat for `branch-name`, `pr-title-description`, and `review-pr-comments`.
Use that skill's fixture directory with `--context-dir`. Companion suites
live below `quality/` so Waza does not also run the sibling
`trigger_tests.yaml`; task filtering alone does not skip trigger evaluation.
For a focused run, add `--task quality-null-guard` or another task ID.
The default `auto` model is convenient for a smoke run; for comparisons use
the **same explicit model**, prompts, fixtures, and trial count on both refs.
Inspect every format/safety grader, not just aggregate scores.

For a before/after comparison, use disposable checkouts of the baseline and
candidate, place the same companion specs, fixtures, evaluation-only driver,
and read-only launcher in both. Retain the separate output files outside the
checkouts. Do not compare mock output
with live output. No result proves that text is human-written or undetectable.

## Mutation-sensitive scenarios

Use the read-only launcher, a disposable client profile, and no production
GitHub mutation credentials.
The review fixtures authorize drafting only. Their `bin/gh` fails explicitly;
the offline task puts only that relative directory and system directories on
`PATH`, excluding the normal package-manager CLI directory. Make the fixture
executable if your checkout does not preserve executable permissions.

The tool-constraint grader detects forbidden calls **after execution**; it is
not a permission sandbox. The evaluation agent's runtime policy keeps command,
write, and GitHub tools unavailable instead. Apply equivalent restrictions in
the host for interactive smoke checks. Never target a real PR or project board.

Triage has a separate client walkthrough for preview, revision, and cancellation
without authorizing real GitHub mutations:

1. Load only `project-manager` in a disposable client scope and supply
   `project-manager/fixtures/rough-issue.md` as offline drafting context.
   Copilot CLI selects the installed agent with
   `--agent project-manager:triage`.
2. Check the title, required sections, unknown cause, unchecked criteria,
   discovered labels, confirmed Backlog status, and exact publication preview.
3. Decline creation. Verify no mutation was attempted or claimed.
4. Request a draft edit. Check that the revised exact text is shown for fresh
   approval; a previous confirmation must not authorize revised text.
5. Repeat the review-comment workflow with two actionable fixture comments:
   accepting a comment must not authorize code changes, reactions, or replies.
   Decline implementation and publication separately. In a stubbed tool
   environment, confirm any eventual publish uses the approved bytes exactly.

If a host or live executor is unavailable, record that coverage as unverified.
An isolated-file check or a successful mock run is not a substitute.
