import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Icon from "../../components/Icon";
import { routeForQuery } from "../../lib/search";

const SERVICES = [
  {
    title: "Consular services",
    body: "Apply for a new passport, renew a passport or National ID card, apply for a visa, or request an emergency travel certificate — and pay securely online by Orange Money, Afrimoney, card or bank transfer — then track every step.",
    icon: "passport",
    to: "/consular",
  },
  {
    title: "Confidential referrals",
    body: "Request a trusted, verified immigration lawyer, GP, accountant, or therapist in the UK or in Sierra Leone, handled privately by caseworkers.",
    icon: "shieldCheck",
    to: "/referrals",
  },
  {
    title: "Jobs board",
    body: "Browse vetted job listings across the UK, apply in a click, or post an opening for your own business.",
    icon: "briefcase",
    to: "/jobs",
  },
  {
    title: "Business directory",
    body: "Discover and list Sierra Leonean-owned businesses across the UK — restaurants, services, and retail.",
    icon: "storefront",
    to: "/businesses",
  },
  {
    title: "Events & news",
    body: "Community events and celebrations in the UK and back home in Sierra Leone, plus Commission announcements.",
    icon: "calendar",
    to: "/events",
  },
  {
    title: "Youth connection",
    body: "A community board and youth events where second-generation diaspora members connect, ask for mentorship, and share culture and language.",
    icon: "leaf",
    to: "/youth",
  },
];

const POPULAR = [
  { label: "Renew a passport", to: "/consular" },
  { label: "Renew a National ID card", to: "/consular" },
  { label: "Track an application", to: "/consular" },
  { label: "Request a referral", to: "/referrals" },
  { label: "Browse jobs", to: "/jobs" },
  { label: "Register an account", to: "/register" },
  { label: "Commission staff login", to: "/admin/login" },
];

export default function Landing() {
  const { currentMember, state } = useApp();
  const isAdmin = state.session.isAdmin;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState("member");

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(routeForQuery(query));
  }

  return (
    <div>
      <section className="border-b border-black/10 bg-sand">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h1 className="font-sans text-3xl font-extrabold leading-tight text-ink sm:text-[2.6rem]">
            The best place to manage your life in the UK and back home
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mute">
            Consular services, trusted professional referrals, jobs, businesses, and
            community — brought together by the Sierra Leone High Commission, UK.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-7 flex max-w-lg">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, e.g. “renew passport”"
              className="min-w-0 flex-1 border-2 border-r-0 border-ink bg-white px-4 py-3 text-sm text-ink outline-none"
            />
            <button type="submit" className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap border-2 border-ink bg-ink px-4 text-sm font-semibold text-white hover:bg-black sm:px-5">
              <Icon name="search" size={16} />
              Search
            </button>
          </form>

          <div className="mx-auto mt-6 inline-flex rounded-sm border border-black/15 bg-white p-0.5 text-sm">
            <button
              onClick={() => setAudience("member")}
              className={`px-4 py-1.5 font-medium transition ${audience === "member" ? "bg-green text-white" : "text-ink/70"}`}
            >
              I'm a member
            </button>
            <button
              onClick={() => setAudience("business")}
              className={`px-4 py-1.5 font-medium transition ${audience === "business" ? "bg-green text-white" : "text-ink/70"}`}
            >
              I run a business
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!currentMember && !isAdmin && audience === "member" && (
              <>
                <Link to="/register" className="btn-primary">Join the platform</Link>
                <Link to="/login" className="btn-secondary">I already have an account</Link>
              </>
            )}
            {!currentMember && !isAdmin && audience === "business" && (
              <>
                <Link to="/register" className="btn-primary">Register, then list your business</Link>
                <Link to="/businesses" className="btn-secondary">Browse the directory</Link>
              </>
            )}
            {currentMember && <Link to="/dashboard" className="btn-primary">Go to my dashboard</Link>}
            {isAdmin && <Link to="/admin" className="btn-primary">Go to admin dashboard</Link>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-base font-bold text-ink">Popular on Diaspora Connect</h2>
        <div className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.map((p) => (
            <Link
              key={p.label}
              to={p.to}
              className="flex items-center justify-between border-b border-black/10 py-2.5 text-sm font-medium text-blue hover:underline"
            >
              {p.label}
              <Icon name="arrowRight" size={14} className="flex-shrink-0 text-blue" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-bold text-ink">Services and information</h2>
          <div className="mt-6 grid gap-0 border-t border-l border-black/10 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                to={s.to}
                className="border-b border-r border-black/10 bg-white p-5 transition hover:bg-green-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green">
                  <Icon name={s.icon} size={18} />
                </span>
                <h3 className="mt-3 text-base font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-mute">{s.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10">
        <div className="mx-auto flex max-w-4xl items-start gap-4 px-4 py-10">
          <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-green-50 text-green">
            <Icon name="lock" size={16} />
          </span>
          <div>
            <h2 className="text-base font-bold text-ink">Confidential by design</h2>
            <p className="mt-1 text-sm text-mute">
              Referral requests are only ever visible to you and Commission caseworkers —
              never to other members, employers, or businesses on the platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
