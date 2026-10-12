export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-charcoal">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-xl border-[1.5px] border-green-dark/15 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition placeholder:text-muted/60 hover:border-green-dark/30 focus:border-green focus:ring-4 focus:ring-green/10";

export function Input(props) {
  return <input {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${baseInput} ${props.className || ""}`}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea {...props} className={`${baseInput} ${props.className || ""}`} />;
}
