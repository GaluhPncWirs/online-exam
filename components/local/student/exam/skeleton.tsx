export default function ExamSkeleton() {
  return (
    <>
      {/* ================= EXAM SIDEBAR ================= */}
      <aside className="fixed inset-y-0 left-0 hidden w-72.5 bg-slate-900 md:block">
        <div className="flex h-full flex-col p-5">
          {/* Header */}
          <div className="animate-pulse">
            <div className="h-3 w-28 rounded bg-slate-700" />

            <div className="mt-3 h-7 w-40 rounded-md bg-slate-700" />

            <div className="mt-5 flex items-center justify-between gap-3">
              <div>
                <div className="h-3 w-20 rounded bg-slate-800" />
                <div className="mt-2 h-4 w-24 rounded bg-slate-700" />
              </div>

              <div className="h-10 w-28 rounded-xl bg-slate-700" />
            </div>
          </div>

          {/* Question Navigation */}
          <div className="mt-8">
            <div className="h-4 w-28 rounded bg-slate-700 animate-pulse" />

            <div className="mt-4 grid grid-cols-5 gap-2 animate-pulse">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-white/10" />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
            <div className="h-3 w-20 rounded bg-slate-700" />

            <div className="mt-4 space-y-3">
              <div className="h-3 w-28 rounded bg-slate-800" />
              <div className="h-3 w-32 rounded bg-slate-800" />
              <div className="h-3 w-24 rounded bg-slate-800" />
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="min-h-screen bg-slate-100 md:ml-72.5">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
          {/* Exam Header */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between animate-pulse">
              <div className="w-full">
                <div className="h-3 w-24 rounded bg-slate-200" />

                <div className="mt-3 h-8 w-72 max-w-full rounded-md bg-slate-200" />
              </div>

              <div className="ml-4 hidden h-10 w-28 rounded-xl bg-slate-200 md:block" />
            </div>
          </section>

          {/* Question Cards */}
          <div className="mt-5 space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <section
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
              >
                {/* Question */}
                <div className="flex items-start gap-4 animate-pulse">
                  <div className="size-10 shrink-0 rounded-xl bg-slate-200" />

                  <div className="w-full pt-1">
                    <div className="h-3 w-24 rounded bg-slate-100" />

                    <div className="mt-2 h-5 w-full max-w-2xl rounded bg-slate-200" />

                    <div className="mt-2 h-5 w-3/4 max-w-xl rounded bg-slate-100" />
                  </div>
                </div>

                {/* Options */}
                <div className="mt-6 space-y-3 animate-pulse">
                  {[1, 2, 3, 4].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-4"
                    >
                      <div className="size-5 rounded-full bg-slate-100" />

                      <div className="size-7 rounded-lg bg-slate-100" />

                      <div
                        className={`h-4 rounded bg-slate-100 ${
                          option === 1
                            ? "w-3/4"
                            : option === 2
                              ? "w-full"
                              : option === 3
                                ? "w-2/3"
                                : "w-4/5"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Mark Button */}
                <div className="mt-5 flex justify-end animate-pulse">
                  <div className="h-10 w-32 rounded-xl bg-slate-100" />
                </div>
              </section>
            ))}
          </div>

          {/* Submit */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
              <div>
                <div className="h-5 w-44 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
              </div>

              <div className="h-11 w-full rounded-xl bg-slate-200 sm:w-32" />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
