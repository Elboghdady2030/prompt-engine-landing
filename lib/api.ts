import {
  assetDetailById,
  assets,
  dashboardData,
  intakeSubmissions,
  workOrderDetailById,
} from "@/lib/demo-data";
import type { AgentAssistantRequest, AgentAssistantResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(path: string, fallback: T): Promise<T> {
  if (!API_URL) {
    return fallback;
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getDashboardData() {
  return request("/dashboard/overview", dashboardData);
}

export async function getAssets() {
  return request("/assets", assets);
}

export async function getAsset(assetId: number) {
  return request(`/assets/${assetId}`, assetDetailById[assetId] ?? assetDetailById[103]);
}

export async function getWorkOrder(workOrderId: number) {
  return request(`/work-orders/${workOrderId}`, workOrderDetailById[workOrderId] ?? workOrderDetailById[201]);
}

export async function getIntakeSubmissions() {
  return intakeSubmissions;
}

export async function askAgentAssistant(payload: AgentAssistantRequest): Promise<AgentAssistantResponse> {
  const response = await fetch("/api/agent-assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Agent assistant request failed");
  }

  return (await response.json()) as AgentAssistantResponse;
}
