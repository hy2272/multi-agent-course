# /sprint-zero-preflight — environment preflight check

Validate build preconditions before the spec pipeline runs. Report only —
never fix, install, or modify anything.

## Inputs
Read docs/scope.md for: project type, stack profile, data layer.
Resolve ports from .claude/stacks.md for the chosen profile.
If docs/scope.md does not exist, stop and print SCOPE_NEEDED.

## Checks (run all, collect results, do not stop at first failure)
### 1. Node version
Run `node --version`
Return Pass, if major ≥ 18 and ≤ 22 (LTS range the kit's pinned deps have prebuilt binaries for)
Return Warn (not fail), if major ≥ 23 and print: `Node {v} is newer than the kit's tested range; native modules (better-sqlite3, bcryptjs) may need source builds or version bumps. Known fix: better-sqlite3@12+ for Node 25.`
Return Fail, if major < 18 and print: `Node {v} is below the supported range. Install Node 18-22 LTS (e.g. brew install node@22).`

### 2. Playwright MCP
First read the project type from docs/scope.md:
Return Skip if project type is not web-app (api-service/cli have no browser tests) and print: `n/a — no browser tests for this project type.`
Otherwise run `claude mcp list` and look for a server named exactly `playwright` — this exact name is required because qa-engineer finds its tools as mcp__playwright__* (see qa-engineer.md and README).
Return Pass if a server named exactly `playwright` is listed.
Return Warn if a server is listed whose name differs only in capitalization (e.g. `Playwright`) and print: `Playwright MCP found but capitalization differs from the required name "playwright" — rename it to be safe.`
Return Fail if no server matches even loosely, or the name is misspelled (e.g. `palywright`), and print: `Register it under the exact name: claude mcp remove <wrong-name> (if present), then claude mcp add playwright --scope user -- npx @playwright/mcp@latest, then restart the session.`

### 3. Ports
Resolve the ports for the chosen stack profile from .claude/stacks.md (e.g. node-react: 3001 and 5173). For each resolved port, run `lsof -i :<port>`.
Return Pass if every resolved port is free (lsof prints nothing).
Return Fail if any resolved port is in use, and print for each occupied port: `Port <port> is in use by <process from lsof>. Free it (e.g. kill <pid>, or pkill -f "<command>") and re-run.`

### 4. Supabase .env
Read the data layer from docs/scope.md.
Return Skip if the data layer is `local` and print: `n/a — local data layer needs no .env.`
If the data layer is `supabase`, check that `.env` exists at the project root and contains non-empty values for all 4 keys (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, DATABASE_URL).
Return Pass if .env exists and all 4 keys are non-empty.
Return Fail if .env is missing or any key is missing/empty, and print: the list of missing keys + `Copy .env.example to .env and fill in the missing keys (see step 1b of /sprint-zero for where each value lives in the Supabase dashboard).`

## Output
Print a table: each check → PASS / WARN / FAIL / SKIP + one-line detail.
All pass (warns allowed): print "Preflight passed — proceeding."
Any FAIL: print state PREFLIGHT_FAILED + each FAIL's recovery instruction,
and instruct the orchestrator NOT to proceed.
