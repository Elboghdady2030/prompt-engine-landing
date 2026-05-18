import { PageHeader, SectionCard } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Authentication"
        title="Secure industrial access"
        description="Role-based access control for executives, maintenance leaders, reliability teams, technicians, and HSE stakeholders."
      />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Demo login" subtitle="JWT-ready auth flow with Saudi localization-aware user preferences.">
          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Email</p>
              <p>admin@najd-industries.sa</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Password</p>
              <p>ChangeMe123!</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Supported roles">
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Super Admin</li>
            <li>Factory Owner / Group Executive</li>
            <li>Plant Manager</li>
            <li>Maintenance Manager</li>
            <li>Reliability Engineer</li>
            <li>Safety / HSE Manager</li>
            <li>Maintenance Technician</li>
            <li>Viewer / Auditor</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
