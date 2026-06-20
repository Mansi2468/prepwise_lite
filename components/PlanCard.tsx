import type { StudyPlan } from "@/lib/types";

interface PlanCardProps {
  plan: StudyPlan;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{plan.subject}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Exam: {formatDate(plan.exam_date)}
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {formatDate(plan.created_at)}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Topics
        </h3>
        <p className="text-sm text-slate-700">{plan.topics}</p>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Study Schedule
        </h3>
        <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
          {plan.plan}
        </div>
      </div>
    </article>
  );
}
