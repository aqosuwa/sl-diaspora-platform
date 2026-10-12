import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Icon from "../../components/Icon";
import { routeForQuery } from "../../lib/search";
import { CASE_TYPES } from "../../data/formSchemas";
import { FEES, PAYMENT_METHODS, gbp } from "../../data/payments";

const STEPS = [
  { title: "Apply", body: "Fill in the form once. We tell you which documents to bring and check the details before you submit." },
  { title: "Pay", body: "Pay the fee by card, Orange Money, Afrimoney or bank transfer, and get a receipt straight away." },
  { title: "Track", body: "Follow your application from review to issue, with an update at every step." },
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

function Tile({ to, icon, title, body, className = "", tone = "light", children }) {
  const tones = {
    light: "bg-white text-ink ring-1 ring-green-dark/[0.06] hover:shadow-lift",
    dark: "bg-gradient-to-br from-green to-green-dark text-white hover:shadow-lift",
    gold: "bg-gold/25 text-ink ring-1 ring-gold/40 hover:shadow-lift",
    blue: "bg-blue text-white hover:shadow-lift",
  };
  const iconTone = {
    light: "bg-green-50 text-green",
    dark: "bg-white/12 text-gold",
    gold: "bg-white/70 text-green",
    blue: "bg-white/15 text-white",
  };
  return (
    <Link
      to={to}
      className={`group flex flex-col rounded-3xl p-6 shadow-card transition duration-200 hover:-translate-y-0.5 ${tones[tone]} ${className}`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconTone[tone]}`}>
        <Icon name={icon} size={21} />
      </span>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${tone === "light" || tone === "gold" ? "text-muted" : "text-white/80"}`}>
        {body}
      </p>
      {children}
      <span className={`mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold ${tone === "light" ? "text-green" : tone === "gold" ? "text-green-dark" : "text-gold"}`}>
        Open
        <Icon name="arrowRight" size={14} className="transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

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
      {/* ---------- Hero ---------- */}
      <section className="hero-bg text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <h1 className="text-[2.35rem] leading-[1.04] sm:text-[3.4rem]">
              Passports, ID cards and visas, without the trip to the High Commission.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Apply online, pay by card or mobile money, and follow every step. Find trusted
              doctors and lawyers in confidence, plus jobs and events in the UK and Sierra Leone.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-xl rounded-full bg-white p-1.5 shadow-lift">
              <label className="flex min-w-0 flex-1 items-center gap-2 pl-4">
                <span className="text-muted"><Icon name="search" size={17} /></span>
                <span className="sr-only">Search services</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services, e.g. “renew passport”"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-ink outline-none placeholder:text-muted/70"
                />
              </label>
              <button type="submit" className="flex-shrink-0 whitespace-nowrap rounded-full bg-green px-5 text-sm font-semibold text-white transition hover:bg-green-dark">
                Search
              </button>
            </form>

            <div className="mt-6 inline-flex rounded-full bg-white/10 p-1 text-sm ring-1 ring-white/15">
              <button
                onClick={() => setAudience("member")}
                className={`rounded-full px-4 py-1.5 font-semibold transition ${audience === "member" ? "bg-white text-green-dark" : "text-white/80 hover:text-white"}`}
              >
                I'm a member
              </button>
              <button
                onClick={() => setAudience("business")}
                className={`rounded-full px-4 py-1.5 font-semibold transition ${audience === "business" ? "bg-white text-green-dark" : "text-white/80 hover:text-white"}`}
              >
                I run a business
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {!currentMember && !isAdmin && audience === "member" && (
                <>
                  <Link to="/register" className="btn-gold">Join the platform</Link>
                  <Link to="/login" className="btn-outline-light">I already have an account</Link>
                </>
              )}
              {!currentMember && !isAdmin && audience === "business" && (
                <>
                  <Link to="/register" className="btn-gold">Register, then list your business</Link>
                  <Link to="/businesses" className="btn-outline-light">Browse the directory</Link>
                </>
              )}
              {currentMember && <Link to="/dashboard" className="btn-gold">Go to my dashboard</Link>}
              {isAdmin && <Link to="/admin" className="btn-gold">Go to admin dashboard</Link>}
            </div>
          </div>

          {/* Launcher: the one memorable element */}
          <div className="glass rounded-[1.75rem] p-5 text-ink sm:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl">Start an application</h2>
              <span className="text-xs font-semibold text-muted">Fees in GBP</span>
            </div>
            <ul className="mt-4 divide-y divide-green-dark/10">
              {CASE_TYPES.map((t) => (
                <li key={t}>
                  <Link
                    to="/consular"
                    className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-3.5 transition hover:bg-green-50"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-50 text-green">
                      <Icon name="passport" size={19} />
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug">{t}</span>
                    <span className="font-display text-lg font-bold text-green-dark">{gbp(FEES[t])}</span>
                    <Icon name="arrowRight" size={15} className="text-green transition group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-cream px-3.5 py-3 text-xs font-medium text-muted">
              <span className="flex flex-shrink-0 gap-1" aria-hidden="true">
                {PAYMENT_METHODS.map((m) => (
                  <span key={m.id} className="h-3.5 w-3.5 rounded-full" style={{ background: m.color }} />
                ))}
              </span>
              Pay with Orange Money, Afrimoney, Visa, Mastercard or bank transfer.
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Quick links ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <h2 className="text-lg font-bold">Popular right now</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {POPULAR.map((p) => (
            <Link
              key={p.label}
              to={p.to}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-green-dark shadow-card ring-1 ring-green-dark/[0.07] transition hover:bg-green-50 hover:ring-green/30"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl">Services and information</h2>
          <p className="mt-3 text-muted">Everything the Commission offers the diaspora, on one account.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-6">
          <Tile
            to="/consular"
            tone="dark"
            icon="passport"
            title="Consular services"
            body="Apply for a new passport, renew a passport or National ID card, apply for a visa, or request an emergency travel certificate. Pay online and track every step."
            className="md:col-span-4 md:row-span-1"
          />
          <Tile
            to="/referrals"
            icon="shieldCheck"
            title="Confidential referrals"
            body="Request a verified immigration lawyer, GP, accountant or therapist in the UK or Sierra Leone. Only you and your caseworker see the request."
            className="md:col-span-2"
          />
          <Tile to="/jobs" icon="briefcase" title="Jobs board" body="Vetted listings across the UK. Apply in one click, or post an opening of your own." className="md:col-span-2" />
          <Tile to="/businesses" icon="storefront" title="Business directory" body="Find and list Sierra Leonean-owned restaurants, services and shops across the UK." className="md:col-span-2" />
          <Tile to="/events" icon="calendar" title="Events and news" body="Celebrations, forums and meetups in the UK and in Sierra Leone, plus Commission announcements." className="md:col-span-2" />
          <Tile
            to="/youth"
            tone="gold"
            icon="leaf"
            title="Youth connection"
            body="A community board and events for second-generation members: ask for mentorship, share culture, and learn the language."
            className="md:col-span-6"
          />
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="border-y border-green-dark/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="max-w-xl text-3xl sm:text-4xl">How a consular application works</h2>
          <ol className="mt-9 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-3xl bg-cream p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green font-display text-lg font-bold text-gold">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Confidential ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="hero-bg flex flex-col gap-6 rounded-[2rem] px-7 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/12 text-gold">
              <Icon name="lock" size={22} />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl">Confidential by design</h2>
              <p className="mt-2 max-w-xl text-white/80">
                Referral requests are only ever visible to you and Commission caseworkers, never to
                other members, employers or businesses on the platform.
              </p>
            </div>
          </div>
          <Link to="/referrals" className="btn-gold flex-shrink-0">Request a referral</Link>
        </div>
      </section>
    </div>
  );
}
