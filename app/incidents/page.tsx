import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { getIncidents, getIntakeSubmissions } from "@/lib/api";

export default async function IncidentsPage() {
  const [items, submissions] = await Promise.all([getIncidents(), getIntakeSubmissions()]);
  const hseSubmissions = submissions.filter((item) => item.workspace_id === "incident-hse");
  const assetCodeByIncidentId: Record<number, string> = {
    301: "PMP-07",
    302: "CMP-01",
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Incident & RCA"
        title="Failure analysis and root-cause intelligence"
        description="Correlate sensor behavior, incident history, technician notes, and operational context to explain probable causes."
      />
      <div className="grid gap-4">
        {items.map((item) => {
          const linkedSubmissions = hseSubmissions.filter(
            (submission) => submission.asset_reference === assetCodeByIncidentId[item.id]
          );

          return (
            <SectionCard key={item.id} title={item.title} subtitle={item.summary}>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={item.severity} />
                <StatusBadge value={item.status} />
              </div>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-slate-700">
                <strong className="block text-slate-900">AI RCA summary</strong>
                {item.rcaSummary}
              </div>
              <div className="mt-4 space-y-3">
                {linkedSubmissions.length ? (
                  linkedSubmissions.map((submission) => (
                    <div key={submission.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">{submission.workspace_title}</p>
                        <StatusBadge value={submission.status} />
                      </div>
                      <p className="mt-2 leading-6">{submission.summary}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {submission.submitted_by} | {submission.asset_reference} | {submission.plant}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    No HSE intake submission is linked yet for this incident.
                  </div>
                )}
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
