export default function CorrectionSkeletonTeacher() {
  return (
    <>
      {/* ================= HEADER ================= */}
      <section className="overflow-hidden rounded-3xl bg-slate-200 p-6 shadow-sm animate-pulse sm:p-8">
        <div className="h-3 w-28 rounded bg-slate-300" />

        <div className="mt-3 h-9 w-64 max-w-full rounded-md bg-slate-300" />

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="h-6 w-56 rounded-full bg-slate-300" />
          <div className="h-6 w-20 rounded-full bg-slate-300" />
        </div>
      </section>

      {/* ================= INFO ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 w-full max-w-3xl rounded bg-slate-200" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-slate-100" />
        </div>
      </div>

      {/* ================= QUESTIONS ================= */}
      <section className="space-y-5">
        {[1, 2, 3, 4].map((item) => (
          <article
            key={item}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Question Header */}
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3 animate-pulse">
                <div className="size-9 shrink-0 rounded-lg bg-slate-200" />

                <div className="w-full">
                  <div className="h-3 w-24 rounded bg-slate-100" />

                  <div className="mt-2 h-5 w-full max-w-2xl rounded bg-slate-200" />

                  <div className="mt-2 h-4 w-3/4 max-w-xl rounded bg-slate-100" />
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 md:p-6">
              {/* Student Answer */}
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-6 w-20 rounded-full bg-slate-100" />
                </div>

                <div className="mt-3 h-40 rounded-xl bg-slate-100" />
              </div>

              {/* Assessment */}
              <div className="animate-pulse">
                <div className="h-4 w-28 rounded bg-slate-200" />

                <div className="mt-2 h-3 w-56 rounded bg-slate-100" />

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[1, 2, 3, 4].map((score) => (
                    <div
                      key={score}
                      className="rounded-xl border border-slate-100 p-3"
                    >
                      <div className="mx-auto size-5 rounded-full bg-slate-100" />

                      <div className="mx-auto mt-3 h-4 w-8 rounded bg-slate-100" />

                      <div className="mx-auto mt-2 h-3 w-16 rounded bg-slate-100" />

                      <div className="mx-auto mt-2 h-6 w-10 rounded-full bg-slate-100" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 h-24 rounded-xl bg-slate-50" />
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ================= ACTION BAR ================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/30 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
          <div>
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="mt-2 h-8 w-24 rounded-md bg-slate-200" />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="h-11 w-24 rounded-xl bg-slate-100" />
            <div className="h-11 w-40 rounded-xl bg-slate-200" />
          </div>
        </div>
      </section>
    </>
  );
}
