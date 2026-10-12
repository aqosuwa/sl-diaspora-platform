import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/verification", label: "Verification" },
  { to: "/admin/consular", label: "Consular Cases" },
  { to: "/admin/referrals", label: "Referrals" },
  { to: "/admin/listings", label: "Jobs & Businesses" },
  { to: "/admin/content", label: "Events & News" },
];

export default function AdminNav() {
  const ref = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const el = ref.current?.querySelector("[aria-current='page']");
    if (el && ref.current) ref.current.scrollLeft = Math.max(0, el.offsetLeft - 16);
  }, [pathname]);
  return (
    <div className="border-b border-black/5 bg-charcoal/[0.02]">
      <div ref={ref} className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/admin"}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive ? "bg-blue text-white" : "text-charcoal/70 hover:bg-black/5"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
