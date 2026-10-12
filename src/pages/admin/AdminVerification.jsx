import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import EmptyState from "../../components/EmptyState";

function ActionButtons({ status, onVerify, onReject }) {
  if (status === "verified")
    return (
      <button onClick={onReject} className="text-xs font-medium text-red-600 hover:underline">
        Revoke
      </button>
    );
  return (
    <div className="flex gap-2">
      <button
        onClick={onVerify}
        className="rounded-lg bg-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-dark"
      >
        Verify
      </button>
      <button
        onClick={onReject}
        className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-black/5"
      >
        Reject
      </button>
    </div>
  );
}

export default function AdminVerification() {
  const { state, actions } = useApp();

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Verification Queue</h1>
        <p className="mt-1 text-sm text-muted">Approve member and professional accounts.</p>

        <div className="mt-8">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Members</h2>
          <div className="mt-3 space-y-3">
            {state.members.length === 0 ? (
              <EmptyState title="No members yet" />
            ) : (
              state.members.map((m) => (
                <Card key={m.id} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-charcoal">{m.fullName}</div>
                    <div className="text-xs text-muted">
                      {m.email} · {m.city} · ID {m.idRef}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={m.verificationStatus} />
                    <ActionButtons
                      status={m.verificationStatus}
                      onVerify={() => actions.setMemberVerification(m.id, "verified")}
                      onReject={() => actions.setMemberVerification(m.id, "rejected")}
                    />
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Professionals</h2>
          <div className="mt-3 space-y-3">
            {state.professionals.map((p) => (
              <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-charcoal">{p.fullName}</div>
                  <div className="text-xs text-muted">
                    {p.category} · {p.firm} · {p.city}, {p.country}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={p.verificationStatus} />
                  <ActionButtons
                    status={p.verificationStatus}
                    onVerify={() => actions.setProfessionalVerification(p.id, "verified")}
                    onReject={() => actions.setProfessionalVerification(p.id, "rejected")}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
