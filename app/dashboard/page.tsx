import { AgentAssistantPanel } from "@/components/agent-assistant-panel";
import { ActionButton, DataTable, PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/ui";
import { getDashboardData } from "@/lib/api";
import { localizeDomainText } from "@/lib/domain-localization";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function DashboardPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const copy = messages.pages.dashboard;
  const common = messages.common;
  const data = await getDashboardData();
  const kpis = data.kpis as Record<string, number | number[] | Record<string, number>>;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={<ActionButton href="/reports" label={copy.action} />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={copy.stats.totalAssets} value={String(kpis.total_assets)} />
        <StatCard label={copy.stats.healthyAssets} value={String(kpis.healthy_assets)} tone="good" />
        <StatCard label={copy.stats.assetsAtRisk} value={String(kpis.assets_at_risk)} tone="warning" />
        <StatCard label={copy.stats.criticalAlerts} value={String(kpis.critical_alerts)} tone="danger" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title={copy.riskRegisterTitle} subtitle={copy.riskRegisterSubtitle}>
          <DataTable
            columns={copy.riskRegisterColumns}
            rows={data.assets.map((asset) => [
              localizeDomainText(asset.name, locale),
              <StatusBadge key={`${asset.id}-status`} value={asset.status} locale={locale} />,
              <StatusBadge key={`${asset.id}-criticality`} value={asset.criticality} locale={locale} />,
              `${asset.health_score}%`,
              `${asset.failure_risk_score}%`,
            ])}
          />
        </SectionCard>

        <SectionCard title={copy.hotspotsTitle} subtitle={copy.hotspotsSubtitle}>
          <div className="space-y-3">
            {data.risk_hotspots.map((spot) => (
              <div key={spot.asset} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{localizeDomainText(spot.asset, locale)}</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{localizeDomainText(spot.plant, locale)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{localizeDomainText(spot.risk_reason, locale)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title={copy.economicsTitle} subtitle={copy.economicsSubtitle}>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>{copy.mtbf}</span>
              <strong className="text-slate-900">{String(kpis.mtbf_hours)} {common.hours}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>{copy.mttr}</span>
              <strong className="text-slate-900">{String(kpis.mttr_hours)} {common.hours}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>{copy.downtimeHours}</span>
              <strong className="text-slate-900">{String(kpis.downtime_hours)} {common.hours}</strong>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={copy.predictionsTitle} subtitle={copy.predictionsSubtitle}>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>{copy.next7Days}</span>
              <strong className="text-slate-900">{String(kpis.predicted_failures_next_7_days)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>{copy.next30Days}</span>
              <strong className="text-slate-900">{String(kpis.predicted_failures_next_30_days)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span>{copy.plantHealthIndex}</span>
              <strong className="text-slate-900">{String(kpis.plant_health_index)}%</strong>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={copy.workloadTitle} subtitle={copy.workloadSubtitle}>
          <div className="space-y-3">
            {data.forecasted_maintenance_workload.map((item) => (
              <div key={item.week} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{item.week}</span>
                  <span className="text-slate-500">{item.planned + item.predictive} {common.tasks}</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="flex h-full">
                    <div className="bg-teal-600" style={{ width: `${item.planned * 10}%` }} />
                    <div className="bg-amber-500" style={{ width: `${item.predictive * 10}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <AgentAssistantPanel locale={locale} pageContext={{ page: "dashboard", title: copy.title }} />
    </div>
  );
}
