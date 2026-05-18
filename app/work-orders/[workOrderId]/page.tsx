import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { getIntakeSubmissions, getWorkOrder } from "@/lib/api";

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ workOrderId: string }> }) {
  const { workOrderId } = await params;
  const [detail, submissions] = await Promise.all([getWorkOrder(Number(workOrderId)), getIntakeSubmissions()]);
  const item = detail.item;
  const assetCodeByAssetId: Record<number, string> = {
    101: "CMP-01",
    103: "PMP-07",
  };
  const relatedSubmissions = submissions.filter(
    (submission) =>
      submission.workspace_id === "maintenance-execution" &&
      submission.asset_reference === assetCodeByAssetId[item.asset_id]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Work Order"
        title={item.title}
        description="Execution detail for predictive maintenance activity, including ownership, SLA exposure, and expected downtime impact."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Execution summary">
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">Assigned to</strong>{item.assigned_to}</div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">SLA</strong>{item.sla_hours} hours</div>
            <div className="rounded-2xl bg-slate-50 p-4"><strong className="block text-slate-900">Downtime impact</strong>{item.downtime_impact_hours} hours</div>
            <div className="flex gap-2">
              <StatusBadge value={item.status} />
              <StatusBadge value={item.priority} />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Technician notes">
          <div className="space-y-3 text-sm text-slate-600">
            {detail.updates.map((update) => (
              <div key={update.id} className="rounded-2xl bg-slate-50 p-4">
                <strong className="block text-slate-900">{update.status.replaceAll("_", " ")}</strong>
                <p className="mt-2">{update.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Linked maintenance intake" subtitle="Recent governed planning and closure inputs connected to maintenance execution.">
        <div className="space-y-3 text-sm text-slate-600">
          {relatedSubmissions.length ? (
            relatedSubmissions.map((submission) => (
              <div key={submission.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{submission.workspace_title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {submission.submitted_by} | {submission.asset_reference} | {submission.plant}
                    </p>
                  </div>
                  <StatusBadge value={submission.status} />
                </div>
                <p className="mt-3 leading-6">{submission.summary}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-slate-500">
              No maintenance intake evidence is linked yet for this work order.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
