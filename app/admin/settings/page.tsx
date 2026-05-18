import { DataTable, PageHeader, SectionCard } from "@/components/ui";
import { getIndustrialFieldSets, getIntakeWorkspaces, getRoleProfiles } from "@/lib/api";

export default async function SettingsPage() {
  const [fieldSets, workspaces, profiles] = await Promise.all([
    getIndustrialFieldSets(),
    getIntakeWorkspaces(),
    getRoleProfiles(),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Admin Settings"
        title="Platform configuration and data governance"
        description="Set the standards that make industrial inputs consistent across assets, sensor tags, work execution, HSE records, and executive reporting."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Scoring controls">
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">Machine health score uses anomaly, maintenance, incident, and safety penalties.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Failure risk and urgency can be tuned by criticality and downtime cost.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Role-based approval boundaries keep executives, engineers, HSE, and maintenance teams aligned on who can override or sign off key decisions.</div>
          </div>
        </SectionCard>
        <SectionCard title="Localization & deployment">
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">Primary timezone: Asia/Riyadh</div>
            <div className="rounded-2xl bg-slate-50 p-4">Languages: English and Arabic with RTL-aware layout architecture</div>
            <div className="rounded-2xl bg-slate-50 p-4">Notification escalation ready for in-app and email delivery</div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Approval ownership" subtitle="Suggested sign-off split so the right roles govern the most important industrial inputs.">
        <DataTable
          columns={["Role", "Primary approval boundary", "Operational purpose"]}
          rows={profiles.map((profile) => [
            profile.label,
            profile.approvals.slice(0, 2).join(", "),
            profile.mission,
          ])}
        />
      </SectionCard>

      <div className="space-y-4">
        {fieldSets.map((set) => (
          <SectionCard key={set.domain} title={set.domain} subtitle={set.subtitle}>
            <div className="mb-4 flex flex-wrap gap-2">
              {set.owner_roles.map((owner) => (
                <span key={owner} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {owner}
                </span>
              ))}
            </div>
            <DataTable
              columns={["Field", "Requirement", "Why it matters"]}
              rows={set.fields.map((field) => [field.name, field.requirement, field.notes])}
            />
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Configured intake workspaces" subtitle="Operational tabs that make data entry easier for the person closest to the work.">
        <DataTable
          columns={["Workspace", "Owner", "Cadence", "Key fields"]}
          rows={workspaces.map((workspace) => [
            workspace.title,
            workspace.owner_label,
            workspace.cadence,
            workspace.required_fields.slice(0, 3).join(", "),
          ])}
        />
      </SectionCard>
    </div>
  );
}
