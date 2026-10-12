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
  { to: "/youth", label: "Youth" },
];

const linkClass = ({ isActive }) =>
  `whitespace-nowrap border-b-2 px-2.5 py-3 text-sm font-medium transition ${
    isActive ? "border-green text-green" : "border-transparent text-ink/80 hover:border-black/20"
  }`;

export default function Navbar() {
  const { currentMember, state, actions } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const loggingOut = useRef(false);
  const isAdmin = state.session.isAdmin;

  // Clear the session only after we have actually landed on the homepage,
  // so the route guards on the page we are leaving never redirect to /login.
  function clearSession() {
    if (isAdmin) actions.logoutAdmin();
    else actions.logout();
  }

  useEffect(() => {
    if (loggingOut.current && location.pathname === "/") {
      loggingOut.current = false;
      clearSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="flag-band">
        <span className="s1" />
        <span className="s2" />
        <span className="s3" />
      </div>

      <div className="bg-green-dark text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/40 text-white">
              <Icon name="shield" size={15} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block whitespace-nowrap text-[15px] font-bold">Diaspora Connect</span>
              <span className="hidden whitespace-nowrap text-[11px] text-white/70 min-[430px]:block">
                Sierra Leone High Commission, UK
              </span>
            </span>
          </Link>

          <div className="flex flex-shrink-0 items-center gap-2 text-sm sm:gap-3">
            {currentMember && (
              <>
                <Link to="/profile" className="hidden font-medium hover:underline sm:inline">
                  {currentMember.fullName.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="btn-outline-light whitespace-nowrap px-3 py-1.5 text-xs">
                  Log out
                </button>
              </>
            )}
            {isAdmin && (
              <button onClick={handleLogout} className="btn-outline-light whitespace-nowrap px-3 py-1.5 text-xs">
                <span>Log out<span className="hidden sm:inline"> of admin</span></span>
              </button>
            )}
            {!currentMember && !isAdmin && (
              <>
                <Link to="/login" className="hidden font-medium hover:underline sm:inline">
                  Log in
                </Link>
                <Link to="/register" className="btn-outline-light whitespace-nowrap px-3 py-1.5 text-xs">
                  Register
                </Link>
              </>
            )}
            <button
              className="rounded p-1.5 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu" aria-expanded={open}
            >
              <div className="space-y-1">
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-black/10 lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <nav className="flex items-center gap-1">
            {currentMember &&
              memberLinks.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass}>
                  {l.label}
                </NavLink>
              ))}
            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                Admin dashboard
              </NavLink>
            )}
          </nav>
          <form onSubmit={handleSearch} className="flex items-center gap-1.5 py-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services…"
              className="w-48 border border-black/15 bg-sand px-2.5 py-1.5 text-xs text-ink outline-none focus:border-green"
            />
            <button type="submit" aria-label="Search" className="rounded border border-black/15 p-1.5 hover:bg-black/5">
              <Icon name="search" size={14} />
            </button>
          </form>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 px-4 py-3 lg:hidden">
          <form onSubmit={handleSearch} className="mb-3 flex items-center gap-1.5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services…"
              className="w-full border border-black/15 bg-sand px-2.5 py-2 text-sm text-ink outline-none"
            />
            <button type="submit" className="rounded border border-black/15 p-2">
              <Icon name="search" size={14} />
            </button>
          </form>
          <div className="flex flex-col gap-1">
            {currentMember &&
              memberLinks.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
            {currentMember && (
              <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                My profile
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
                Admin dashboard
              </NavLink>
            )}
            {!currentMember && !isAdmin && (
              <>
                <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                  Log in
                </NavLink>
                <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
