import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";
import PlanCard from "@/components/PlanCard";
import type { StudyPlan } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getPlans(): Promise<StudyPlan[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("study_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch plans:", error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Supabase not configured:", err);
    return [];
  }
}

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Study Plans</h1>
          <p className="mt-2 text-slate-600">
            All your AI-generated study schedules in one place.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Create New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-lg font-medium text-slate-700">No plans yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Generate your first personalized study schedule to get started.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create a Plan
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
