// A small hand-picked line-icon set so the app has one coherent icon
// language instead of emoji. Stroke-based, inherits color via currentColor.

const PATHS = {
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M9.4 15.5c.6-1.4 1.6-2 2.6-2s2 .6 2.6 2" />
      <path d="M8.5 6.5h7" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3.5 5 6v6c0 4.2 3 7 7 8.5 4-1.5 7-4.3 7-8.5V6l-7-2.5Z" />
      <path d="M9 12.2l2 2 4-4.2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="8" width="17" height="11" rx="1.8" />
      <path d="M8.5 8V6.2A1.8 1.8 0 0 1 10.3 4.4h3.4A1.8 1.8 0 0 1 15.5 6.2V8" />
      <path d="M3.5 13h17" />
    </>
  ),
  storefront: (
    <>
      <path d="M4 10 5.3 4.5h13.4L20 10" />
      <path d="M4 10v9.2h16V10" />
      <path d="M4 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s1-1.3 1-3" />
      <path d="M9.5 19.2V14h5v5.2" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="1.8" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" />
      <path d="M8.5 14h1.2M12.4 14h1.2M16.3 14h0" />
    </>
  ),
  leaf: (
    <>
      <path d="M6 18c-2.2-5.4.6-11 8.3-13 2.7 6.9 1 12-4.3 14.3" />
      <path d="M6.3 17.7c1.8-3.6 4.7-6 8.2-7.6" />
    </>
  ),
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.8" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  shield: (
    <path d="M12 3.5 5 6v6c0 4.2 3 7 7 8.5 4-1.5 7-4.3 7-8.5V6l-7-2.5Z" />
  ),
  arrowRight: <path d="M4 12h16M14 6l6 6-6 6" />,
  close: <path d="M5 5l14 14M19 5L5 19" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-5-5" />
    </>
  ),
};

export default function Icon({ name, size = 22, strokeWidth = 1.6, className = "" }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
