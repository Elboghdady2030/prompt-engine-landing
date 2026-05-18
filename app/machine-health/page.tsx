import { PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/ui";
import { getAssets } from "@/lib/api";
import { localizeDomainText } from "@/lib/domain-localization";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function MachineHealthPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const copy = messages.pages.machineHealth;
  const items = await getAssets();

  return (
    <div className="space-y-4">
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label={copy.averageHealth} value={`${Math.round(items.reduce((sum, asset) => sum + asset.health_score, 0) / items.length)}%`} tone="good" />
        <StatCard label={copy.criticalAssets} value={items.filter((asset) => asset.criticality === "critical" && asset.failure_risk_score > 60).length} tone="danger" />
        <StatCard label={copy.highRiskAssets} value={items.filter((asset) => asset.failure_risk_score > 70).length} tone="warning" />
      </div>
      <SectionCard title={copy.byAssetTitle}>
        <div className="space-y-3">
          {items.map((asset) => (
            <div key={asset.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{localizeDomainText(asset.name, locale)}</p>
                  <p className="text-sm text-slate-500">{localizeDomainText(asset.category, locale)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={asset.status} locale={locale} />
                  <StatusBadge value={asset.criticality} locale={locale} />
                  <span className="text-sm font-semibold text-slate-900">{copy.health} {asset.health_score}%</span>
                  <span className="text-sm font-semibold text-slate-900">{copy.risk} {asset.failure_risk_score}%</span>
                </div>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-400" style={{ width: `${asset.health_score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
