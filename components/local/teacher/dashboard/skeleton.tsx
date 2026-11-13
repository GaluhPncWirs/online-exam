export default function DashboardSkeletonTeacher() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Dashboard */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 p-6 shadow-sm sm:p-8">
        <div className="relative z-10">
          {/* Dashboard Title */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-3">
              <div className="h-3 w-32 rounded bg-slate-300" />
              <div className="h-8 w-52 rounded-lg bg-slate-300 sm:w-64" />
            </div>

            {/* Inform Exams */}
            <div className="h-10 w-36 rounded-xl bg-slate-300" />
          </div>

          {/* Welcome */}
          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Profile */}
            <div className="size-20 shrink-0 rounded-full border-4 border-white/50 bg-slate-300 sm:size-28" />

            {/* Greeting */}
            <div className="flex-1 space-y-3">
              <div className="h-4 w-36 rounded bg-slate-300" />
              <div className="h-8 w-48 rounded-lg bg-slate-300 sm:w-64" />
              <div className="space-y-2">
                <div className="h-3 w-full max-w-xl rounded bg-slate-300" />
                <div className="h-3 w-4/5 max-w-md rounded bg-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="space-y-8">
        {/* Statistics */}
        <section>
          <div className="mb-5 space-y-3">
            <div className="h-3 w-36 rounded bg-slate-200" />
            <div className="h-7 w-64 rounded-lg bg-slate-200" />
            <div className="h-4 w-full max-w-lg rounded bg-slate-200" />
          </div>

          {/* Statistic Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                    <div className="h-9 w-20 rounded-lg bg-slate-200" />
                    <div className="h-3 w-36 rounded bg-slate-200" />
                  </div>

                  <div className="size-12 rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Action */}
        <section>
          <div className="mb-4 space-y-3">
            <div className="h-6 w-40 rounded-lg bg-slate-200" />
            <div className="h-4 w-full max-w-md rounded bg-slate-200" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 p-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3"
                  >
                    <div className="size-9 rounded-lg bg-slate-200" />
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content / Exam Table */}
        <section>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Table Header */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="space-y-3">
                <div className="h-3 w-20 rounded bg-slate-200" />
                <div className="h-6 w-56 rounded-lg bg-slate-200" />
                <div className="h-4 w-full max-w-md rounded bg-slate-200" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto p-4 sm:p-5">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    {[12, 32, 20, 32, 24].map((width, index) => (
                      <th key={index} className="px-4 py-4 text-left">
                        <div
                          className="h-4 rounded bg-slate-200"
                          style={{ width: `${width}px` }}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="border-b border-slate-100">
                      {[12, 32, 20, 32, 24].map((width, index) => (
                        <td key={index} className="px-4 py-5">
                          <div
                            className="h-4 rounded bg-slate-200"
                            style={{
                              width: `${width + (index === 1 ? 70 : 0)}px`,
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-5 flex justify-between">
                <div className="h-8 w-28 rounded-lg bg-slate-200" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="size-8 rounded-lg bg-slate-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
