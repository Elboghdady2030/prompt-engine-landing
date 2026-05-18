import Link from "next/link";

import { DataTable, PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { getAssets, getIntakeSubmissions } from "@/lib/api";
import { localizeDomainText } from "@/lib/domain-localization";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function AssetsPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const copy = messages.pages.assets;
  const common = messages.common;
  const [items, submissions] = await Promise.all([getAssets(), getIntakeSubmissions()]);
  const recentAssetIntake = submissions.filter((item) => item.workspace_id === "condition-monitoring" || item.workspace_id === "maintenance-execution");

  return (
    <div className="space-y-4">
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

      <SectionCard title={copy.listTitle} subtitle={copy.listSubtitle}>
        <DataTable
          columns={copy.columns}
          rows={items.map((asset) => [
            <Link key={asset.id} href={`/assets/${asset.id}`} className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4">
              {asset.asset_code}
            </Link>,
            localizeDomainText(asset.name, locale),
            localizeDomainText(asset.category, locale),
            <StatusBadge key={`${asset.id}-status`} value={asset.status} locale={locale} />,
            `${asset.health_score}%`,
            `${asset.failure_risk_score}%`,
            recentAssetIntake.find((item) => item.asset_reference === asset.asset_code)?.summary ?? common.noRecentIntakeLinked,
          ])}
        />
      </SectionCard>

      <SectionCard title={copy.recentTitle} subtitle={copy.recentSubtitle}>
        <div className="space-y-3">
          {recentAssetIntake.slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-900">{item.asset_reference}</p>
                <StatusBadge value={item.status} locale={locale} />
              </div>
              <p className="mt-2 leading-6">{localizeDomainText(item.summary, locale)}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                {item.workspace_title} | {localizeDomainText(item.submitted_by, locale)} | {localizeDomainText(item.plant, locale)}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
