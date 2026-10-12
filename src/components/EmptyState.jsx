export default function EmptyState({ title, body, action }) {
  return (
    <div className="rounded-2xl border-[1.5px] border-dashed border-green-dark/15 bg-white/60 px-6 py-12 text-center">
      <p className="font-serif text-lg font-semibold text-charcoal">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
