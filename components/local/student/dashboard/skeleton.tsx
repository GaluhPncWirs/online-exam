export default function DashboardSkeletonStudent() {
  return (
    <>
      {/* ==================== HEADER ==================== */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-200 p-6 animate-pulse sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Profile */}
          <div className="size-20 shrink-0 rounded-full bg-slate-300 sm:size-24" />

          {/* Heading */}
          <div className="w-full max-w-xl">
            <div className="h-3 w-28 rounded bg-slate-300" />

            <div className="mt-3 h-8 w-56 rounded-md bg-slate-300 sm:h-9" />

            <div className="mt-3 h-4 w-full max-w-md rounded bg-slate-300" />
            <div className="mt-2 h-4 w-3/4 max-w-sm rounded bg-slate-300" />
          </div>
        </div>
      </section>

      {/* ==================== SUMMARY ==================== */}
      <section className="mt-8">
        {/* Heading */}
        <div>
          <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />

          <div className="mt-2 h-7 w-48 rounded-md bg-slate-200 animate-pulse" />

          <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-100 animate-pulse" />
        </div>

        {/* Statistic Cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between animate-pulse">
                <div className="w-full">
                  <div className="h-4 w-32 rounded bg-slate-200" />

                  <div className="mt-3 h-9 w-16 rounded-md bg-slate-200" />

                  <div className="mt-2 h-3 w-44 rounded bg-slate-100" />
                </div>

                <div className="size-12 shrink-0 rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== DEADLINE ==================== */}
      <section className="mt-8">
        <div className="mb-4 animate-pulse">
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="mt-2 h-7 w-60 rounded-md bg-slate-200" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4 animate-pulse">
              <div className="size-12 shrink-0 rounded-xl bg-slate-200" />

              <div className="w-full">
                <div className="h-3 w-28 rounded bg-slate-100" />

                <div className="mt-2 h-6 w-60 max-w-full rounded-md bg-slate-200" />

                <div className="mt-2 h-4 w-44 rounded bg-slate-100" />
              </div>
            </div>

            <div className="h-11 w-full rounded-xl bg-slate-200 animate-pulse sm:w-32" />
          </div>
        </div>
      </section>

      {/* ==================== AVAILABLE EXAMS ==================== */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-6 w-40 rounded-md bg-slate-200" />
              <div className="mt-2 h-3 w-64 max-w-full rounded bg-slate-100" />
            </div>

            <div className="hidden h-7 w-20 rounded-full bg-slate-100 animate-pulse sm:block" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-190 animate-pulse">
            {/* Table Header */}
            <div className="grid grid-cols-[60px_2fr_1.5fr_1.5fr_1.2fr] gap-4 bg-slate-50 px-5 py-4">
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
            </div>

            {/* Rows */}
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-[60px_2fr_1.5fr_1.5fr_1.2fr] gap-4 border-t border-slate-100 px-5 py-5"
              >
                <div className="h-4 w-6 rounded bg-slate-100" />
                <div className="h-4 w-40 rounded bg-slate-100" />
                <div className="h-4 w-28 rounded bg-slate-100" />
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-6 w-24 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== RECENT SCORES ==================== */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="animate-pulse">
            <div className="h-6 w-36 rounded-md bg-slate-200" />
            <div className="mt-2 h-3 w-72 max-w-full rounded bg-slate-100" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-162.5 animate-pulse">
            {/* Table Header */}
            <div className="grid grid-cols-[60px_2fr_1.5fr_1fr] gap-4 bg-slate-50 px-5 py-4">
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
            </div>

            {/* Rows */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[60px_2fr_1.5fr_1fr] gap-4 border-t border-slate-100 px-5 py-5"
              >
                <div className="h-4 w-6 rounded bg-slate-100" />

                <div className="h-4 w-44 rounded bg-slate-100" />

                <div className="h-4 w-32 rounded bg-slate-100" />

                <div className="h-6 w-20 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
