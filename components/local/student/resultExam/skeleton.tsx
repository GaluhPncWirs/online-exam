export default function ResultExamSkeleton() {
  return (
    <>
      {/* ================= RESULT HEADER ================= */}
      <section className="overflow-hidden rounded-3xl bg-slate-200 p-6 shadow-sm animate-pulse sm:p-8">
        {/* Back Button */}
        <div className="h-9 w-40 rounded-lg bg-slate-300" />

        {/* Heading */}
        <div className="mt-7">
          <div className="h-3 w-28 rounded bg-slate-300" />

          <div className="mt-3 h-9 w-40 rounded-md bg-slate-300 sm:h-10" />

          {/* Exam Name */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-5 w-64 max-w-full rounded bg-slate-300" />
            <div className="h-7 w-28 rounded-full bg-slate-300" />
          </div>
        </div>
      </section>

      {/* ================= REVIEW HEADER ================= */}
      <section className="mt-8">
        <div className="mb-5 animate-pulse">
          <div className="h-3 w-28 rounded bg-slate-200" />

          <div className="mt-2 h-7 w-56 rounded-md bg-slate-200" />

          <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-100" />
        </div>

        {/* ================= QUESTION CARDS ================= */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Question Header */}
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                <div className="flex items-start gap-3 animate-pulse">
                  {/* Number */}
                  <div className="size-9 shrink-0 rounded-lg bg-slate-200" />

                  {/* Question Text */}
                  <div className="w-full pt-1">
                    <div className="h-4 w-full max-w-md rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-3/4 max-w-sm rounded bg-slate-100" />
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="p-5">
                <div className="flex flex-col gap-3 animate-pulse">
                  {[1, 2, 3, 4].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div className="size-7 shrink-0 rounded-lg bg-slate-100" />

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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BACK BUTTON ================= */}
      <div className="flex justify-center pb-4 pt-2 sm:justify-start">
        <div className="h-11 w-48 rounded-xl bg-slate-200 animate-pulse" />
      </div>
    </>
  );
}
