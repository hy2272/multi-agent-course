Lesson 1

You've already used Skills. You know how to give Claude a reusable workflow and invoke it with a slash command.



That's one agent, doing one thing, in sequence.



Module 2 is about what happens when you need more than that.



Subagents are how you go from "Claude doing one thing well" to "Claude running a coordinated system that does many things simultaneously." The difference is not incremental — it's architectural. And it changes what's possible.





What Is an Agent?
Before subagents make sense, let's be precise about what an agent actually is.

An agent is a Claude session with:

A system prompt that defines its role, constraints, and tools

A task it's been given

The ability to take actions — read files, write code, call APIs, spawn other agents

The key word is actions. A chatbot responds. An agent acts.

When you run Claude Code and ask it to build a feature, you're already working with an agent. It reads your codebase, writes files, runs commands, checks the output, and iterates. That loop — perceive, reason, act, observe — is the agent loop.



What Is a Subagent?
A subagent is an agent spawned by another agent to handle a specific piece of work.

The agent that spawns others is called the orchestrator. The agents it spawns are subagents. Each subagent gets its own isolated context window, its own task, and its own set of tools. When it's done, it returns a result to the orchestrator.

This is the structural shift that makes multi-agent systems powerful:







Why Isolated Context Windows Matter
This is the detail most people miss when they first learn about subagents.



Every Claude session has a context window — a limit on how much information it can hold at once. In a long session with lots of file reads, tool calls, and back-and-forth, that window fills up. Things get slow, expensive, and eventually Claude starts losing track of earlier context.



Subagents solve this. When you spawn a subagent to do a specific job — say, analyze 50 customer support tickets — all of that ticket content lives in the subagent's context window, not yours. When the subagent finishes, it returns a summary. Your main session receives the summary, not the raw data.



Your context window stays clean. The subagent's context window handles the noise.

This is also why subagents are better than just writing a very long prompt. The problem with very long prompts isn't just length — it's that everything is mixed together.



Subagents let you keep concerns separated by design.



The Orchestrator Pattern
The most common multi-agent architecture is the orchestrator + subagents pattern:


Orchestrator
├── Subagent A  →  Task A  →  Result A
├── Subagent B  →  Task B  →  Result B  (runs in parallel with A)
└── Subagent C  →  Task C  →  Result C  (runs in parallel with A and B)
         ↓
   Orchestrator receives all results
         ↓
   Synthesizes final output


The orchestrator's job is coordination, not execution. It decides what needs to be done, who does it, and how the results fit together. The subagents do the actual work.



A concrete example from Sprint Zero:

The spec-writing phase (scope → PRD → decisions → user stories → API contract) runs sequentially through one agent because each document builds on the last. But the build phase runs two agents in parallel: one builds the backend, one builds the frontend. They both work from the API contract. Neither needs to wait for the other.

Wall-clock time: the slower of the two builders, not both added together. That's the efficiency gain.



How to Define a Subagent in Claude Code
Subagents in Claude Code are defined as markdown files in .claude/agents/. Each file is the system prompt for that agent — its identity, its job, and its constraints.

A basic subagent definition looks like this:

python
# backend-engineer

You are a senior backend engineer. Your job is to implement the API endpoints 
defined in the API contract you've been given.

## What you build
- Express/Node.js server
- Supabase integration for database and auth
- One endpoint per spec in the contract

## What you do NOT do
- Build any frontend
- Make architectural decisions not in the spec
- Create new tables not defined in the data model

## Output
Return the full directory structure with all files created.

That's it. When the orchestrator spawns this agent, it gets this system prompt plus the task content (the API contract, in this case). Everything else is isolated.

Specialization Is a Design Decision
The most important thing you control when building a multi-agent system is how you divide the work.

Bad division: "Agent 1 does the first half, Agent 2 does the second half" — splitting by volume, not by expertise.

Good division: each agent has a clear domain, clear inputs, and clear outputs. The agents don't need to talk to each other mid-task because the spec they're both working from is the coordination layer.

Some useful specialization patterns:

By function:

researcher → gathers information

analyst → processes and structures it

writer → turns structure into prose

By layer:

backend-agent → API and database

frontend-agent → UI and state

qa-agent → validation and testing

By dimension (for reviews):

security-reviewer → looks only at auth, permissions, injection

performance-reviewer → looks only at queries, load times, N+1s

correctness-reviewer → looks only at logic bugs and edge cases

Each of these agents does one thing, does it well, and returns a structured result. The orchestrator combines them.



What Can Go Wrong (And How to Design Around It)


Multi-agent systems introduce failure modes that single-agent sessions don't have.



Context leakage: if a subagent's context window isn't clean at the start, it inherits noise from whatever it received. Fix: always give subagents explicit, minimal task briefs. Don't pass them the whole conversation.



Coordination gaps: if two parallel agents produce outputs that contradict each other, the orchestrator has to resolve it. Fix: define a shared spec (like an API contract) before parallel execution starts.



Cascading failures: if Subagent A fails and Subagents B and C depend on A's output, the whole pipeline stalls. Fix: design stages so failures are isolated. QA runs after builds complete; if a build fails, QA reports it rather than crashing.



Prompt drift: each subagent's system prompt is its entire understanding of its job. Vague prompts produce vague results. Fix: write subagent prompts the way you'd write acceptance criteria — specific, testable, scoped.





