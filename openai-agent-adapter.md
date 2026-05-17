# OpenAI Agent Adapter

Base path: `/api/v1/openai-agent`

This adapter makes the Kashef Ai backend easier to use from OpenAI-powered agents by exposing:

- OpenAI-style function tool definitions
- a request-template builder for the Responses API
- a local tool-call executor that maps tool names to the platform's internal agent actions

## Endpoints

### `GET /openai-agent/catalog`

Returns:

- recommended OpenAI model
- system prompt
- tool definitions
- recommended authentication headers

### `POST /openai-agent/request-template`

Builds a ready-to-send OpenAI Responses API body using:

- `user_message`
- locale / timezone / role context
- tool choice mode

### `POST /openai-agent/tool-call`

Executes one OpenAI-style tool locally against Kashef Ai data.

Example tool names:

- `get_fleet_overview`
- `diagnose_asset`
- `plan_maintenance_action`
- `analyze_incident_rca`
- `triage_safety_alerts`

## Authentication

The adapter uses the same platform agent security contract:

- `X-Agent-Key: <AGENT_API_KEY>`
- or `Authorization: Bearer <AGENT_API_KEY>`

## Integration pattern

1. Fetch `/openai-agent/catalog`
2. Pass the returned `system_prompt` and `tools` into the OpenAI Responses API
3. When the model selects a tool, call `/openai-agent/tool-call`
4. Feed the tool result back into the model as tool output

## Ready-to-copy Python example

Example file:

- [backend/examples/openai_responses_agent_loop.py](/Users/mostafaelboghdady/Documents/Codex/2026-04-22-you-are-a-principal-software-architect/backend/examples/openai_responses_agent_loop.py)

Run it with:

```bash
pip install openai

export OPENAI_API_KEY=your_openai_key
export KASHEF_BASE_URL=http://localhost:8000/api/v1
export KASHEF_AGENT_KEY=kashef-agent-demo-key
export OPENAI_MODEL=gpt-5.5

python backend/examples/openai_responses_agent_loop.py \
  "Review the highest-risk compressor and recommend the next maintenance action."
```

The script performs the full loop:

1. fetches the OpenAI tool catalog from Kashef Ai
2. sends the user request to the OpenAI Responses API
3. executes function calls through `/openai-agent/tool-call`
4. returns `function_call_output` items back to OpenAI until the model produces a final answer

Important detail:

- for Responses API function calling, the prior `response.output` items should be included along with the `function_call_output` items when continuing the loop
- this matches OpenAI’s documented multi-step tool flow for Responses API function calling

## Notes

- `OPENAI_MODEL` defaults to `gpt-5.5`
- `OPENAI_API_KEY` is included for deployment readiness, though the current backend adapter does not directly call OpenAI from the server
- this keeps OpenAI orchestration separate from industrial business logic, which stays in the platform agent service
