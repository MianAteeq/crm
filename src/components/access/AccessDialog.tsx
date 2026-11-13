import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:bg-slate-50";
export const primaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed";
export const secondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50";

export default function AccessDialog({
  title,
  children,
  onClose,
  busy = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="access-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <h2 id="access-dialog-title" className="text-lg font-bold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close dialog"
          disabled={busy}
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
