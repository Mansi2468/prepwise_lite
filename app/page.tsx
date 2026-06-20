import StudyForm from "@/components/StudyForm";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Smart Study Planner
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Enter your subject, topics, and exam date. PrepWise AI will create a
          personalized day-by-day study schedule for you.
        </p>
      </div>

      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <StudyForm />
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
        {[
          { step: "1", title: "Enter details", desc: "Subject, topics & exam date" },
          { step: "2", title: "AI generates", desc: "Personalized daily schedule" },
          { step: "3", title: "Study & save", desc: "Plans stored for later" },
        ].map((item) => (
          <div
            key={item.step}
            className="rounded-xl border border-slate-100 bg-white p-4 text-center"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {item.step}
            </span>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
