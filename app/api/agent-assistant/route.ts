import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

import { KashefAgentSdk } from "@/lib/kashef-agent-sdk";
import type { AgentAssistantRequest, AgentAssistantResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  let payload: AgentAssistantRequest;

  try {
    payload = (await request.json()) as AgentAssistantRequest;
  } catch {
    return badRequest("Invalid JSON payload.");
  }

  if (!payload?.message?.trim()) {
    return badRequest("`message` is required.");
  }

  if (!process.env.OPENAI_API_KEY) {
    return badRequest("OPENAI_API_KEY is not configured on the server.", 500);
  }

  try {
    const enrichedMessage = buildAssistantMessage(payload);
    const sdk = KashefAgentSdk.fromEnv();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await sdk.runOpenAIResponsesLoop({
      openai,
      userMessage: enrichedMessage,
      context: payload.context,
      toolChoice: payload.toolChoice,
      model: payload.model,
    });

    const response: AgentAssistantResponse = {
      answer: result.text,
      model: payload.model ?? process.env.OPENAI_MODEL ?? "gpt-5.5",
    };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Agent assistant request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildAssistantMessage(payload: AgentAssistantRequest): string {
  const message = payload.message.trim();
  const pageContext = payload.pageContext;
  if (!pageContext) {
    return message;
  }

  if (pageContext.page === "asset") {
    return [
      "Current page context:",
      `Asset page for ${pageContext.assetName ?? "unknown asset"} (${pageContext.assetCode ?? "no asset code"})`,
      pageContext.assetId ? `Platform asset_id: ${pageContext.assetId}` : null,
      pageContext.assetCategory ? `Category: ${pageContext.assetCategory}` : null,
      pageContext.assetCriticality ? `Criticality: ${pageContext.assetCriticality}` : null,
      "",
      `User request: ${message}`,
      "Use the asset-specific context when selecting tools and writing the answer.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    "Current page context:",
    `Dashboard page${pageContext.title ? ` for ${pageContext.title}` : ""}`,
    "",
    `User request: ${message}`,
    "Use plant-wide operational context when selecting tools and writing the answer.",
  ].join("\n");
}
