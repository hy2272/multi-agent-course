# Per-framework environments (uv)

Each experimental framework gets its **own isolated environment** so a messy dependency in
one (e.g. AgentPro pins nothing and downgrades `openai`/`pydantic`) can't break the others.

Tool: [uv](https://docs.astral.sh/uv/) — one tool for venv + install + version-locking.

```
envs/
  smolagents/      pyproject.toml + uv.lock  (the recipe, committed)  + .venv/ (gitignored)
  agentpro/        ...
```

## Create a new isolated env (copy these 4 steps for any notebook)

```bash
# 1. make a folder + uv project (rename so it doesn't clash with a package name)
mkdir -p envs/<name> && cd envs/<name>
uv init --bare                     # then set name = "course-<name>-env" in pyproject.toml

# 2. add packages — uv resolves AND locks them into uv.lock automatically
uv add <pkg1> <pkg2> ipykernel

# 3. register this env as a Jupyter kernel
.venv/bin/python -m ipykernel install --user \
    --name course-<name> --display-name "Python (course-<name>)"

# 4. in the notebook: Kernel → Change Kernel → "Python (course-<name>)"
```

## Reproduce an env on another machine (or after deleting .venv)

```bash
cd envs/<name>
uv sync          # rebuilds .venv to the EXACT versions in uv.lock
```

## The three rules (why this avoids the pain we hit)

1. **Never install into global Python** — everything lives in a project `.venv`.
2. **Lock versions** — `uv.lock` is committed, so "works on my machine" → "works anywhere".
3. **Isolate messy deps** — frameworks that don't pin versions get their own env, so they
   can't downgrade packages another notebook relies on.

## In every notebook

- First cell: `from dotenv import load_dotenv; load_dotenv()` (reads the repo-root `.env`).
- After installing/changing packages: **Restart Kernel**, then run top-to-bottom.
- Sanity check the kernel: `import sys; print(sys.executable)` — should point inside this env's `.venv`.
