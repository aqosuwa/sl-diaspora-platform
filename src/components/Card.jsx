export default function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-card ring-1 ring-green-dark/[0.06] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
