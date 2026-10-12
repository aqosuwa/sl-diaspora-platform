import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import Icon from "../../components/Icon";

export default function Dashboard() {
  const { state, currentMember } = useApp();
  const myCases = state.consularCases.filter((c) => c.memberId === currentMember.id);
  const myReferrals = state.referrals.filter((r) => r.memberId === currentMember.id);
  const myJobApplications = state.jobs.filter((j) => j.applicants?.includes(currentMember.id));
  const upcomingEvents = state.events.slice(0, 3);

  const tiles = [
    {
      to: "/consular",
      label: "Consular Services",
      value: myCases.length,
      hint: myCases.length ? `${myCases.filter((c) => c.status === "Processing" || c.status === "Submitted" || c.status === "Under Review").length} active` : "No cases yet",
      icon: "passport",
    },
    {
      to: "/referrals",
      label: "Confidential Referrals",
      value: myReferrals.length,
      hint: myReferrals.length ? `${myReferrals.filter((r) => r.status === "Matched").length} matched` : "No referrals yet",
      icon: "shieldCheck",
    },
    {
      to: "/jobs",
      label: "Job Applications",
      value: myJobApplications.length,
      hint: "View the Jobs Board",
      icon: "briefcase",
    },
    {
      to: "/events",
      label: "Upcoming Events",
      value: state.events.length,
      hint: "See what's on",
      icon: "calendar",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">
            Welcome back, {currentMember.fullName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {currentMember.city} · Member since{" "}
            {new Date(currentMember.joinedAt).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <StatusPill status={currentMember.verificationStatus} />
      </div>

      {currentMember.verificationStatus === "pending" && (
        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-charcoal">
          Your account is awaiting verification by Commission staff. You can keep
          using the platform while you wait.
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to}>
            <Card className="h-full transition hover:border-green/30">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green">
                <Icon name={t.icon} size={18} />
              </span>
              <div className="mt-3 font-serif text-2xl font-bold text-charcoal">{t.value}</div>
              <div className="text-sm font-medium text-charcoal">{t.label}</div>
              <div className="mt-1 text-xs text-muted">{t.hint}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-serif text-lg font-semibold text-charcoal">Recent Consular Cases</h2>
          {myCases.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No consular cases submitted yet.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {myCases.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b border-black/5 pb-2 text-sm last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-charcoal">{c.type}</div>
                    <div className="text-xs text-muted">{c.caseRef}</div>
                  </div>
                  <StatusPill status={c.status} />
                </div>
              ))}
            </div>
          )}
          <Link to="/consular" className="mt-4 inline-block text-sm font-medium text-green hover:underline">
            Go to Consular Services →
          </Link>
        </Card>

        <Card>
          <h2 className="font-serif text-lg font-semibold text-charcoal">Upcoming Events</h2>
          <div className="mt-3 space-y-3">
            {upcomingEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b border-black/5 pb-2 text-sm last:border-0 last:pb-0">
                <div>
                  <div className="font-medium text-charcoal">{e.title}</div>
                  <div className="text-xs text-muted">
                    {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {e.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/events" className="mt-4 inline-block text-sm font-medium text-green hover:underline">
            See Events & News →
          </Link>
        </Card>
      </div>
    </div>
  );
}
