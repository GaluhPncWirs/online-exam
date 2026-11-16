export default function ProfileSkeletonTeacher() {
  return (
    <>
      <div className="w-1/3 h-10 bg-slate-500 animate-pulse rounded-md"></div>
      <div className="h-1 bg-slate-500 animate-pulse rounded-md my-3" />
      <div className="mt-7">
        <div className="flex justify-center items-center gap-7 mb-10 flex-col sm:flex-row sm:mb-5">
          <div className="w-28 h-28 rounded-full bg-slate-500 animate-pulse"></div>

          <div className="w-2/3">
            <h1 className="mb-2 bg-slate-500 animate-pulse rounded-md w-2/3 h-7"></h1>
            <p className="bg-slate-500 animate-pulse rounded-md w-1/3 h-5"></p>
          </div>
          <div className="w-20 h-8 bg-slate-500 animate-pulse rounded-md"></div>
        </div>

        <div className="mb-5">
          <div className="flex items-center mb-5 gap-3">
            <div className="w-9 h-7 rounded-md bg-slate-500 animate-pulse"></div>
            <div className="w-1/5 h-7 rounded-md bg-slate-500 animate-pulse"></div>
          </div>
          <div>
            <div className="w-11/12 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
            <div className="w-3/4 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
            <div className="w-10/12 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
            <div className="w-1/2 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
            <div className="w-1/4 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
            <div className="w-1/3 h-7 rounded-md bg-slate-500 animate-pulse"></div>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-5 gap-3">
            <div className="w-9 h-7 rounded-md bg-slate-500 animate-pulse"></div>
            <div className="w-1/3 h-7 rounded-md bg-slate-500 animate-pulse"></div>
          </div>

          <div className="w-full h-7 rounded-md bg-slate-500 animate-pulse mb-3"></div>
          <div className="w-full h-7 rounded-md bg-slate-500 animate-pulse mb-3"></div>
          <div className="w-full h-7 rounded-md bg-slate-500 animate-pulse mb-3"></div>
        </div>
      </div>
    </>
  );
}
