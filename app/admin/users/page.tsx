import { DataTable, PageHeader, SectionCard } from "@/components/ui";
import { getRoleProfiles, getUsers } from "@/lib/api";

export default async function UsersPage() {
  const [items, profiles] = await Promise.all([getUsers(), getRoleProfiles()]);
  const profileByRole = Object.fromEntries(profiles.map((profile) => [profile.role, profile]));

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="User Management"
        title="Role-based industrial operating model"
        description="Define exactly who enters which data, which dashboards they use, and where approvals sit so the AI layer receives consistent industrial context."
      />
      <SectionCard title="Tenant users" subtitle="Production-ready access model covering executives, plant operations, maintenance, reliability, HSE, technicians, and audit users.">
        <DataTable
          columns={["Name", "Email", "Role", "Locale", "Timezone"]}
          rows={items.map((item) => [
            item.name,
            item.email,
            profileByRole[item.role]?.label ?? item.role,
            item.locale.toUpperCase(),
            item.timezone ?? "Asia/Riyadh",
          ])}
        />
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {profiles.map((profile) => (
          <SectionCard key={profile.role} title={profile.label} subtitle={profile.dashboard_title}>
            <div className="space-y-4 text-sm text-slate-600">
              <p className="leading-6">{profile.mission}</p>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Primary tabs</p>
                <div className="flex flex-wrap gap-2">
                  {profile.primary_tabs.map((tab) => (
                    <span key={tab} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{tab}</span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
