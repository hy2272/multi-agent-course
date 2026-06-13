"""Sanity check: prove this .py runs inside the isolated agentpro env (no notebook)."""
import sys

from dotenv import load_dotenv
load_dotenv()  # reads repo-root .env if present

import agentpro
import openai
import pydantic

print("python    :", sys.executable)
print("agentpro  :", agentpro.__file__)
print("openai    :", openai.__version__, "| pydantic:", pydantic.__version__)
print("\n✅ Plain .py ran inside envs/agentpro/.venv — no ipykernel involved.")
