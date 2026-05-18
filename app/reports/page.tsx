import { PageHeader, SectionCard } from "@/components/ui";
import { dashboardData } from "@/lib/demo-data";

export default async function ReportsPage() {
  const maintenanceCostTrend = dashboardData.kpis.maintenance_cost_trend as number[];
  const partsTrend = dashboardData.kpis.spare_parts_consumption_trend as number[];

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Analytics & Reporting"
        title="Executive reporting suite"
        description="Export-ready KPI surfaces for downtime economics, maintenance trends, spare parts usage, and predictive workload outlook."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Maintenance cost trend">
          <div className="space-y-3">
            {maintenanceCostTrend.map((value, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Month {index + 1}</span>
                  <strong className="text-slate-900">SAR {value}</strong>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div className="h-3 rounded-full bg-slate-900" style={{ width: `${Math.min(value / 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Spare parts consumption trend">
          <div className="space-y-3">
            {partsTrend.map((value, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Month {index + 1}</span>
                  <strong className="text-slate-900">{value} units</strong>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div className="h-3 rounded-full bg-teal-600" style={{ width: `${value * 6}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
