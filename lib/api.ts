import {
  assetDetailById,
  assets,
  dashboardData,
  incidents,
  industrialFieldSets,
  intakeSubmissions,
  intakeWorkspaces,
  roleProfiles,
  safetyAlerts,
  users,
  workOrderDetailById,
  workOrders,
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

export async function getWorkOrders() {
  const data = await request("/work-orders", { items: workOrders });
  return "items" in data ? data.items : workOrders;
}

export async function getWorkOrder(workOrderId: number) {
  return request(`/work-orders/${workOrderId}`, workOrderDetailById[workOrderId] ?? workOrderDetailById[201]);
}

export async function getIncidents() {
  const data = await request("/incidents", { items: incidents });
  return "items" in data ? data.items : incidents;
}

export async function getSafetyAlerts() {
  const data = await request("/safety-alerts", { items: safetyAlerts });
  return "items" in data ? data.items : safetyAlerts;
}

export async function getUsers() {
  const data = await request("/users", { items: users });
  return "items" in data ? data.items : users;
}

export async function getRoleProfiles() {
  const data = await request("/users/role-profiles", { items: roleProfiles });
  return "items" in data ? data.items : roleProfiles;
}

export async function getIntakeWorkspaces() {
  const data = await request("/admin/intake-workspaces", { items: intakeWorkspaces });
  return "items" in data ? data.items : intakeWorkspaces;
}

export async function getIndustrialFieldSets() {
  const data = await request("/admin/industrial-field-sets", { items: industrialFieldSets });
  return "items" in data ? data.items : industrialFieldSets;
}

export async function getIntakeSubmissions() {
  const data = await request("/admin/intake-submissions", { items: intakeSubmissions });
  return "items" in data ? data.items : intakeSubmissions;
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
