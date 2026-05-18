import "server-only";

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

export type KashefOpenAITool = {
  type: "function";
  name: string;
  description: string;
  parameters: JsonObject;
  strict: boolean;
};

export type KashefOpenAIToolCatalog = {
  model: string;
  auth_mode: string;
  system_prompt: string;
  tools: KashefOpenAITool[];
  recommended_headers: Record<string, string>;
};

export type KashefAgentContext = {
  locale?: string;
  timezone?: string;
  requesting_role?: string;
};

export type KashefToolExecutionResponse = {
  tool_name: string;
  result: JsonObject;
};

type ResponseFunctionCall = {
  type: "function_call";
  call_id: string;
  name: string;
  arguments: string;
};

type ResponseOutputItem = {
  type: string;
  [key: string]: unknown;
};

type FunctionCallOutputItem = {
  type: "function_call_output";
  call_id: string;
  output: string;
};

type OpenAIResponsesResult = {
  output: ResponseOutputItem[];
  output_text: string;
};

export type OpenAIResponsesClient = {
  responses: {
    create(input: {
      model: string;
      instructions: string;
      tools: KashefOpenAITool[];
      input: Array<string | ResponseOutputItem | FunctionCallOutputItem>;
      tool_choice: "auto" | "required";
    }): Promise<OpenAIResponsesResult>;
  };
};

export type RunOpenAIResponsesLoopArgs = {
  openai: OpenAIResponsesClient;
  userMessage: string;
  context?: KashefAgentContext;
  toolChoice?: "auto" | "required";
  model?: string;
};

export type RunOpenAIResponsesLoopResult = {
  text: string;
  lastResponse: OpenAIResponsesResult;
};

export type KashefAgentSdkOptions = {
  baseUrl: string;
  agentKey: string;
  fetchImpl?: typeof fetch;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFunctionCallItem(value: unknown): value is ResponseFunctionCall {
  return (
    isRecord(value) &&
    value.type === "function_call" &&
    typeof value.call_id === "string" &&
    typeof value.name === "string" &&
    typeof value.arguments === "string"
  );
}

function parseToolArguments(raw: string): JsonObject {
  const parsed = JSON.parse(raw) as unknown;
  if (!isRecord(parsed)) {
    throw new Error("Tool arguments must parse to a JSON object.");
  }
  return parsed as JsonObject;
}

function normalizeContext(context?: KashefAgentContext): Required<KashefAgentContext> {
  return {
    locale: context?.locale ?? "en",
    timezone: context?.timezone ?? "Asia/Riyadh",
    requesting_role: context?.requesting_role ?? "reliability_engineer",
  };
}

export class KashefAgentSdk {
  private readonly baseUrl: string;
  private readonly agentKey: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: KashefAgentSdkOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.agentKey = options.agentKey;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  static fromEnv(): KashefAgentSdk {
    const baseUrl =
      process.env.KASHEF_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:8000/api/v1";
    const agentKey = process.env.KASHEF_AGENT_KEY ?? process.env.AGENT_API_KEY;

    if (!agentKey) {
      throw new Error("KASHEF_AGENT_KEY or AGENT_API_KEY is required for KashefAgentSdk.");
    }

    return new KashefAgentSdk({ baseUrl, agentKey });
  }

  async getOpenAIToolCatalog(): Promise<KashefOpenAIToolCatalog> {
    return this.request<KashefOpenAIToolCatalog>("/openai-agent/catalog");
  }

  async buildOpenAIRequestTemplate(input: {
    userMessage: string;
    context?: KashefAgentContext;
    toolChoice?: "auto" | "required";
  }): Promise<{
    model: string;
    system_prompt: string;
    request_body: JsonObject;
  }> {
    return this.request("/openai-agent/request-template", {
      user_message: input.userMessage,
      context: normalizeContext(input.context),
      tool_choice: input.toolChoice ?? "auto",
    });
  }

  async executeOpenAITool(toolName: string, argumentsObject: JsonObject): Promise<JsonObject> {
    const response = await this.request<KashefToolExecutionResponse>("/openai-agent/tool-call", {
      tool_name: toolName,
      arguments: argumentsObject,
    });
    return response.result;
  }

  async runOpenAIResponsesLoop(args: RunOpenAIResponsesLoopArgs): Promise<RunOpenAIResponsesLoopResult> {
    const catalog = await this.getOpenAIToolCatalog();
    const context = normalizeContext(args.context);
    const inputItems: Array<string | ResponseOutputItem | FunctionCallOutputItem> = [args.userMessage];
    const model = args.model ?? catalog.model;

    while (true) {
      const response = await args.openai.responses.create({
        model,
        instructions: catalog.system_prompt,
        tools: catalog.tools,
        input: inputItems,
        tool_choice: args.toolChoice ?? "auto",
      });

      const rawOutput = Array.isArray(response.output) ? response.output : [];
      const functionCalls = rawOutput.filter(isFunctionCallItem);
      if (functionCalls.length === 0) {
        return { text: response.output_text, lastResponse: response };
      }

      inputItems.push(...rawOutput);

      for (const toolCall of functionCalls) {
        const toolArguments = {
          ...parseToolArguments(toolCall.arguments),
          locale: context.locale,
          timezone: context.timezone,
          requesting_role: context.requesting_role,
        };
        const result = await this.executeOpenAITool(toolCall.name, toolArguments);
        inputItems.push({
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(result),
        });
      }
    }
  }

  private async request<TResponse>(path: string, payload?: JsonObject): Promise<TResponse> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: payload ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Agent-Key": this.agentKey,
      },
      body: payload ? JSON.stringify(payload) : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Kashef SDK request failed (${response.status}): ${body}`);
    }

    return (await response.json()) as TResponse;
  }
}
