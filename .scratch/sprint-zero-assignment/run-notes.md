# Sprint Zero run notes — Habitica reference (StreakHabit)

Run date: 2026-06-10 evening. Scope: MVP / web-app / node-react / local SQLite.
Reference: habitica.com. Outcome: **app running and demo-ready** — 20/20 API integration
tests passed, full browser suite passed (executed by the main session, see Friction #2),
zero contract mismatches.

## Run timeline

1. Scoping → 6 spec docs written sequentially (scope → reference-brief → PRD → decisions
   → user-stories → api-contract)
2. tech-lead read all specs → structured build brief (1m12s, 31.5k tokens)
3. backend-engineer ‖ frontend-engineer spawned in parallel (backend 5m38s; frontend 56.5k tokens)
4. Main session: install, seed, contract-verification curls, fixed better-sqlite3 issue
5. qa-engineer: 20/20 API tests, browser tests NOT RUN (tool name mismatch, honestly reported)
6. Main session ran the browser suite itself → all passed → auto-launched app

## Design highlights observed (the system working as designed)

- **Deviation flagging worked twice.** frontend-engineer found user story 1 ("habit list
  at `/`") conflicted with the kit's landing-page rule → moved the list to `/app` and
  logged it in docs/decisions.md instead of silently diverging. Main session pinned
  better-sqlite3 v12 and logged that too. "Stop and flag, don't silently deviate" is real
  behavior, not just a rule in a file.
- **Parallel isolation, literally.** frontend's completion report: "Live API calls were
  not exercised since the backend is being built in parallel." The frontend was built
  against docs/api-contract.md alone — the backend didn't exist yet. Contract-as-
  coordination-layer, demonstrated.
- **Minimal task briefs.** The orchestrator re-packaged context for each subagent (build
  config + core loop + "contract is law" + file list + required completion message) rather
  than forwarding the conversation. Context-leakage prevention in practice.
- **Honest QA degradation.** qa-engineer couldn't find Playwright tools; it marked every
  browser-only check NOT RUN, ran API-equivalent coverage, and reported the gap as
  environmental, not a product defect. The "do not simulate browser results" instruction
  held — no fabricated observations.
- **Spec amplification.** One precise scoping sentence ("same-day duplicate check-off is
  prevented") became: 201-vs-200 response semantics, an `already_checked_today` flag, a
  UNIQUE(habit_id, date) constraint, INSERT OR IGNORE, and three acceptance criteria.
  Precision in compounds; vagueness would have compounded too.

## Frictions (improvement-section material)

1. **Node version assumption.** better-sqlite3@11 has no prebuilt binary for Node 25 →
   node-gyp source build failed → npm install died midway (bcryptjs also missing).
   Cost ~3-4 diagnostic rounds. *Fix idea: declare a supported Node range, or add an
   environment preflight before the build phase.*
2. **MCP server name fragility.** Playwright MCP was registered as `palywright` (typo).
   The orchestrator NOTICED the typo and told qa-engineer how to look for the misspelled
   name, but the subagent's environment exposed neither name. Browser QA fell back to the
   main session. *Fix idea: a preflight that validates `claude mcp list` contains
   `playwright` before spawning QA — fail fast at scoping time, not 20 minutes in.*
3. **Subagent sandbox vs build verification.** backend-engineer finished its code but was
   denied npm/node by the sandbox, so it could not verify its own build; the orchestrator
   absorbed install/seed/curl verification. The agent file says "verify your work" but the
   environment can't always honor it.
4. **Progress opacity.** QA phase showed a spinner ("Gallivanting… 16m+") with no
   step-level progress. Rule #9 ("narrate handoffs") is weakest exactly where waits are
   longest. Related: during the run it's hard to tell orchestrator work from subagent work
   (top-level Bash vs named agent boxes — learned, not obvious).

## Meta-lessons (keep)

- Workers fail at the environment level more often than the reasoning level; the
  orchestrator needs **recovery behavior, not just dispatch behavior**.
- The named failure states (QA_NEEDED etc.) + resumable pipeline made every failure
  recoverable without restarting; nothing cascaded.

## QA re-run after MCP rename (2026-06-10, later)

Renamed `palywright` → `playwright`, restarted the session, re-spawned qa-engineer with
live environment state in the brief (servers already running, ports, known quirks).
**Full PASS by the actual qa-engineer this time** — contract validation, 20/20 API tests,
browser auth dance (incl. corrupted-token graceful degradation), browser core loop
(streak "1 day" without reload, disabled control, replay doesn't double-increment),
user isolation both directions. Intended topology restored; QA_NEEDED recovery path
proven end to end. Only cosmetic finding: missing favicon → console 404 per page load.

Extra meta-lesson: when re-spawning a worker mid-pipeline, pass it the live environment
state (what's running, which ports, known quirks) — a fresh-context subagent doesn't know
servers are already up, and its most common failure mode is restarting them into port
conflicts. Isolation's price: every spawn needs the world re-explained.

## Loose ends

- [x] Rename palywright → playwright — DONE, QA re-run full PASS
- [ ] Servers running in background: `pkill -f "node index.js"` / `pkill -f "vite"` when done
- [ ] Optional: drop in a favicon for a clean demo console
- [ ] Screenshots for the assignment README: parallel engineers panel; decisions.md deviation entries; QA report

## Code-reviewer sub-agent — build + test (2026-06-12)

Built `code-reviewer.md` (stretch component): read-only static reviewer, runs between
the parallel build and QA. Locked to `tools: Read, Glob, Grep` so "no modifications" is
enforced by the absence of write tools, not by instruction. Wired into sprint-zero.md
Step 9 (build → review → QA) with a new `REVIEW_BLOCKED` failure state (only BLOCKER
findings stop the pipeline; WARN/NOTE pass through).

First real spawn on the StreakHabit build: **1 blocker, 4 warnings, 3 notes**, 27 tool
uses, all Read (confirmed read-only). Quality observations:

- Correctly graded the `JWT_SECRET` hardcoded-default as **WARN, not BLOCKER** — it read
  scope.md + api-contract.md and recognized the dev-secret as a deliberate local-mode
  design, rather than reflexively flagging "hardcoded secret = critical." Real context
  calibration.
- Found a genuine latent bug: `SessionProvider.jsx` freezes `accessToken` into the
  context value (stale-null after sign-in if any component reads it from context).
- Every WARN was qualified with "harmless on the happy path, but X would trigger it" —
  no false positives, good severity discipline.
- **Drift defect in the reviewer itself:** summary line used BLOCKER/WARN/NOTE correctly,
  but finding bodies drifted to CRITICAL/INFO. Root cause: my Output section *showed* the
  vocabulary in an example but didn't *require* it — classic prompt drift. Fixed with a
  hard constraint ("Every finding line MUST begin with exactly one of BLOCKER/WARN/NOTE").
  A live lesson that examples ≠ constraints when writing agent prompts.

Pipeline topology after both components:
scoping → **preflight** → spec pipeline → parallel build → **code-reviewer** → QA → delivery.
Preflight guards inputs (environment), code-reviewer guards outputs (generated code),
QA guards runtime — a graded-severity gate at each, with consistent block/warn semantics.
