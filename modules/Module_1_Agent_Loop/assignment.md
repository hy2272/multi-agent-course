# Lesson 1 — Assignment

Clone the course repo, open it in Claude Code, and use the `/beautiful-html` skill to turn a
technical topic into a polished, shareable HTML presentation.

---

## Overview

**What you are doing and why.** This assignment has one goal: get you comfortable opening the
course repo inside Claude Code and running a skill. You will use the `/beautiful-html` skill — a
built-in command that turns any written content or topic into a fully styled, single-file HTML
presentation using a library of 34 professional templates.

The topic is your choice. Pick anything from class today — the agent loop, ReAct, what a harness
does, or any concept you want to turn into a shareable artifact. The output is a real deliverable
you can drop into a browser and present immediately.

---

## Step 01 — Clone the course repository

Open a terminal and run the commands below. This clones the repo and moves you into it.
Everything Claude needs — skills, progress tracking, tutor instructions — is already inside.

```bash
git clone https://github.com/hamzafarooq/multi-agent-course.git
cd multi-agent-course
```

**Already cloned?** Pull the latest changes first:

```bash
git pull origin main
```

---

## Step 02 — Open the repo in Claude Code

Claude Code runs in the browser at [claude.ai/code](https://claude.ai/code). You do not need to
install anything. Open the URL, then add the cloned folder to your session so Claude can read the
course files.

**Option A — Claude Code web (easiest)**

1. Go to claude.ai/code in your browser
2. Click "Open folder" (or drag the `multi-agent-course` folder in)
3. Claude reads `CLAUDE.md` automatically and becomes your course tutor

**Option B — Claude Code CLI (if installed)**

```bash
cd multi-agent-course
claude
```

**What happens automatically.** Claude reads `CLAUDE.md` on startup and switches into tutor mode.
It knows the course structure, your learning progress, and all the available skills. You do not
need to explain anything.

---

## Step 03 — Run the `/beautiful-html` skill

In the Claude Code chat, type the command below. Replace the bracketed part with your actual topic.
Claude will ask you to pick a template, fetch it, populate it with your content, and save a `.html`
file to the repo folder.

```
/beautiful-html [your topic here]
```

**Topic ideas if you are stuck** — pick the one most relevant to what you want to understand better:

- What is the ReAct agent loop
- How a production harness works
- Context engineering basics
- What is RAG
- KV caching explained
- Why agents need memory
- Tool use in LLM agents
- MCP protocol overview

**What the skill does.** Claude offers you 3 template options with a one-line reason for each.
Pick one (or say "you choose"). It fetches the template, maps your content to the slide layouts,
and saves a fully working `.html` file in your local folder. Navigate with arrow keys or mouse scroll.

---

## Step 04 — Open the file and verify it works

Find the saved `.html` file in the `multi-agent-course` folder and open it in any browser. You
should see a full-screen slide deck with keyboard and scroll navigation. If it opens blank or
broken, paste the error back into Claude and it will fix it.

```bash
# macOS
open your-filename.html

# Windows
start your-filename.html
```

---

## Deliverable

**What to submit.** Post the `.html` file in the class Slack channel before Class 2. You can also
share a screenshot of slide 1 if you want a preview alongside the file.

| Requirement | Detail |
|---|---|
| One `.html` file | The output of the `/beautiful-html` skill |
| Topic visible on the cover slide | Should be clear what you chose |
| At least 5 slides | Claude generates 10–15 by default; if fewer, re-run |
| Opens in a browser without errors | Test it before submitting |

---

## If things go wrong

**Claude says it cannot find the skill.** Make sure you opened the `multi-agent-course` folder —
not a parent directory. The skills live in `.claude/skills/beautiful-html/` and Claude needs to be
rooted at the repo level to find them.

**The HTML file opens but looks blank.** The template requires an internet connection to load
Google Fonts. Open it in a browser tab (not a preview pane). If fonts still fail, the layout still
works — it falls back to system sans-serif.

**Claude stopped mid-generation.** Type `continue` in the chat. Claude will pick up from where it
stopped and finish writing the file.

**You want a different template.** Tell Claude: "Use the vellum template instead" or "Try the
signal template." It will fetch and repopulate with the same content. Full template list at
[github.com/zarazhangrui/beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates).
