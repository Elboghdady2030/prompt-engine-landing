import { AgentAssistantPanel } from "@/components/agent-assistant-panel";
import { PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/ui";
import { getAsset, getIntakeSubmissions } from "@/lib/api";
import { localizeDomainList, localizeDomainText } from "@/lib/domain-localization";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function AssetDetailPage({ params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const locale = await getLocale();
  const messages = getMessages(locale);
  const copy = messages.pages.assetDetail;
  const common = messages.common;
  const [asset, submissions] = await Promise.all([getAsset(Number(assetId)), getIntakeSubmissions()]);
  const assetSubmissions = submissions.filter((item) => item.asset_reference === asset.asset_code);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={localizeDomainText(asset.name, locale)}
        description={`${localizeDomainText(asset.category, locale)} ${copy.descriptionSuffix}`}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={copy.healthScore} value={`${asset.predictions.health_score}%`} tone="warning" />
        <StatCard label={copy.failureRisk} value={`${asset.predictions.failure_risk_score}%`} tone="danger" />
        <StatCard label={copy.maintenanceUrgency} value={`${asset.predictions.maintenance_urgency_score}%`} tone="warning" />
        <StatCard label={copy.rulEstimate} value={`${asset.predictions.remaining_useful_life_days} ${common.days}`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title={copy.metadataTitle} subtitle={copy.metadataSubtitle}>
          <div className="grid gap-3 md:grid-cols-2 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">{copy.code}</strong>{asset.asset_code}</div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">{copy.criticality}</strong><StatusBadge value={asset.criticality} locale={locale} /></div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">{copy.status}</strong><StatusBadge value={asset.status} locale={locale} /></div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">{copy.manufacturer}</strong>{asset.manufacturer}</div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">{copy.model}</strong>{asset.model}</div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">{copy.downtimeCostPerHour}</strong>{common.sar} {asset.downtime_cost_per_hour}</div>
          </div>
        </SectionCard>

        <SectionCard title={copy.latestSignalsTitle} subtitle={copy.latestSignalsSubtitle}>
          <div className="grid gap-3 grid-cols-2 text-sm text-slate-600">
            {Object.entries(asset.latest_reading).map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-50 p-4">
                <strong className="block text-slate-900">{copy.signalLabels[key as keyof typeof copy.signalLabels] ?? key.replaceAll("_", " ")}</strong>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title={copy.trendTitle} subtitle={copy.trendSubtitle}>
          <div className="space-y-3">
            {asset.sensor_trend.map((reading) => (
              <div key={String(reading.recorded_at)} className="grid grid-cols-4 gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <div><strong className="block text-slate-900">{common.time}</strong>{String(reading.recorded_at)}</div>
                <div><strong className="block text-slate-900">{common.temp}</strong>{String(reading.temperature)}</div>
                <div><strong className="block text-slate-900">{common.vibration}</strong>{String(reading.vibration)}</div>
                <div><strong className="block text-slate-900">{common.pressure}</strong>{String(reading.pressure)}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={copy.recommendationsTitle} subtitle={copy.recommendationsSubtitle}>
          <div className="space-y-3">
            {asset.predictions.recommendations.map((item) => (
              <div key={item} className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-slate-700">
                {localizeDomainText(item, locale)}
              </div>
            ))}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-slate-700">
              <strong className="block text-slate-900">{common.probableCauses}</strong>
              {localizeDomainList(asset.predictions.probable_causes, locale).join(" ")}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title={copy.openWorkOrders}>
          <div className="space-y-3 text-sm">
            {asset.open_work_orders.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">{localizeDomainText(item.title, locale)}</p>
                <p className="mt-2 text-slate-600">{localizeDomainText(item.assigned_to, locale)}</p>
                <div className="mt-3 flex gap-2">
                  <StatusBadge value={item.status} locale={locale} />
                  <StatusBadge value={item.priority} locale={locale} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={copy.incidentHistory}>
          <div className="space-y-3 text-sm">
            {asset.incidents.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">{localizeDomainText(item.title, locale)}</p>
                <div className="mt-3 flex gap-2">
                  <StatusBadge value={item.severity} locale={locale} />
                  <StatusBadge value={item.status} locale={locale} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={copy.riskSummary}>
          <div className="space-y-3 text-sm">
            {asset.safety_alerts.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">{localizeDomainText(item.title, locale)}</p>
                <p className="mt-2 text-slate-600">{common.riskMatrix} {item.risk_matrix}</p>
                <div className="mt-3"><StatusBadge value={item.severity} locale={locale} /></div>
              </div>
            ))}
            {asset.spare_parts.map((part) => (
              <div key={part.id} className="rounded-2xl border border-slate-200 p-4 text-slate-600">
                <strong className="block text-slate-900">{localizeDomainText(part.name, locale)}</strong>
                {common.stock} {part.stock_on_hand} / {common.reorderAt} {part.reorder_level}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title={copy.intakeTrailTitle} subtitle={copy.intakeTrailSubtitle}>
        <div className="space-y-3">
          {assetSubmissions.length ? (
            assetSubmissions.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{localizeDomainText(item.workspace_title, locale)}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {localizeDomainText(item.submitted_by, locale)} | {localizeDomainText(item.plant, locale)}
                    </p>
                  </div>
                  <StatusBadge value={item.status} locale={locale} />
                </div>
                <p className="mt-3 leading-6">{localizeDomainText(item.summary, locale)}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">{copy.noIntake}</div>
          )}
        </div>
      </SectionCard>

      <AgentAssistantPanel
        locale={locale}
        pageContext={{
          page: "asset",
          assetId: asset.id,
          assetCode: asset.asset_code,
          assetName: asset.name,
          assetCategory: asset.category,
          assetCriticality: asset.criticality,
        }}
      />
    </div>
  );
}
