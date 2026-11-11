export default function ManageExamSkeletonTeacher() {
  return (
    <>
      {/* ================= HEADER ================= */}
      <section className="overflow-hidden rounded-3xl bg-slate-200 p-6 shadow-sm animate-pulse sm:p-8">
        <div className="h-3 w-28 rounded bg-slate-300" />

        <div className="mt-3 h-9 w-56 max-w-full rounded-md bg-slate-300" />

        <div className="mt-5 flex flex-wrap gap-3">
          <div className="h-7 w-52 rounded-full bg-slate-300" />
          <div className="h-7 w-28 rounded-full bg-slate-300" />
          <div className="h-7 w-20 rounded-full bg-slate-300" />
        </div>
      </section>

      {/* ================= QUESTIONS ================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="animate-pulse">
            <div className="h-6 w-40 rounded-md bg-slate-200" />

            <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px] animate-pulse">
            {/* Header */}
            <div className="grid grid-cols-[60px_1fr_170px] gap-5 bg-slate-50 px-5 py-4">
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
            </div>

            {/* Rows */}
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-[60px_1fr_170px] gap-5 border-t border-slate-100 px-5 py-5"
              >
                {/* Number */}
                <div className="h-4 w-6 rounded bg-slate-100" />

                {/* Question */}
                <div>
                  <div className="h-5 w-full max-w-xl rounded bg-slate-200" />

                  <div className="mt-3 space-y-2">
                    <div className="h-8 w-3/4 max-w-md rounded-lg bg-slate-100" />
                    <div className="h-8 w-2/3 max-w-sm rounded-lg bg-slate-100" />
                    <div className="h-8 w-4/5 max-w-lg rounded-lg bg-slate-100" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-full rounded-xl bg-slate-100" />
                  <div className="h-10 w-full rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="size-3 rounded bg-slate-200" />
            <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
          </div>
        </div>

        {/* Back */}
        <div className="border-t border-slate-200 px-5 py-5 sm:px-6">
          <div className="h-11 w-40 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </section>
    </>
  );
}
