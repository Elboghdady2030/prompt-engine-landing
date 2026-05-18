import { PageHeader } from "@/components/ui";
import { getIndustrialFieldSets, getIntakeSubmissions, getIntakeWorkspaces, getRoleProfiles } from "@/lib/api";
import { IntakeClient } from "@/app/admin/intake/intake-client";

export default async function IntakePage() {
  const [workspaces, fieldSets, profiles, submissions] = await Promise.all([
    getIntakeWorkspaces(),
    getIndustrialFieldSets(),
    getRoleProfiles(),
    getIntakeSubmissions(),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Data Intake"
        title="Role-based operational input workspaces"
        description="Back-office tabs for admins and industrial teams to enter the right master data, telemetry context, maintenance evidence, and HSE content with less ambiguity."
      />
      <IntakeClient workspaces={workspaces} fieldSets={fieldSets} profiles={profiles} submissions={submissions} />
    </div>
  );
}
