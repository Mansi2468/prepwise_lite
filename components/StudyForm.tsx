"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StudyPlan } from "@/lib/types";

interface StudyFormProps {
  onPlanGenerated?: (plan: StudyPlan) => void;
}

export default function StudyForm({ onPlanGenerated }: StudyFormProps) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topics, examDate }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate study plan");
      }

      onPlanGenerated?.(data.plan);
      router.push("/plans");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          placeholder="e.g. Mathematics, Physics"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label htmlFor="topics" className="mb-1.5 block text-sm font-medium text-slate-700">
          Topics
        </label>
        <textarea
          id="topics"
          required
          rows={4}
          placeholder="List topics separated by commas, e.g. Algebra, Calculus, Trigonometry"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label htmlFor="examDate" className="mb-1.5 block text-sm font-medium text-slate-700">
          Exam Date
        </label>
        <input
          id="examDate"
          type="date"
          required
          min={today}
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Generating your plan..." : "Generate Study Plan"}
      </button>
    </form>
  );
}
