import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";

const FILTERS = ["All", "United Kingdom", "Sierra Leone"];

export default function Events() {
  const { state } = useApp();
  const [countryFilter, setCountryFilter] = useState("All");

  const events = useMemo(
    () =>
      [...state.events]
        .filter((e) => countryFilter === "All" || e.country === countryFilter)
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [state.events, countryFilter]
  );
  const news = [...state.news].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-2xl font-bold text-charcoal">Events & News</h1>
      <p className="mt-1 text-sm text-muted">
        Community events in the UK and back home in Sierra Leone, plus Commission announcements.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-lg font-semibold text-charcoal">Upcoming Events</h2>
            <div className="flex gap-1 rounded-lg bg-black/5 p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setCountryFilter(f)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    countryFilter === f ? "bg-white text-green shadow-sm" : "text-muted hover:text-charcoal"
                  }`}
                >
                  {f === "United Kingdom" ? "UK" : f}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {events.length === 0 ? (
              <EmptyState title="No events scheduled" body="Try a different filter." />
            ) : (
              events.map((e) => (
                <Card key={e.id} className="flex gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-green-50 text-green">
                    <span className="text-xs font-semibold uppercase">
                      {new Date(e.date).toLocaleDateString("en-GB", { month: "short" })}
                    </span>
                    <span className="font-serif text-lg font-bold leading-none">
                      {new Date(e.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-base font-semibold text-charcoal">{e.title}</h3>
                      <span
                        className={`flex-shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          e.country === "Sierra Leone"
                            ? "bg-gold/15 text-gold-dark"
                            : "bg-blue/10 text-blue-dark"
                        }`}
                      >
                        {e.country === "Sierra Leone" ? "Sierra Leone" : "UK"}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      {e.city} · {e.category}
                    </p>
                    <p className="mt-1 text-sm text-charcoal/80">{e.description}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Commission News</h2>
          <div className="mt-4 space-y-4">
            {news.length === 0 ? (
              <EmptyState title="No news items" />
            ) : (
              news.map((n) => (
                <Card key={n.id}>
                  <p className="text-xs text-muted">
                    {new Date(n.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-1 font-serif text-base font-semibold text-charcoal">{n.title}</h3>
                  <p className="mt-1 text-sm text-charcoal/80">{n.excerpt}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
