import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";
import { routeForQuery } from "../lib/search";

const memberLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/consular", label: "Consular" },
  { to: "/referrals", label: "Referrals" },
  { to: "/jobs", label: "Jobs" },
  { to: "/businesses", label: "Businesses" },
  { to: "/events", label: "Events" },
  { to: "/community", label: "Community" },
  { to: "/youth", label: "Youth" },
];

const publicLinks = [
  { to: "/consular", label: "Consular services" },
  { to: "/referrals", label: "Referrals" },
  { to: "/jobs", label: "Jobs" },
  { to: "/events", label: "Events" },
];

const linkClass = ({ isActive }) =>
  `tab-link whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition ${
    isActive ? "active bg-green-50 text-green" : "text-ink/70 hover:bg-black/[0.04] hover:text-ink"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `rounded-xl px-3 py-3 text-base font-semibold ${isActive ? "bg-green-50 text-green" : "text-ink/80"}`;

export default function Navbar() {
  const { currentMember, currentStaff, state, actions } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const loggingOut = useRef(false);
  const isStaff = !!currentStaff;
  const isAdmin = state.session.isAdmin || isStaff;

  // Clear the session only after we have actually landed on the homepage,
  // so the route guards on the page we are leaving never redirect to /login.
  function clearSession() {
    if (isStaff) actions.logoutStaff();
    else if (isAdmin) actions.logoutAdmin();
    else actions.logout();
  }

  useEffect(() => {
    if (loggingOut.current && location.pathname === "/") {
      loggingOut.current = false;
      clearSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => setOpen(false), [location.pathname]);

  function handleLogout() {
    if (location.pathname === "/") {
      clearSession();
      return;
    }
    loggingOut.current = true;
    navigate("/");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(routeForQuery(query));
    setQuery("");
  }

  const links = currentMember
    ? memberLinks
    : isStaff
    ? [
        { to: "/master", label: "Master admin" },
        ...(state.session.isAdmin ? [{ to: "/admin", label: "Commission desk" }] : []),
      ]
    : isAdmin
    ? [{ to: "/admin", label: "Commission desk" }]
    : publicLinks;
  const initial = currentMember ? currentMember.fullName.trim()[0] : "A";

  return (
    <header className="sticky top-0 z-40">
      <div className="flag-band">
        <span className="s1" />
        <span className="s2" />
        <span className="s3" />
      </div>
      <div className="border-b border-green-dark/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 flex-shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dark text-gold shadow-card">
              <Icon name="shield" size={19} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block whitespace-nowrap font-display text-[17px] font-extrabold tracking-tight text-green-dark">
                Diaspora Connect
              </span>
              <span className="hidden whitespace-nowrap text-[11px] font-medium text-muted min-[430px]:block">
                Sierra Leone High Commission, UK
              </span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/admin" || l.to === "/master"} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden min-[1360px]:flex">
              <label className="relative">
                <span className="sr-only">Search services</span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="search" size={14} />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services"
                  className="w-44 rounded-full border-[1.5px] border-green-dark/10 bg-cream py-2 pl-9 pr-3 text-sm outline-none transition focus:w-56 focus:border-green focus:bg-white"
                />
              </label>
            </form>

            {currentMember && (
              <Link
                to="/profile"
                className="hidden items-center gap-2 whitespace-nowrap rounded-full py-1 pl-1 pr-3 text-sm font-semibold text-ink hover:bg-black/[0.04] sm:flex"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-green-dark">
                  {initial}
                </span>
                {currentMember.fullName.split(" ")[0]}
              </Link>
            )}
            {(currentMember || isAdmin) && (
              <button
                onClick={handleLogout}
                className="whitespace-nowrap rounded-full border-[1.5px] border-green-dark/15 px-4 py-2 text-sm font-semibold text-green-dark transition hover:border-green hover:bg-green-50"
              >
                <span>Log out<span className="hidden sm:inline">{isAdmin ? " of staff" : ""}</span></span>
              </button>
            )}
            {!currentMember && !isAdmin && (
              <>
                <Link to="/login" className="hidden px-3 py-2 text-sm font-semibold text-ink/80 hover:text-green sm:inline">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="whitespace-nowrap rounded-full bg-green px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-green-dark"
                >
                  Register
                </Link>
              </>
            )}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={open}
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-5 bg-green-dark transition ${open ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-green-dark transition ${open ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-green-dark transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-green-dark/10 bg-white px-4 pb-5 pt-3 lg:hidden">
            <form onSubmit={handleSearch} className="mb-3 flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services"
                className="w-full rounded-full border-[1.5px] border-green-dark/10 bg-cream px-4 py-2.5 text-sm outline-none focus:border-green"
              />
              <button type="submit" aria-label="Search" className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green text-white">
                <Icon name="search" size={15} />
              </button>
            </form>
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.to === "/admin" || l.to === "/master"} className={mobileLinkClass}>
                  {l.label}
                </NavLink>
              ))}
              {currentMember && (
                <NavLink to="/profile" className={mobileLinkClass}>
                  My profile
                </NavLink>
              )}
              {!currentMember && !isAdmin && (
                <>
                  <NavLink to="/login" className={mobileLinkClass}>Log in</NavLink>
                  <NavLink to="/register" className={mobileLinkClass}>Register</NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
