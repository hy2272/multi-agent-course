# Sprint Zero Assignment — Track 2 (Developer)

**Hanfei Yao · June 12, 2026**

## What I built

Two new components for the Sprint Zero pipeline, both added by editing the kit's own
markdown command/agent files (the kit's "code" is prompts, not source):

1. **`/sprint-zero-preflight`** (main) — an environment preflight check that runs after
   scoping and before the spec pipeline, validating build preconditions and failing fast
   with copy-pasteable recovery instructions.
2. **`code-reviewer` sub-agent** (stretch) — a read-only static reviewer that runs after
   the parallel build and before QA, reporting BLOCKER / WARN / NOTE findings calibrated
   to the scope level.

Together they harden the two ends of the build phase: preflight guards the *inputs*
(environment), code-reviewer guards the *outputs* (the generated code), and QA still
guards *runtime behavior*.

Files in this submission:

| File | What it is |
|---|---|
| `sprint-zero-preflight.md` | New command — drop into `.claude/commands/` |
| `code-reviewer.md` | New sub-agent — drop into `.claude/agents/` |
| `sprint-zero.md` | Orchestrator command, modified: new **Step 2b — Preflight checks**, a **code-reviewer stage in Step 9** (build → review → QA), and two new named failure states (`PREFLIGHT_FAILED`, `REVIEW_BLOCKED`) |
| `preflight-spec.md` | The spec I wrote before implementing preflight (acceptance-criteria style) |
| `run-notes.md` | My full observation log from running the kit end-to-end |
| `screenshots/` | decisions.md deviation log, preflight test rounds, code-reviewer run |

## Why this component

I ran the full kit first (reference: habitica.com → a working "StreakHabit" MVP,
20/20 API tests + full browser QA passing). Two real failures in that run are this
component's requirements doc:

1. **Node version mismatch** — `better-sqlite3@11` has no prebuilt binary for Node 25;
   `npm install` died mid-build (taking `bcryptjs` down with it) and cost several
   diagnostic rounds before the orchestrator pinned v12.
2. **MCP name fragility** — my Playwright MCP was registered under a typo
   (`palywright`). The qa-engineer subagent looks for tools named `mcp__playwright__*`,
   found nothing, and the whole browser test suite fell back to the orchestrator.

Both failures were *environmental*, both were discoverable in seconds, and both
surfaced 15+ minutes into the run. A preflight converts them into a 30-second report
before any spec is written.

## What it checks

| # | Check | Levels | Notes |
|---|---|---|---|
| 1 | Node version | PASS / WARN (≥23) / FAIL (<18, blocking) | warns about native-module prebuilts, cites the known better-sqlite3@12 fix |
| 2 | Playwright MCP registered under the **exact** name `playwright` | PASS / WARN (case drift) / FAIL / SKIP (non-web-app) | reads project type from `docs/scope.md` first |
| 3 | Stack ports free (resolved from `.claude/stacks.md`, not hardcoded) | PASS / FAIL | FAIL prints the occupying PID + kill command |
| 4 | Supabase `.env` complete (4 keys) | PASS / FAIL / SKIP (local) | read-only re-verification; setup guidance stays in Step 1b |

Design rules: run **all** checks and report once (one full fix-list per run, not one
fix per run); report-only — never fixes, installs, or modifies anything; every FAIL
prints a recovery instruction you can paste directly; `WARN` = might fail later,
`FAIL` = will certainly fail (e.g. missing .env keys are FAIL because the seed step
provably dies without them).

## How to run / test

```bash
cd Sprint_Zero && claude        # commands load from the directory you start in
/sprint-zero-preflight          # runs standalone (needs docs/scope.md from scoping)
```

It is also wired into `/sprint-zero` as Step 2b — after scoping, before research —
so a fresh run fails fast automatically.

**Test evidence (3 rounds, screenshots included):**

1. *Current environment:* Node 25 → WARN with the better-sqlite3 note; playwright →
   PASS; ports free → PASS; local data layer → SKIP. Verdict: "Preflight passed — proceeding."
2. *Broken on purpose:* renamed the MCP to `palywright` and started a server on 3001 →
   both FAIL with exact recovery commands, overall `PREFLIGHT_FAILED`, orchestrator
   told not to proceed.
3. *Restored:* clean pass again.

**Not exercised:** the Node < 18 blocking branch (would require installing an old
Node) and the Supabase missing-keys branch (this run used the `local` data layer).
Both branches are implemented symmetrically to the tested ones.

## The code-reviewer sub-agent (stretch)

**Why between build and QA:** reading code statically is cheaper than driving a browser,
so it catches contract and security issues before the expensive QA phase runs. Only
BLOCKER findings stop the pipeline (`REVIEW_BLOCKED`); WARN/NOTE are surfaced for the
user's judgement — the same graded-severity philosophy as preflight.

**How it's scoped (the design decisions that matter):**

- `tools: Read, Glob, Grep` only — "does not modify code" is enforced by *withholding
  the write tools*, not by asking nicely. This mirrors how `backend-engineer.md` uses its
  tool whitelist as a permission boundary.
- Reviews by dimension (security / correctness / kit-rule alignment), not by volume.
- Calibrates to the scope level from `docs/scope.md` — it won't apply Prod standards to
  an MVP build.
- Stays out of QA's lane (no runtime tests) and out of the PM's lane (doesn't judge the
  product decisions in `decisions.md`, only checks code against them).

**It found real things on the StreakHabit build** (1 blocker, 4 warnings, 3 notes):

- BLOCKER — `SessionProvider.jsx`: `accessToken` is frozen into the context value at
  render and only rebuilt on user/loading change, so any consumer reading it from context
  gets a stale `null` after sign-in. (Latent, not yet triggered — current callers use
  `getToken()` directly.)
- WARN — `auth.js`: `JWT_SECRET` silently falls back to a hardcoded dev string with no
  startup warning; signup and login validate passwords with different rules.
- WARN — `HabitRow.jsx`: `setBusy(false)` only runs in `catch`, not `finally` — harmless
  on the happy path, but a future parent bug would permanently disable the button.

Notably it correctly graded the `JWT_SECRET` default as **WARN, not BLOCKER**, because it
read `docs/api-contract.md` and `docs/scope.md` and understood this is a deliberate
zero-setup choice for the `local` data layer — evidence it calibrated to context rather
than pattern-matching "hardcoded secret = critical."

**One honest defect in the reviewer itself:** its summary line used the correct
BLOCKER/WARN/NOTE vocabulary, but its finding bodies drifted to CRITICAL/INFO. This is a
textbook prompt-drift example — my first version's Output section *showed* the right words
in an example but didn't *require* them. I fixed it by adding a hard constraint: "Every
finding line MUST begin with exactly one of BLOCKER, WARN, NOTE — no synonyms." (Captured
in `run-notes.md`.)

## Assumptions

- The kit's tested Node range is 18–22 LTS (inferred from the v11 native-module
  failure on Node 25; the kit doesn't declare a range anywhere — that's part of the gap).
- Step 1b (interactive Supabase setup) stays as-is; preflight's check 4 is a read-only
  re-verification, not a replacement. Deliberate overlap, different jobs.
- Insertion as "Step 2b" rather than renumbering all steps — minimal diff, and the
  kit already uses this convention (Step 1b).

## Improvements & future work

Observed during the end-to-end run (full details in `run-notes.md`):

1. **Declare a supported Node range** in README/agent prompts — or keep this preflight.
2. **QA progress narration** — the QA phase ran 16+ minutes behind a spinner; the kit's
   own rule #9 ("narrate handoffs") is weakest exactly where waits are longest.
3. **Subagent sandboxes vs "verify your work"** — backend-engineer was denied npm/node
   and could not verify its own build; the orchestrator absorbed it. Agent specs should
   state what to do when verification is impossible (report, don't claim).
4. **Pass live environment state when re-spawning workers** — a fresh-context subagent
   doesn't know servers are already running; my QA re-run only went smoothly because
   the brief said so explicitly.
5. (Planned next iteration) Pivoting the generated product into a mindfulness
   companion — spec-layer pivot: rewrite scope.md + prd.md, delete downstream docs,
   `--rebuild`. The exercise this kit is actually teaching: iterate in the spec,
   not in the code.

## What I learned

The orchestrator pattern's real lesson showed up twice: **workers fail at the
environment level more often than the reasoning level, and the orchestrator needs
recovery behavior, not just dispatch behavior.** This preflight moves that recovery
earlier — from mid-pipeline improvisation to a pre-pipeline contract.
