import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { SECTIONS } from "../../data/master";
import Icon from "../../components/Icon";

export default function MasterLayout() {
  const { currentStaff, can, state } = useApp();
  const { pathname } = useLocation();
  if (!currentStaff) return <Navigate to="/master/login" replace />;

  const allowed = SECTIONS.filter((s) => can(s.key));
  const here = [...SECTIONS].reverse().find((s) => pathname === s.to || pathname.startsWith(s.to + "/"));
  if (here && !can(here.key)) return <Navigate to={allowed[0]?.to || "/master/login"} replace />;

  const openChats = (state.chatMessages || []).filter((m) => m.flagged && m.modStatus === "open").length;
  const openReports = (state.reports || []).filter((r) => r.status === "open").length;
  const pendingIds = state.members.filter((m) => m.verificationStatus === "pending" && m.status !== "removed").length;
  const badge = { chats: openChats, reports: openReports, ids: pendingIds };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-0 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8 lg:py-8">
      <aside className="mb-5 min-w-0 lg:mb-0">
        <div className="hidden rounded-2xl bg-green-dark p-4 text-white lg:block">
          <p className="text-xs text-white/60">Signed in as</p>
          <p className="font-display font-bold">{currentStaff.name}</p>
          <p className="text-xs text-gold">{currentStaff.role}</p>
        </div>
        <nav
          aria-label="Master admin"
          className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] lg:mt-3 lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {allowed.map((s) => (
            <NavLink
              key={s.key}
              to={s.to}
              end={s.to === "/master"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition lg:rounded-xl ${
                  isActive ? "bg-green text-white shadow-card" : "bg-white text-charcoal/75 ring-1 ring-green-dark/[0.08] hover:bg-green-50 lg:bg-transparent lg:ring-0"
                }`
              }
            >
              <Icon name={s.icon} size={17} />
              <span>{s.label}</span>
              {badge[s.key] > 0 && (
                <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-green-dark">{badge[s.key]}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
