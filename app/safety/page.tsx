import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { getSafetyAlerts } from "@/lib/api";

export default async function SafetyPage() {
  const items = await getSafetyAlerts();

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Safety Intelligence"
        title="Operational safety exposure"
        description="Monitor risk combinations between machine degradation, operational thresholds, and worker exposure scenarios."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <SectionCard key={item.id} title={item.title} subtitle={`Risk matrix ${item.risk_matrix}`}>
            <div className="flex gap-2">
              <StatusBadge value={item.severity} />
              <StatusBadge value={item.status} />
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              The safety scoring engine elevated this alert because current degradation patterns intersect with elevated operator exposure.
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
