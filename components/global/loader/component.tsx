import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center text-white">
      <Loader2 className="size-12 animate-spin" />
    </div>
  );
}
