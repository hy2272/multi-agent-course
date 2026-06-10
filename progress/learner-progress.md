# Learner Progress

<!-- Claude reads this at the start of each session and updates it at the end.
     Learners: you don't need to touch this — Claude maintains it. -->

## Learner profile
- Name: [unset]
- Preferred learning style: Build-along (hands-on)
- Started: 2026-05-30
- Last session: 2026-06-09

## Module status

| Module | Status | Notes / weak spots |
|--------|--------|--------------------|
| 01 — Agents, ReAct & the Harness | ✅ COMPLETE | Built from-scratch ReAct agent (Agent Pro ReAct.ipynb) end-to-end + ran it ✅. Ran AgentPro framework + smolagents (CodeAgent/ToolCallingAgent/@tool/travel agent) ✅. Grasped: framework = hardened harness; Tool vs LLMTool; @abstractmethod contract; Observation must be filled by harness (not model) → no hallucination; messages = memory; prompt↔parser coupling; tool reliability = result reliability; sandbox/permissions (additional_authorized_imports). Homework done (/beautiful-html deck). Learned uv + per-framework envs, Jupyter≠production. Detailed notes in Obsidian vault module-1. |
| 02 — Skills, Subagents & Multi-Agent Orchestration | not started | (upstream restructured the course — this was formerly "Quantization"; new Module 2 is Skills/Subagents) |
| 03 — Agentic RAG, Semantic Cache & Knowledge Graphs | not started | |
| 04 — Evaluation & Guardrails | not started | |
| 05 — Multi-Agent Systems (MCP · A2A · ADK) | not started | |
| 06 — Voice Agents & LLM Optimization | not started | |

Status values: not started · in progress · completed · needs review

## Weak spots to revisit
- Local Python env hygiene: had venv/kernel mismatch (myenv vs .venv) and env-var/.env loading issues. Now resolved (registered .venv kernel "Python (.venv multi-agent)", uses .env + load_dotenv, python.envFile pointed at .env). Worth reinforcing: install with %pip / {sys.executable}, load_dotenv BEFORE clients are constructed.
- OpenAI API vs ChatGPT subscription are separate billing; needed API credits + correct model name (gpt-4o-mini, the notebook's gpt-4 is unavailable on new accounts).

## Reminders
- OpenAI API key: learner ROTATED it ✅ (was exposed in chat during setup) — resolved 2026-06-07.

## ⏳ UNFINISHED — remind the learner at next session start (his explicit TODO list, 2026-06-06)
The learner asked to be reminded of ALL of these next time. Surface this whole list at session start.

1. **HTML formatting follow-ups** — he may still want to tweak the decks' HTML/formatting; expect more back-and-forth on `react-agent-loop.html` and `module-1-recap.html`.
2. **Clean up generated output / best practice** — root dir is now cluttered with generated artifacts (`react-agent-loop.html/.pdf`, `module-1-recap.html/.pdf`, `export_pdf.js`, `package.json`, `package-lock.json`, `node_modules/`). He wants a better setup than dumping these in the repo root — propose an `output/` or `artifacts/` folder + `.gitignore` strategy (and where node_modules/playwright should live). Discuss best practice.
3. **Explain the /beautiful-html skill** — teach him how the skill actually works end to end: what a SKILL.md is, how it's invoked, the 5-phase workflow (gather → pick template → WebFetch template → populate slide layouts → save/export), how I fetched + rethemed the template, why output is a single self-contained HTML, etc. Teaching moment, not just usage.
4. **Assignment markdown cleanup** — he pasted the raw assignment into `modules/Module_1_Agent_Loop/assignment` (a file, no extension). He wants to KEEP this as a proper `.md` file but have me reformat/clean it up nicely. (Rename to `assignment.md`? confirm with him.)
5. **Git/GitHub sync strategy** — repo is a FORK of hamzafarooq/multi-agent-course. Upstream has new changes AND he has local changes. Teach him the best way to reconcile: add `upstream` remote, fetch, merge/rebase, handle conflicts, keep his work. He has uncommitted local changes (decks, notes, .env, progress edits) — plan carefully so nothing is lost. Note .env must stay gitignored (already is).
6. **smolagents notebook — DONE ✅ (2026-06-07).** Ran cells 7,8,11,17,21,22,23. Learner now has HF_TOKEN (added Inference Providers permission after a 403). Covered: CodeAgent (acts by writing+executing code, got Fibonacci #118 right via exec), ToolCallingAgent (JSON action — got it WRONG by hallucinating, no calc tool → great contrast on why tools matter), CodeAgent + DuckDuckGoSearchTool + InferenceClientModel (Qwen, 2-step loop, real Observation), and @tool custom tool (model_download_tool). Fixed two version-drift bugs live: google.colab→load_dotenv, and list_models() `direction=-1` arg removed in new huggingface_hub. Key concepts he nailed: CodeAgent↔his AgentPro class (not CodeEngine), @tool extracts name from fn name / purpose from docstring / arg from Args: + type hints, and the engineering judgment "clear branches → fixed tools (safe); open tasks → CodeAgent (flexible); prod → sandbox". Also learned __call__ vs __main__. ALSO ran the Google Maps travel-agent (cells 28-29): installed googlemaps==4.10.0, learner got a Google Cloud API key (IP-restricted to his public IP + Directions-API-only). Fixed a 2nd hardcoded-value bug live: the tool's `departure_time=datetime(2025,6,6,...)` was now in the PAST → Google rejected with INVALID_REQUEST; changed to `datetime.now()+timedelta(hours=1)`. Saw the full lesson arc on tool reliability: tool missing → hallucinate (cell 11); tool errors → silently degrade to made-up estimates (first 2 travel runs); tool works → real data (final run, real bike times 17/12/28/20 mins, textbook 6-step ReAct loop). Also nailed `model=model` = param-name=variable-name (not "default/random model"). **Module 1 FULLY COMPLETE — all notebooks + travel agent done.**
7. **Package management best practice (long-term solution)** — wants a proper sit-down discussion, NOT a quick fix. Context of pain across the 3 notebooks: venv/kernel mismatch (myenv vs .venv), `!pip` vs `%pip`, env vars lost on restart → moved to .env + load_dotenv, AND AgentPro's unpinned deps DOWNGRADED openai/pydantic in .venv (dependency hell). Discuss: per-project venv hygiene, pinning (requirements.txt / lockfiles / uv / pip-tools), maybe isolating experimental frameworks (AgentPro/smolagents) in separate venvs, how to register kernels cleanly, reproducibility. Give him a durable workflow he can reuse for every future notebook/module.
8. **Explore Matt Pocock's skills repo** — instructor Hamza recommended https://github.com/mattpocock/skills (skills he uses daily for code work). Learner wants to look into installing/using these in Claude Code. Skills include: diagnose, grill-with-docs, triage, improve-codebase-architecture, setup-matt-pocock-skills (run once per repo first), tdd, to-issues, to-prd, zoom-out, prototype. Teaching angle: ties directly to item 3 (how skills work) — these are real-world examples of the SKILL.md pattern. Walk him through what each does, how to install them into ~/.claude/skills or project .claude/skills, and which are worth adopting for this course's workflow.

## Learner's chosen order for the 7→8 TODOs (2026-06-07)
1st: quick small items → **#1 (HTML tweaks) + #4 (assignment.md cleanup)** — DONE ✅
2nd: finish Module 1 → **#6 (smolagents notebook + travel agent)** — DONE ✅
3rd: clean up → **#2 (generated-output hygiene) + #7 (package mgmt best practice)** — DONE ✅
4th: learn → **#3 (explain /beautiful-html skill)** + **#8 (Matt Pocock skills repo)** together — REMAINING
(key rotation: DONE)

### #2 + #7 done (2026-06-07)
- #2: deleted the 4 generated decks (regenerable); moved export_pdf.js → scripts/ with a README; rewrote .gitignore (node_modules/, output/, *.pdf, generated html, .ipynb_checkpoints, envs/*/.venv/). Root is clean now (only source + package.json/lock + scripts/). Confirmed node_modules never tracked.
- #7: taught package-mgmt best practice. Learner chose **uv** + **one env per framework**. Built a real demo: envs/smolagents/ (uv venv, Python 3.13, smolagents[litellm]+ddgs+python-dotenv+ipykernel, uv.lock committed, registered kernel "Python (course-smolagents)"). Wrote envs/README.md with the reusable 4-step recipe + 3 rules. NOTE: the old root .venv (Python 3.14, course-shared, has the AgentPro-downgraded openai/pydantic) is LEFT AS-IS — notebooks still use kernel "Python (.venv multi-agent)". Going forward, new notebooks should use per-framework uv envs.
- Taught alongside: why Jupyter = scratch/learning not production (hidden state / reproducibility), and why `additional_authorized_imports=["datetime"]` needs datetime (model-generated sandboxed code) but not googlemaps (runs inside the trusted tool) — ties to permissions/harness.

## ⏳ REMAINING TODOs (as of 2026-06-07 end)
- **#3 + #8** — explain the /beautiful-html skill (how SKILL.md works, the phases) AND walk through Matt Pocock's skills repo (https://github.com/mattpocock/skills): what each skill does, how to install into ~/.claude/skills or project .claude/skills, which to adopt. Do together (both about "how skills work").
- **#5** — Git/GitHub fork sync. Fork of hamzafarooq/multi-agent-course. Upstream has updates AND lots of local uncommitted changes now (decks deleted, scripts/, envs/, .gitignore rewrite, assignment.md, progress edits, skill Phase 5 edit). Add `upstream` remote, fetch, merge/rebase carefully so nothing is lost. .env stays gitignored.
- **#9 (NEW)** — Hands-on practice: have the learner BUILD an agentpro uv env himself (mirror the smolagents demo) to practice the uv 4-step workflow. He learns best by doing it once.
- **#10 (NEW)** — Migrate Obsidian access to an MCP server instead of bulk-loading notes. As his vault grows, don't brute-force read files into context; use an Obsidian/filesystem MCP so notes are searchable on demand (saves tokens/context). Research options (e.g. obsidian-mcp, filesystem MCP pointed at the vault) and set up.

## Env decision (2026-06-07)
- Root `.venv` (Python 3.14, kernel "Python (.venv multi-agent)") = LEFT AS-IS. It works for Module 1 notebooks; don't rebuild.
- **Going forward: Module 2-6 each get their own uv env** (per envs/README.md 4-step recipe). New packages stay isolated per module → no more cross-downgrades. Learner will build agentpro env as practice (#9).

### #5 done (2026-06-08)
- Synced fork with upstream. upstream remote already set. committed all local work first (commit 25e2805), merged upstream/main (14 commits: Module 2-6 materials, ~40 new skills, Sprint_Zero project), resolved the one conflict in progress/learner-progress.md (kept his Module 1 progress + adopted upstream's new module structure), pushed to origin (787c49b). Taught: --no-edit, origin vs upstream, fetch vs merge, "commit before merge" safety. Repo stays PUBLIC (no secrets; .env gitignored; fork can't easily go private anyway). NOTE: upstream restructured course — Module 2 is now "Skills, Subagents & Multi-Agent Orchestration" (was Quantization).

### #3 + #8 done (2026-06-08)
- Taught how skills work: folder + SKILL.md (frontmatter description = trigger/router + progressive loading; body = instructions). description quality determines whether Claude triggers/knows the skill.
- Installed 15 Matt Pocock skills GLOBALLY: diagnose, grill-me, grill-with-docs, triage, improve-codebase-architecture, setup-matt-pocock-skills, tdd, to-issues, to-prd, zoom-out, prototype, handoff, git-guardrails-claude-code, write-a-skill, caveman. Install mechanism: `npx skills@latest add mattpocock/skills --global --yes --skill <name>` → lands in ~/.agents/skills/ (cross-agent) → symlinked to ~/.claude/skills/. The "PromptScript does not support global install" warning is for OTHER agents, not Claude Code.
- REMINDERS for him: run `/setup-matt-pocock-skills` before using to-issues/triage/diagnose/tdd etc (they need repo issue-tracker/doc config); skills run with full agent permissions (review SKILL.md in ~/.agents/skills/ before trusting); git-guardrails-claude-code installs HOOKS (ties to Module 1 harness hooks concept).

### Obsidian notes written (2026-06-08)
Three notes, filed by topic (git/skills are cross-course general knowledge, not course-specific):
- `Reference/Git & GitHub/Fork sync — upstream, commit, merge, resolve conflicts.md`
- `5-Claude-Code/Agent skills — SKILL.md, cross-agent install (Matt Pocock).md`
- `1-Courses/multi-agent-course/module-1/Python syntax Q&A (notebooks).md`
All cross-linked, status: to-review.

### #10 done (2026-06-09)
- Obsidian access via MCP. Installed coddingtonbear's **Local REST API** community plugin in vault (`~/Documents/awesome_vault`), enabled it, grabbed its API key. Registered MarkusPfundstein's `mcp-obsidian` server GLOBALLY (`claude mcp add mcp-obsidian --scope user -e OBSIDIAN_API_KEY=… -e OBSIDIAN_HOST=127.0.0.1 -e OBSIDIAN_PORT=27124 -- uvx mcp-obsidian`) → `✓ Connected`. Global scope because the vault is general-purpose, not course-specific. Note: plugin now ships its OWN built-in MCP at `https://127.0.0.1:27124/mcp/`, but Claude Code rejects its self-signed cert, so we use the uvx wrapper (handles the cert internally) instead — did NOT enable the non-encrypted HTTP server. Obsidian tools appear after a Claude Code restart.

### #9 done (2026-06-09)
- Built `envs/agentpro/` uv env hands-on (build-along, learner ran every command). Walked the 4-step recipe. Real gotchas hit & taught: (1) `cd` didn't take → `uv init` ran in repo root, left a stray `pyproject.toml` we removed → lesson: `pwd` before init. (2) `uv add agentpro` failed "not found in registry" — AgentPro is NOT on PyPI; installed from git via `uv add "agentpro @ git+https://github.com/traversaal-ai/AgentPro.git"` → uv auto-added `[tool.uv.sources]`. (3) Disk question → taught uv global cache + hardlink/CoW dedup (new env's real cost ≈ its unique pkgs only). (4) VSCode didn't show the new kernel → needs refresh/reload; selecting the `.venv` directly works since ipykernel is in it. Verified: `sys.executable` → envs/agentpro/.venv, openai 2.41.0 / pydantic 2.13.4 (NOT downgraded, isolated). Renamed project to `course-agentpro-env` to avoid self-dep clash. uv.lock committed-ready.
- Follow-up Q&A: taught that the env runs plain `.py` too (3 ways: `uv run python`, activate, direct `.venv/bin/python`); `ipykernel` is only the Jupyter bridge, not needed for scripts. `uv run` ignores an activated VIRTUAL_ENV and uses the project's `.venv` → safer than manual activate. Built `envs/agentpro/test_agent.py` to prove the script path (untracked scratch file).

### /setup-matt-pocock-skills done (2026-06-09)
- Ran the per-repo setup for the engineering skills, configured for THIS repo. Choices: **issue tracker = local markdown** (`.scratch/<feature>/`), **triage labels = canonical 5** (as a `Status:` line in each issue file), **domain docs = single-context** (`CONTEXT.md` + `docs/adr/`). Wrote: `## Agent skills` block appended to `CLAUDE.md`, plus `docs/agents/issue-tracker.md`, `triage-labels.md`, `domain.md` (seeded from the skill's templates). Now `to-issues`/`to-prd`/`triage`/`diagnose`/`tdd`/`improve-codebase-architecture` know this repo's conventions. Reminder given: skills run with full agent permissions; git-guardrails installs hooks.
- Also taught the WHOLE Matt Pocock toolkit conceptually: it's a pipeline (think→break→build→debug) chained as grill-me → to-prd → to-issues → triage → tdd → diagnose, with "AFK-agent-ready" slicing (ties to Module 2 subagents).

### Obsidian notes written (2026-06-09)
- `Reference/Python/uv — isolated Python envs (per-project, 4-step recipe).md` — full uv recipe, gotchas, disk/hardlink, .py vs notebook.
- `5-Claude-Code/Matt Pocock skills — what each does & the engineering workflow.md` — the toolkit overview + chained workflow.
Both cross-linked, status: to-review.

## Next step
- **Module 1 CLOSED OUT (2026-06-09).** All Module-1 follow-up TODOs + the four new ones (#9 uv env, #10 Obsidian MCP, setup-matt-pocock-skills, commit) are DONE.
- **PENDING / next session:** run ONE Matt Pocock skill live to see it in action (best candidates: `/grill-me` on a half-formed idea, or `/diagnose` on a real error). Learner asked to defer this to a future session. ALSO: learner should restart Claude Code to load the `mcp-obsidian` tools.
- **Then: start Module 2 ("Skills, Subagents & Multi-Agent Orchestration").** Spin up a fresh uv env with the 4-step recipe if its notebooks need new deps.
- Housekeeping: Obsidian notes live in the vault (outside this repo); skill installs are global. `envs/agentpro/test_agent.py` is an untracked scratch file (keep or delete).
