import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { CASE_TYPES, CONSULAR_FORM_SCHEMAS } from "../../data/formSchemas";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import Icon from "../../components/Icon";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import PaymentPanel from "../../components/PaymentPanel";
import { FEES, gbp } from "../../data/payments";

function emptyDetailsFor(type) {
  const schema = CONSULAR_FORM_SCHEMAS[type] || [];
  const out = {};
  schema.forEach((f) => {
    out[f.key] = f.type === "checkbox" ? false : "";
  });
  return out;
}

function DynamicField({ field, value, onChange }) {
  if (field.type === "select") {
    return (
      <Field label={field.label} hint={field.hint}>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="" disabled>
            Select…
          </option>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>
    );
  }
  if (field.type === "textarea") {
    return (
      <Field label={field.label} hint={field.hint}>
        <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      </Field>
    );
  }
  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-black/20 text-green focus:ring-green"
        />
        {field.checkboxLabel || field.label}
      </label>
    );
  }
  return (
    <Field label={field.label} hint={field.hint}>
      <Input
        type={field.type === "date" ? "date" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

const FIELD_LABELS = {
  fullName: "Full name",
  dob: "Date of birth",
  placeOfBirth: "Place of birth",
  gender: "Gender",
  fatherName: "Father's name",
  motherName: "Mother's name",
  currentAddress: "Current address",
  contactPhone: "Contact phone",
  oldPassportNumber: "Current passport no.",
  oldPassportExpiry: "Current expiry",
  reasonForRenewal: "Reason",
  passportNumber: "Passport no.",
  visaType: "Visa type",
  travelPurpose: "Purpose of travel",
  intendedArrivalDate: "Arrival date",
  intendedDepartureDate: "Departure date",
  destinationAddress: "Address in Sierra Leone",
  destination: "Destination",
  intendedTravelDate: "Travel date",
  reasonForEmergency: "Reason",
  photoUploaded: "Photo ready",
};

export default function Consular() {
  const { state, actions, currentMember } = useApp();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(CASE_TYPES[0]);
  const [details, setDetails] = useState(emptyDetailsFor(CASE_TYPES[0]));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("details"); // details | payment | done
  const [doneCase, setDoneCase] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const schema = CONSULAR_FORM_SCHEMAS[type] || [];

  const myCases = useMemo(
    () =>
      state.consularCases
        .filter((c) => c.memberId === currentMember.id)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [state.consularCases, currentMember.id]
  );

  function changeType(newType) {
    setType(newType);
    setDetails(emptyDetailsFor(newType));
    setError("");
  }

  function updateField(key, value) {
    setDetails((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const missing = schema.find((f) => f.required && !String(details[f.key] ?? "").trim());
    if (missing) {
      setError(`Please complete "${missing.label}" before submitting.`);
      return;
    }
    setError("");
    setStep("payment");
  }

  function handlePaid(payment) {
    const created = actions.submitConsularCase(currentMember.id, { type, notes, details, payment });
    setDoneCase(created);
    setStep("done");
  }

  function openNew(t) {
    changeType(t || CASE_TYPES[0]);
    setNotes("");
    setStep("details");
    setDoneCase(null);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    if (step === "done") {
      setNotes("");
      changeType(CASE_TYPES[0]);
    }
    setStep("details");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">Consular services</h1>
          <p className="mt-1 text-sm text-mute">
            Apply for a new passport, renew a passport or National ID card, apply for a visa, or request
            an emergency travel certificate — pay online and track every step.
          </p>
        </div>
        <button onClick={() => openNew()} className="btn-primary">
          New application
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CASE_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => openNew(t)}
            className="flex items-center gap-3 rounded-lg border border-black/10 bg-white px-4 py-3 text-left transition hover:border-green/40 hover:bg-green-50"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-green-50 text-green">
              <Icon name="passport" size={18} />
            </span>
            <span className="flex-1 text-sm font-medium text-ink">{t}</span>
            <span className="text-sm font-semibold text-green">{gbp(FEES[t])}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {myCases.length === 0 ? (
          <EmptyState
            title="No applications yet"
            body="Choose an application type above to get started."
          />
        ) : (
          myCases.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink">{c.type}</h3>
                  <p className="text-xs text-mute">
                    Reference <span className="font-mono">{c.caseRef}</span> · Submitted{" "}
                    {new Date(c.submittedAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={c.status} />
                  {c.status !== "Withdrawn" && c.status !== "Completed" && (
                    <button
                      onClick={() => actions.withdrawConsularCase(c.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>

              {c.details && Object.keys(c.details).length > 0 && (
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-lg bg-sand/60 p-3 text-xs sm:grid-cols-3">
                  {Object.entries(c.details)
                    .filter(([, v]) => v !== "" && v !== false)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-mute">{FIELD_LABELS[k] || k}</dt>
                        <dd className="font-medium text-ink">
                          {typeof v === "boolean" ? "Yes" : String(v)}
                        </dd>
                      </div>
                    ))}
                </dl>
              )}
              {c.notes && <p className="mt-2 text-sm text-mute">"{c.notes}"</p>}

              {c.payment && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm">
                  <div>
                    <span className="font-semibold text-ink">{gbp(c.payment.amount)}</span>
                    <span className="text-mute"> · {c.payment.detail || c.payment.methodName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={c.payment.status} />
                    <button
                      onClick={() => setReceipt(c)}
                      className="text-xs font-medium text-blue hover:underline"
                    >
                      View receipt
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 border-t border-black/5 pt-3">
                <ol className="space-y-2">
                  {c.timeline.map((t, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green" />
                      <div>
                        <div className="font-medium text-ink">{t.status}</div>
                        <div className="text-xs text-mute">
                          {new Date(t.at).toLocaleDateString("en-GB")} — {t.note}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={step === "done" ? "Application submitted" : step === "payment" ? "Pay application fee" : type}
        wide
      >
        {step !== "done" && (
          <ol className="mb-4 flex items-center gap-2 text-xs font-semibold">
            <li className={step === "details" ? "text-green" : "text-mute"}>1 Details</li>
            <li className="text-mute">›</li>
            <li className={step === "payment" ? "text-green" : "text-mute"}>2 Payment</li>
          </ol>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Application type">
              <Select value={type} onChange={(e) => changeType(e.target.value)}>
                {CASE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t} — {gbp(FEES[t])}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              {schema.map((f) => (
                <div key={f.key} className={f.type === "textarea" || f.type === "checkbox" ? "sm:col-span-2" : ""}>
                  <DynamicField field={f} value={details[f.key]} onChange={(v) => updateField(f.key, v)} />
                </div>
              ))}
            </div>

            <Field label="Anything else caseworkers should know? (optional)">
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" className="btn-primary w-full">
              Continue to payment · {gbp(FEES[type])}
            </button>
          </form>
        )}

        {step === "payment" && (
          <PaymentPanel amount={FEES[type]} onPaid={handlePaid} onBack={() => setStep("details")} />
        )}

        {step === "done" && doneCase && (
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green">
              <Icon name="shieldCheck" size={24} />
            </span>
            <h3 className="mt-3 text-lg font-bold text-ink">
              {doneCase.payment?.status === "Paid" ? "Payment received" : "Transfer noted"}
            </h3>
            <p className="mt-1 text-sm text-mute">
              Your {doneCase.type.toLowerCase()} has been submitted.
              {doneCase.payment?.status !== "Paid" && " We'll confirm your bank transfer within 1–2 working days."}
            </p>
            <dl className="mx-auto mt-4 max-w-xs space-y-1 rounded-lg bg-sand/60 p-3 text-left text-sm">
              <div className="flex justify-between"><dt className="text-mute">Application ref</dt><dd className="font-mono font-medium">{doneCase.caseRef}</dd></div>
              <div className="flex justify-between"><dt className="text-mute">Receipt</dt><dd className="font-mono font-medium">{doneCase.payment?.receiptNo}</dd></div>
              <div className="flex justify-between"><dt className="text-mute">Amount</dt><dd className="font-medium">{gbp(doneCase.payment?.amount || 0)}</dd></div>
            </dl>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={() => {
                  setReceipt(doneCase);
                  closeModal();
                }}
                className="btn-secondary"
              >
                View receipt
              </button>
              <button onClick={closeModal} className="btn-primary">Done</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Payment receipt">
        {receipt && receipt.payment && (
          <div>
            <div id="receipt-print" className="rounded-lg border border-black/10 p-4 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-green">
                Sierra Leone High Commission, UK
              </p>
              <p className="mt-0.5 text-base font-bold text-ink">Receipt {receipt.payment.receiptNo}</p>
              <dl className="mt-3 space-y-1.5">
                <div className="flex justify-between gap-4"><dt className="text-mute">Service</dt><dd className="text-right font-medium">{receipt.type}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-mute">Application ref</dt><dd className="font-mono font-medium">{receipt.caseRef}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-mute">Paid by</dt><dd className="text-right font-medium">{currentMember.fullName}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-mute">Method</dt><dd className="text-right font-medium">{receipt.payment.detail || receipt.payment.methodName}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-mute">Date</dt><dd className="font-medium">{new Date(receipt.payment.paidAt).toLocaleString("en-GB")}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-mute">Status</dt><dd className="font-medium">{receipt.payment.status}</dd></div>
                <div className="flex justify-between gap-4 border-t border-black/10 pt-2 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold">{gbp(receipt.payment.amount)}</dd></div>
              </dl>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => window.print()} className="btn-primary flex-1">Print receipt</button>
              <button onClick={() => setReceipt(null)} className="btn-secondary flex-1">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
