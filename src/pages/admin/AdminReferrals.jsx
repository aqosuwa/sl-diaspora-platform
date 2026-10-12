import { useState } from "react";
import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";
import { Field, Select } from "../../components/FormField";

export default function AdminReferrals() {
  const { state, actions } = useApp();
  const [matching, setMatching] = useState(null);
  const [proId, setProId] = useState("");

  function memberFor(id) {
    return state.members.find((m) => m.id === id);
  }

  function openMatch(r) {
    setMatching(r);
    const candidates = state.professionals.filter(
      (p) =>
        p.category === r.category &&
        p.verificationStatus === "verified" &&
        (!r.country || p.country === r.country)
    );
    setProId(candidates[0]?.id || "");
  }

  function handleMatch(e) {
    e.preventDefault();
    if (!proId) return;
    actions.matchReferral(matching.id, proId);
    setMatching(null);
  }

  const referrals = [...state.referrals].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );
  const candidates = matching
    ? state.professionals.filter(
        (p) =>
          p.category === matching.category &&
          p.verificationStatus === "verified" &&
          (!matching.country || p.country === matching.country)
      )
    : [];

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-charcoal">Referral Management</h1>
        <p className="mt-1 text-sm text-muted">
          Confidential — only visible to Commission caseworkers. Match members to verified professionals.
        </p>

        <div className="mt-6 space-y-3">
          {referrals.length === 0 ? (
            <EmptyState title="No referral requests" />
          ) : (
            referrals.map((r) => {
              const member = memberFor(r.memberId);
              const pro = r.matchedProfessionalId
                ? state.professionals.find((p) => p.id === r.matchedProfessionalId)
                : null;
              return (
                <Card key={r.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-charcoal">
                        {member?.fullName || "Unknown"} — {r.category}
                      </div>
                      <div className="text-xs text-muted">{r.country}</div>
                      <div className="mt-1 text-xs text-muted">"{r.description}"</div>
                      {pro && (
                        <div className="mt-1 text-xs text-green">
                          Matched to {pro.fullName} ({pro.firm}, {pro.city})
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={r.status} />
                      {r.status !== "Closed" && r.status !== "Withdrawn" && (
                        <>
                          <button
                            onClick={() => openMatch(r)}
                            className="rounded-full bg-blue px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-dark"
                          >
                            {pro ? "Rematch" : "Match"}
                          </button>
                          <button
                            onClick={() => actions.closeReferral(r.id)}
                            className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-black/5"
                          >
                            Close
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <Modal open={!!matching} onClose={() => setMatching(null)} title="Match to Professional">
        {candidates.length === 0 ? (
          <p className="text-sm text-muted">
            No verified professionals available in this category yet.
          </p>
        ) : (
          <form onSubmit={handleMatch} className="space-y-4">
            <Field label="Verified professional">
              <Select value={proId} onChange={(e) => setProId(e.target.value)}>
                {candidates.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} — {p.firm} ({p.city}, {p.country})
                  </option>
                ))}
              </Select>
            </Field>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
            >
              Confirm Match
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
