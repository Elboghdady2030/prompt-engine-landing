import Link from "next/link";

import { DataTable, PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { getIntakeSubmissions, getWorkOrders } from "@/lib/api";

export default async function WorkOrdersPage() {
  const [items, submissions] = await Promise.all([getWorkOrders(), getIntakeSubmissions()]);
  const maintenanceSubmissions = submissions.filter((item) => item.workspace_id === "maintenance-execution");

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Maintenance Operations"
        title="Work orders and predictive action flow"
        description="Generate, assign, track, and close maintenance work with SLA, downtime impact, and priority visibility."
      />
      <SectionCard title="Active work orders" subtitle="Predictive and preventive execution backlog for the maintenance team.">
        <DataTable
          columns={["Title", "Status", "Priority", "Assigned to", "Open item"]}
          rows={items.map((item) => [
            item.title,
            <StatusBadge key={`${item.id}-status`} value={item.status} />,
            <StatusBadge key={`${item.id}-priority`} value={item.priority} />,
            item.assigned_to,
            <Link key={item.id} href={`/work-orders/${item.id}`} className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4">
              View details
            </Link>,
          ])}
        />
      </SectionCard>

      <SectionCard title="Maintenance intake evidence" subtitle="Recent planning and closure records entered by maintenance leadership and technicians.">
        <div className="space-y-3">
          {maintenanceSubmissions.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-slate-900">{item.asset_reference}</p>
                <StatusBadge value={item.status} />
              </div>
              <p className="mt-2 leading-6">{item.summary}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                {item.workspace_title} | {item.submitted_by} | {item.plant}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
