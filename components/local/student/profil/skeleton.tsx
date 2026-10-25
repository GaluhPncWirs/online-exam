export default function SkeletonProfil() {
  return (
    <div className="space-y-6">
      {/* ================= PROFILE HERO ================= */}
      <section className="overflow-hidden rounded-3xl bg-slate-200 p-6 shadow-sm animate-pulse sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Profile Image */}
          <div className="size-24 shrink-0 rounded-full bg-slate-300 sm:size-28" />

          {/* Identity */}
          <div className="w-full">
            <div className="h-3 w-28 rounded bg-slate-300" />

            <div className="mt-3 h-8 w-64 max-w-full rounded-md bg-slate-300 sm:h-9" />

            <div className="mt-4 flex flex-wrap gap-2">
              <div className="h-7 w-24 rounded-full bg-slate-300" />
              <div className="h-7 w-28 rounded-full bg-slate-300" />
            </div>
          </div>

          {/* Edit Button */}
          <div className="h-11 w-full rounded-xl bg-slate-300 sm:w-32" />
        </div>
      </section>

      {/* ================= ACCOUNT INFORMATION ================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Heading */}
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="size-10 rounded-xl bg-slate-200" />

            <div>
              <div className="h-6 w-40 rounded-md bg-slate-200" />
              <div className="mt-2 h-3 w-56 rounded bg-slate-100" />
            </div>
          </div>
        </div>

        {/* Information Rows */}
        <div className="divide-y divide-slate-100 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-3 sm:px-6"
            >
              <div className="h-4 w-24 rounded bg-slate-200" />

              <div className="h-4 w-52 max-w-full rounded bg-slate-100 sm:col-span-2" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= EXAM STATISTICS ================= */}
      <section>
        {/* Heading */}
        <div className="mb-5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-200" />

            <div>
              <div className="h-6 w-36 rounded-md bg-slate-200" />
              <div className="mt-2 h-3 w-56 rounded bg-slate-100" />
            </div>
          </div>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      {/* ================= EXAM HISTORY ================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Heading */}
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="animate-pulse">
            <div className="h-6 w-36 rounded-md bg-slate-200" />

            <div className="mt-2 h-3 w-64 max-w-full rounded bg-slate-100" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[760px] animate-pulse">
            {/* Table Header */}
            <div className="grid grid-cols-[60px_2fr_1.5fr_1fr_1.2fr] gap-4 bg-slate-50 px-5 py-4">
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[60px_2fr_1.5fr_1fr_1.2fr] gap-4 border-t border-slate-100 px-5 py-5"
              >
                <div className="h-4 w-6 rounded bg-slate-100" />

                <div className="h-4 w-44 rounded bg-slate-100" />

                <div className="h-4 w-32 rounded bg-slate-100" />

                <div className="h-6 w-16 rounded-full bg-slate-100" />

                <div className="h-6 w-24 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
