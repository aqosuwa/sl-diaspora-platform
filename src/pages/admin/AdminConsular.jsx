import { useState } from "react";
import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";
import { Field, Select, Textarea } from "../../components/FormField";

const STATUSES = ["Submitted", "Under Review", "Processing", "Completed", "Withdrawn"];

export default function AdminConsular() {
  const { state, actions } = useApp();
  const [activeCase, setActiveCase] = useState(null);
  const [status, setStatus] = useState(STATUSES[0]);
  const [note, setNote] = useState("");

  function memberFor(id) {
    return state.members.find((m) => m.id === id);
  }

  function openUpdate(c) {
    setActiveCase(c);
    setStatus(c.status === "Withdrawn" ? "Submitted" : c.status);
    setNote("");
  }

  function handleUpdate(e) {
    e.preventDefault();
    actions.updateCaseStatus(activeCase.id, status, note);
    setActiveCase(null);
  }

  const cases = [...state.consularCases].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-charcoal">Consular Case Management</h1>
        <p className="mt-1 text-sm text-muted">Review and progress passport, visa, and travel document cases.</p>

        <div className="mt-6 space-y-3">
          {cases.length === 0 ? (
            <EmptyState title="No consular cases submitted" />
          ) : (
            cases.map((c) => {
              const member = memberFor(c.memberId);
              return (
                <Card key={c.id} className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-charcoal">
                      {c.type} — <span className="font-mono">{c.caseRef}</span>
                    </div>
                    <div className="text-xs text-muted">
                      {member?.fullName || "Unknown member"} · Submitted{" "}
                      {new Date(c.submittedAt).toLocaleDateString("en-GB")}
                    </div>
                    {c.details && Object.keys(c.details).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal/80">
                        {Object.entries(c.details)
                          .filter(([, v]) => v !== "" && v !== false)
                          .slice(0, 6)
                          .map(([k, v]) => (
                            <span key={k}>
                              <span className="text-muted">{k}:</span>{" "}
                              <span className="font-medium">{typeof v === "boolean" ? "Yes" : String(v)}</span>
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {c.payment && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-charcoal">£{c.payment.amount.toFixed(2)}</span>
                        <StatusPill status={c.payment.status} />
                        {c.payment.status === "Awaiting confirmation" && (
                          <button
                            onClick={() => actions.confirmPayment(c.id)}
                            className="rounded-lg border border-green px-2.5 py-1 text-xs font-semibold text-green hover:bg-green-50"
                          >
                            Confirm payment
                          </button>
                        )}
                      </div>
                    )}
                    <StatusPill status={c.status} />
                    <button
                      onClick={() => openUpdate(c)}
                      className="rounded-full bg-blue px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-dark"
                    >
                      Update
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <Modal open={!!activeCase} onClose={() => setActiveCase(null)} title={`Update ${activeCase?.caseRef || ""}`}>
        <form onSubmit={handleUpdate} className="space-y-4">
          <Field label="New status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Note for member" hint="Appears on their timeline.">
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
          >
            Update Case
          </button>
        </form>
      </Modal>
    </div>
  );
}
