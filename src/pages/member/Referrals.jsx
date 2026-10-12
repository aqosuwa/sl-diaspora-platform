import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { REFERRAL_CATEGORIES, COUNTRIES } from "../../data/seed";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import Icon from "../../components/Icon";
import { Field, Select, Textarea } from "../../components/FormField";

export default function Referrals() {
  const { state, actions, currentMember } = useApp();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(REFERRAL_CATEGORIES[0]);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [description, setDescription] = useState("");

  const myReferrals = state.referrals
    .filter((r) => r.memberId === currentMember.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  function professionalFor(id) {
    return state.professionals.find((p) => p.id === id);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return;
    actions.submitReferral(currentMember.id, { category, country, description });
    setDescription("");
    setCategory(REFERRAL_CATEGORIES[0]);
    setCountry(COUNTRIES[0]);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Confidential Referrals</h1>
          <p className="mt-1 text-sm text-muted">
            Request a trusted, verified professional. Visible only to you and Commission caseworkers.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn-primary"
        >
          + New Request
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2.5 rounded-lg bg-blue/10 px-4 py-3 text-sm text-blue-dark">
        <Icon name="lock" size={16} />
        Your referral requests are confidential. Other members never see them.
      </div>

      <div className="mt-6 space-y-4">
        {myReferrals.length === 0 ? (
          <EmptyState
            title="No referral requests yet"
            body="Need an immigration lawyer, GP, accountant, or therapist? Request a confidential match."
            action={
              <button
                onClick={() => setOpen(true)}
                className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-dark"
              >
                Request a referral
              </button>
            }
          />
        ) : (
          myReferrals.map((r) => {
            const pro = r.matchedProfessionalId ? professionalFor(r.matchedProfessionalId) : null;
            return (
              <Card key={r.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal">{r.category}</h3>
                    <p className="text-xs text-muted">
                      {r.country ? `${r.country} · ` : ""}Submitted{" "}
                      {new Date(r.submittedAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={r.status} />
                    {r.status !== "Withdrawn" && r.status !== "Closed" && (
                      <button
                        onClick={() => actions.withdrawReferral(r.id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted">"{r.description}"</p>

                {pro && (
                  <div className="mt-3 rounded-lg border border-green/20 bg-green-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green">
                      Matched Professional
                    </p>
                    <p className="mt-1 text-sm font-medium text-charcoal">{pro.fullName}</p>
                    <p className="text-xs text-muted">
                      {pro.firm} · {pro.city}, {pro.country}
                    </p>
                  </div>
                )}

                <div className="mt-4 border-t border-black/5 pt-3">
                  <ol className="space-y-2">
                    {r.timeline.map((t, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue" />
                        <div>
                          <div className="font-medium text-charcoal">{t.status}</div>
                          <div className="text-xs text-muted">
                            {new Date(t.at).toLocaleDateString("en-GB")} — {t.note}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Confidential Referral">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="What kind of professional do you need?">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {REFERRAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Where do you need them?" hint="UK-based professionals, or professionals in Sierra Leone for matters back home.">
            <Select value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Briefly describe your situation" hint="Only caseworkers will see this.">
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. I need help understanding my visa renewal options..."
            />
          </Field>
          <button
            type="submit"
            className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-dark"
          >
            Submit Confidentially
          </button>
        </form>
      </Modal>
    </div>
  );
}
