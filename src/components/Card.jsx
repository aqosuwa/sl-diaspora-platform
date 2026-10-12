export default function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`rounded-xl border border-black/10 bg-white p-5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
