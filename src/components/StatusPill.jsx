const STYLES = {
  verified: "bg-green-50 text-green border border-green/20",
  published: "bg-green-50 text-green border border-green/20",
  available: "bg-green-50 text-green border border-green/20",
  matched: "bg-blue/10 text-blue-dark border border-blue/20",
  processing: "bg-blue/10 text-blue-dark border border-blue/20",
  "under review": "bg-blue/10 text-blue-dark border border-blue/20",
  "caseworker review": "bg-blue/10 text-blue-dark border border-blue/20",
  limited: "bg-amber-50 text-amber-700 border border-amber-200",
  paid: "bg-green-50 text-green border border-green/20",
  "awaiting confirmation": "bg-gold/15 text-gold-dark border border-gold/30",
  "refund pending": "bg-slate-100 text-slate-600 border border-slate-200",
  pending: "bg-gold/15 text-gold-dark border border-gold/30",
  submitted: "bg-gold/15 text-gold-dark border border-gold/30",
  closed: "bg-slate-100 text-slate-500 border border-slate-200",
  withdrawn: "bg-slate-100 text-slate-500 border border-slate-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
};

export default function StatusPill({ status }) {
  const key = (status || "").toLowerCase();
  const style = STYLES[key] || "bg-slate-100 text-slate-600 border border-slate-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
