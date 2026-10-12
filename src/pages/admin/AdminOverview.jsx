import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";
import Card from "../../components/Card";

export default function AdminOverview() {
  const { state } = useApp();

  const pendingMembers = state.members.filter((m) => m.verificationStatus === "pending").length;
  const pendingPros = state.professionals.filter((p) => p.verificationStatus === "pending").length;
  const openCases = state.consularCases.filter(
    (c) => !["Withdrawn", "Completed"].includes(c.status)
  ).length;
  const openReferrals = state.referrals.filter(
    (r) => !["Withdrawn", "Closed"].includes(r.status)
  ).length;
  const feesCollected = state.consularCases.reduce(
    (sum, c) => sum + (c.payment && c.payment.status === "Paid" ? c.payment.amount : 0),
    0
  );
  const pendingJobs = state.jobs.filter((j) => j.status === "pending").length;
  const pendingBiz = state.businesses.filter((b) => b.status === "pending").length;

  const tiles = [
    { to: "/admin/verification", label: "Pending Verifications", value: pendingMembers + pendingPros, tone: "gold" },
    { to: "/admin/consular", label: "Open Consular Cases", value: openCases, tone: "blue" },
    { to: "/admin/referrals", label: "Active Referrals", value: openReferrals, tone: "blue" },
    { to: "/admin/listings", label: "Listings Awaiting Review", value: pendingJobs + pendingBiz, tone: "gold" },
  ];

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-charcoal">Commission Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          {state.members.length} members · {state.professionals.length} professionals ·{" "}
          {state.jobs.filter((j) => j.status === "published").length} live jobs ·{" "}
          {state.businesses.filter((b) => b.status === "published").length} live businesses ·{" "}
          £{feesCollected.toFixed(2)} in fees collected
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <Link key={t.label} to={t.to}>
              <Card className="h-full transition hover:shadow-md">
                <div
                  className={`font-serif text-3xl font-bold ${
                    t.value > 0 ? (t.tone === "gold" ? "text-gold-dark" : "text-blue-dark") : "text-charcoal"
                  }`}
                >
                  {t.value}
                </div>
                <div className="mt-1 text-sm font-medium text-charcoal">{t.label}</div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-serif text-lg font-semibold text-charcoal">Recent Members</h2>
            <div className="mt-3 space-y-2">
              {[...state.members]
                .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
                .slice(0, 5)
                .map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal">{m.fullName}</span>
                    <span className="text-xs text-muted">{m.city}</span>
                  </div>
                ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-serif text-lg font-semibold text-charcoal">Recent Consular Activity</h2>
            <div className="mt-3 space-y-2">
              {[...state.consularCases]
                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                .slice(0, 5)
                .map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal">{c.type}</span>
                    <span className="text-xs text-muted">{c.status}</span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
