"use client";

import { useState } from "react";

import { DataTable, SectionCard, StatusBadge } from "@/components/ui";
import type { IndustrialFieldSet, IntakeSubmission, IntakeWorkspace, RoleProfile } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  workspaces: IntakeWorkspace[];
  fieldSets: IndustrialFieldSet[];
  profiles: RoleProfile[];
  submissions: IntakeSubmission[];
};

type WorkspaceKey = "asset-master" | "condition-monitoring" | "maintenance-execution" | "incident-hse";

const defaultForms = {
  "asset-master": {
    submitted_by: "Lina Al-Otaibi",
    plant: "Casting Plant",
    asset_code: "DRV-22",
    summary: "Registered a new drive asset with criticality and downtime cost context.",
  },
  "condition-monitoring": {
    submitted_by: "Khaled Al-Qahtani",
    plant: "Utilities Plant",
    asset_code: "PMP-07",
    summary: "Adjusted vibration baseline and updated threshold notes after overhaul review.",
  },
  "maintenance-execution": {
    submitted_by: "Maha Al-Dosari",
    plant: "Casting Plant",
    asset_code: "CMP-01",
    summary: "Logged predictive inspection scope, parts reservation, and closure expectations.",
  },
  "incident-hse": {
    submitted_by: "Noura Al-Shammari",
    plant: "Utilities Plant",
    asset_code: "PMP-07",
    summary: "Captured exposure controls, permit restriction, and incident follow-up actions.",
  },
};

export function IntakeClient({ workspaces, fieldSets, profiles, submissions: initialSubmissions }: Props) {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceKey>("asset-master");
  const [forms, setForms] = useState(defaultForms);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (workspace: WorkspaceKey, field: string, value: string) => {
    setForms((current) => ({
      ...current,
      [workspace]: {
        ...current[workspace],
        [field]: value,
      },
    }));
  };

  const submitWorkspace = async (workspace: WorkspaceKey) => {
    setIsSubmitting(true);
    setStatusMessage(null);

    const payload = forms[workspace];
    try {
      if (!API_URL) {
        const fallbackItem: IntakeSubmission = {
          id: submissions.length + 1,
          workspace_id: workspace,
          workspace_title: workspaces.find((item) => item.id === workspace)?.title ?? workspace,
          owner_role: workspaces.find((item) => item.id === workspace)?.owner_role ?? "super_admin",
          submitted_by: payload.submitted_by,
          plant: payload.plant,
          asset_reference: payload.asset_code,
          summary: payload.summary,
          status: workspace === "maintenance-execution" ? "submitted" : "review_required",
          created_at: new Date().toISOString(),
        };
        setSubmissions((current) => [fallbackItem, ...current]);
        setStatusMessage("Captured in demo mode. Configure NEXT_PUBLIC_API_URL to persist through the backend.");
      } else {
        setStatusMessage("Backend persistence is available, but this frontend demo keeps the submission local in the browser flow.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspace);

  return (
    <div className="space-y-4">
      <SectionCard title="Operational intake workspaces" subtitle="Assign the right inputs to the right industrial role so the platform receives accurate context.">
        <div className="flex flex-wrap gap-2">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              type="button"
              onClick={() => setActiveWorkspace(workspace.id as WorkspaceKey)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeWorkspace === workspace.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {workspace.owner_label}
            </button>
          ))}
        </div>

        {currentWorkspace ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{currentWorkspace.owner_label}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{currentWorkspace.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{currentWorkspace.purpose}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Submitted by" value={forms[activeWorkspace].submitted_by} onChange={(value) => updateField(activeWorkspace, "submitted_by", value)} />
              <Input label="Plant" value={forms[activeWorkspace].plant} onChange={(value) => updateField(activeWorkspace, "plant", value)} />
              <Input label="Asset code" value={forms[activeWorkspace].asset_code} onChange={(value) => updateField(activeWorkspace, "asset_code", value)} />
              <TextArea className="md:col-span-2" label="Summary" value={forms[activeWorkspace].summary} onChange={(value) => updateField(activeWorkspace, "summary", value)} />
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-500">
                {statusMessage ? <span>{statusMessage}</span> : <span>Submit to create a governed intake record for review or execution.</span>}
              </div>
              <button
                type="button"
                onClick={() => void submitWorkspace(activeWorkspace)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Submitting..." : "Submit intake"}
              </button>
            </div>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="Recent intake submissions" subtitle="Latest entries sent by operations, maintenance, reliability, and HSE teams.">
        <DataTable
          columns={["Workspace", "Submitted by", "Plant", "Reference", "Status", "Summary"]}
          rows={submissions.map((item) => [
            item.workspace_title,
            item.submitted_by,
            item.plant,
            item.asset_reference,
            <StatusBadge key={item.id} value={item.status} />,
            item.summary,
          ])}
        />
      </SectionCard>

      <SectionCard title="Recommended role-to-tab mapping" subtitle="Suggested admin and team dashboard structure for fast, accurate industrial data capture.">
        <DataTable
          columns={["Role", "Primary dashboard tabs", "Main data to feed", "Expected outcome"]}
          rows={profiles.map((profile) => [
            profile.label,
            profile.primary_tabs.join(", "),
            profile.core_inputs.join(", "),
            profile.outcome_metrics.join(", "),
          ])}
        />
      </SectionCard>

      <SectionCard title="Industrial data coverage checklist" subtitle="The field domains the platform should cover to reflect strong industrial best practice.">
        <DataTable
          columns={["Domain", "Role owners", "Coverage standard"]}
          rows={fieldSets.map((set) => [
            set.domain,
            set.owner_roles.join(", "),
            set.fields.map((field) => `${field.name} (${field.requirement})`).slice(0, 3).join(", "),
          ])}
        />
      </SectionCard>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
    </label>
  );
}

function TextArea({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400" />
    </label>
  );
}
