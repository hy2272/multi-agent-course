# Spec: /sprint-zero-preflight

## Purpose
Born from two real failures in the first run: better-sqlite3@11 vs Node 25, and a Playwright MCP registered under a typo'd name
Before buikd the product, check and validate pre-conditions, fail fast
## Checks
### 1. Node version
-How: run node --version, parse the major version.
-Pass: major ≥ 18 and ≤ 22 (LTS range the kit's pinned deps have prebuilt binaries for).
-Warn (not fail): major ≥ 23 → print: "Node {v} is newer than the kit's tested range; native modules (better-sqlite3, bcryptjs) may need source builds or version bumps. Known fix: better-sqlite3@12+ for Node 25."
-Fail: major < 18 → print state + "Install Node 18-22 LTS (e.g. brew install node@22)."
-Blocking: only the < 18 case. Too-new = warning

### 2. Playwright MCP(Note：search for "playwright"，palywright is NOT correct！)
Namefrom qa-engineer.md and README(QA agent use mcp__playwright__* find tool)
-How: claude mcp list, compare and exact match with qa-engineer.md 和 README playwirght name
-Pass: exactly match the name
-Skip: 如果scope.md 里面 project type 不是 web-app 时（api-service/cli 没有浏览器测试），playwright 缺失应该降级为Skip
-Warn: 大小写不一致但是名字一样
-Fail: 名字有typo 或者MCP Playwright不存在
-Blocking: 名字有typo 或者MCP Playwright不存在. 大小写不一致但是名字一样 = warning
### 3. Ports free
开始project之前，检查确定scope.md写计划使用的ports检查是否free
-How: run check ports used in scope.md status lsof -i :3001
-Pass: all ports are free 
-Fail: any port is not free → print state + "free the port."
-Blocking: any port is not free
### 4. Supabase .env
后端工具：如果升级supabase查询.env 4 keys
-How: read data layer from docs/scope.md; if local → SKIP (print "n/a"); if supabase → check .env exists and contains all 4 keys (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, DATABASE_URL)
-Pass: .env exists and contains all 4 keys 
-Fail: .env not exists or missing any of the keys
-Blocking: .env not exists or missing any of the keys  Recovery: list missing keys


## Output format
All checks pass (warns allowed): print the per-check table (PASS/WARN/FAIL/SKIP + one-line detail), then "Preflight passed — proceeding.
PREFLIGHT_FAILED — Meaning: one or more preconditions failed. Recovery: follow each FAIL line's instruction, then re-run /sprint-zero.
## Integration
（/sprint-zero 主流程在哪一步调用它？scoping 前还是后？为什么？）
docs/scope.md完成之后，spec 流水线（research/PRD）之前。核对cope.md project type / stack profile / data layer
原则一句话：preflight should fail fast，越早越好。 
## What this command does NOT do
Does NOT fix anything automatically — it only reports and prints recovery instructions.
Does NOT install or upgrade software, modify docs/, or touch any code.
Does NOT make stack decisions — scope.md is the only source of the build config.

## Acceptance criteria
-Given Node 16 is active, when I run /sprint-zero-preflight, then it prints PREFLIGHT_FAILED with the Node line marked FAIL and an install instruction, and /sprint-zero does not proceed to research.
-Given playwright MCP is listed on palywright, when I run /sprint-zero-preflight, then it prints PREFLIGHT_FAILED with playwright MCP marked FAIL and an install/rename instruction, and /sprint-zero does not proceed to research.
-Given Ports are ocupied, when I run /sprint-zero-preflight, then it prints PREFLIGHT_FAILED with Ports free marked FAIL and free ports instruction, and /sprint-zero does not proceed to research.
-Given supabase .env is missing or missing any of the keys, when I run /sprint-zero-preflight, then it prints PREFLIGHT_FAILED with supabase .env marked FAIL or missing key marked FAIL and an adding all 4 keys instruction, and /sprint-zero does not proceed to research.