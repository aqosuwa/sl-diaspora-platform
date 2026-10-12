import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import { PageHead, fmt } from "./ui";

export default function MasterOverview() {
  const { state, currentStaff, can } = useApp();
  const members = state.members.filter((m) => m.status !== "removed");
  const pendingIds = members.filter((m) => m.verificationStatus === "pending").length;
  const flagged = (state.chatMessages || []).filter((m) => m.flagged && m.modStatus === "open").length;
  const reports = (state.reports || []).filter((r) => r.status === "open").length;
  const suspended = members.filter((m) => m.status === "suspended").length;

  const tiles = [
    { key: "ids", to: "/master/ids", label: "IDs awaiting review", value: pendingIds, warn: pendingIds > 0 },
    { key: "chats", to: "/master/chats", label: "Flagged chat messages", value: flagged, warn: flagged > 0 },
    { key: "reports", to: "/master/reports", label: "Open reports", value: reports, warn: reports > 0 },
    { key: "members", to: "/master/members", label: "Active members", value: members.filter((m) => m.status !== "suspended").length, hint: `${suspended} suspended` },
  ].filter((t) => can(t.key));

  return (
    <div>
      <PageHead title={`Welcome, ${currentStaff.name.split(" ")[0]}`} sub={`${currentStaff.role}. Here is what needs attention.`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.key} to={t.to}>
            <Card className="h-full transition hover:shadow-lift">
              <div className={`font-display text-3xl font-extrabold ${t.warn ? "text-gold-dark" : "text-green-dark"}`}>{t.value}</div>
              <div className="mt-1 text-sm font-semibold text-charcoal">{t.label}</div>
              {t.hint && <div className="text-xs text-muted">{t.hint}</div>}
            </Card>
          </Link>
        ))}
      </div>

      {can("audit") && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Recent activity</h2>
            <Link to="/master/audit" className="text-sm font-semibold text-green hover:underline">View full log</Link>
          </div>
          {(state.auditLog || []).length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing yet. Every admin action will be recorded here.</p>
          ) : (
            <ul className="mt-3 divide-y divide-green-dark/10">
              {state.auditLog.slice(0, 6).map((a) => (
                <li key={a.id} className="py-2.5 text-sm">
                  <span className="font-semibold text-charcoal">{a.actor}</span> <span className="text-charcoal/80">{a.action}</span>
                  <div className="text-xs text-muted">{fmt(a.at)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
      {state.session.isAdmin && (
        <p className="mt-6 text-sm text-muted">
          Need the consular desk? <Link to="/admin" className="font-semibold text-green hover:underline">Open the Commission desk</Link>.
        </p>
      )}
    </div>
  );
}
