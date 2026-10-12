import Modal from "../../components/Modal";

export function PageHead({ title, sub, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

const TONES = {
  green: "bg-green-50 text-green border-green/20",
  gold: "bg-gold/15 text-gold-dark border-gold/30",
  red: "bg-red-50 text-red-600 border-red-200",
  blue: "bg-blue/10 text-blue-dark border-blue/20",
  grey: "bg-slate-100 text-slate-600 border-slate-200",
};

export function Tag({ tone = "grey", children }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function Confirm({ open, title, body, confirmLabel = "Confirm", danger, onConfirm, onClose, children }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {body && <p className="text-sm text-charcoal">{body}</p>}
      {children}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button onClick={onClose} className="btn-secondary sm:!w-auto">Cancel</button>
        <button
          onClick={onConfirm}
          className={`${danger ? "rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700" : "btn-primary"} sm:!w-auto`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export const smallBtn =
  "rounded-full border-[1.5px] border-green-dark/15 px-3.5 py-1.5 text-xs font-semibold text-green-dark transition hover:border-green hover:bg-green-50";
export const dangerBtn =
  "rounded-full border-[1.5px] border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50";
export const solidBtn =
  "rounded-full bg-green px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-green-dark";

export const fmt = (iso) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
