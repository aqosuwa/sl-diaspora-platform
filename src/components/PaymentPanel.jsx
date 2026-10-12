import { useEffect, useRef, useState } from "react";
import {
  BANK_DETAILS,
  PAYMENT_METHODS,
  cardBrand,
  gbp,
  makeReceiptNo,
  methodById,
  sle,
} from "../data/payments";
import { Field, Input } from "./FormField";

const digits = (s) => s.replace(/\D/g, "");

export default function PaymentPanel({ amount, onPaid, onBack }) {
  const [methodId, setMethodId] = useState("orange");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [stage, setStage] = useState("form"); // form | otp | processing
  const [error, setError] = useState("");
  const [bankRef] = useState(() => `SLHC-${Math.floor(100000 + Math.random() * 900000)}`);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const method = methodById(methodId);

  function pick(id) {
    setMethodId(id);
    setError("");
    setStage("form");
    setCode("");
  }

  function finish(extra) {
    setStage("processing");
    timer.current = setTimeout(() => {
      onPaid({
        method: method.id,
        methodName: method.name,
        amount,
        currency: "GBP",
        receiptNo: makeReceiptNo(),
        paidAt: new Date().toISOString(),
        status: "Paid",
        ...extra,
      });
    }, 1400);
  }

  function declined(msg) {
    setStage("form");
    setCode("");
    setError(msg);
  }

  function startMobile(e) {
    e.preventDefault();
    const d = digits(phone);
    if (d.length < 8 || d.length > 11) {
      setError("Enter a valid Sierra Leone mobile number, e.g. 076 123 456.");
      return;
    }
    setError("");
    setStage("otp");
  }

  function confirmMobile(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit approval code.");
      return;
    }
    if (code === "000000") {
      declined("The payment was declined by your provider. Please try again or choose another method.");
      return;
    }
    setError("");
    finish({ detail: `${method.name} ••• ${digits(phone).slice(-3)}` });
  }

  function payCard(e) {
    e.preventDefault();
    const n = digits(card.number);
    const brand = cardBrand(n);
    if (!card.name.trim()) return setError("Enter the name on the card.");
    if (!brand || n.length !== 16) return setError("Enter a valid 16-digit Visa or Mastercard number.");
    const m = card.expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m || +m[1] < 1 || +m[1] > 12) return setError("Enter the expiry date as MM/YY.");
    const now = new Date();
    const exp = new Date(2000 + +m[2], +m[1], 0, 23, 59);
    if (exp < now) return setError("This card has expired.");
    if (!/^\d{3}$/.test(card.cvv)) return setError("Enter the 3-digit security code.");
    if (n.endsWith("0000")) return declined("Your card was declined. Please try another card or method.");
    setError("");
    finish({ detail: `${brand} •••• ${n.slice(-4)}` });
  }

  function payBank(e) {
    e.preventDefault();
    setError("");
    setStage("processing");
    timer.current = setTimeout(() => {
      onPaid({
        method: "bank",
        methodName: method.name,
        amount,
        currency: "GBP",
        receiptNo: makeReceiptNo(),
        paidAt: new Date().toISOString(),
        status: "Awaiting confirmation",
        detail: `Bank transfer · ref ${bankRef}`,
        reference: bankRef,
      });
    }, 900);
  }

  if (stage === "processing") {
    return (
      <div className="py-10 text-center" role="status">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green/20 border-t-green" />
        <p className="mt-4 text-sm font-medium text-ink">Processing your payment…</p>
        <p className="mt-1 text-xs text-mute">Please don't close this window.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg border border-black/10 bg-sand/60 p-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-mute">Application fee</span>
          <span className="font-semibold text-ink">{gbp(amount)}</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between text-xs text-mute">
          <span>Approx. in Leones (mobile money)</span>
          <span>{sle(amount)}</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-black/10 pt-3">
          <span className="text-sm font-bold text-ink">Total to pay</span>
          <span className="text-lg font-extrabold text-ink">{gbp(amount)}</span>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-ink">Choose how to pay</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition ${
                methodId === m.id ? "border-green bg-green-50" : "border-black/10 bg-white hover:border-black/25"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={m.id}
                checked={methodId === m.id}
                onChange={() => pick(m.id)}
                className="mt-1 accent-[#0b5132]"
              />
              <span
                className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-sm"
                style={{ background: m.color }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{m.name}</span>
                <span className="block text-xs text-mute">{m.blurb}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        {method.kind === "mobile" && stage === "form" && (
          <form onSubmit={startMobile} className="space-y-3">
            <Field label={`${method.name} number`} hint={`Sierra Leone number, ${method.prefixHint}`}>
              <Input
                inputMode="tel"
                autoComplete="tel"
                placeholder="+232 76 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <button type="submit" className="btn-primary w-full">
              Send payment request · {gbp(amount)}
            </button>
          </form>
        )}

        {method.kind === "mobile" && stage === "otp" && (
          <form onSubmit={confirmMobile} className="space-y-3">
            <p className="rounded-lg bg-blue/10 px-3 py-2 text-sm text-ink">
              A payment request of <strong>{sle(amount)}</strong> was sent to <strong>{phone}</strong>. Approve it on
              your phone, then enter the 6-digit code you receive.
            </p>
            <Field label="Approval code">
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(digits(e.target.value))}
              />
            </Field>
            <button type="submit" className="btn-primary w-full">
              Confirm payment
            </button>
            <button type="button" onClick={() => setStage("form")} className="w-full text-sm font-medium text-blue hover:underline">
              Use a different number
            </button>
          </form>
        )}

        {method.kind === "card" && (
          <form onSubmit={payCard} className="space-y-3">
            <Field label="Name on card">
              <Input autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
            </Field>
            <Field label={`Card number${cardBrand(card.number) ? ` · ${cardBrand(card.number)}` : ""}`}>
              <Input
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={card.number}
                onChange={(e) =>
                  setCard({ ...card, number: digits(e.target.value).slice(0, 16).replace(/(.{4})/g, "$1 ").trim() })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry (MM/YY)">
                <Input
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={card.expiry}
                  onChange={(e) => {
                    const d = digits(e.target.value).slice(0, 4);
                    setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
                  }}
                />
              </Field>
              <Field label="Security code">
                <Input
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={3}
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: digits(e.target.value).slice(0, 3) })}
                />
              </Field>
            </div>
            <button type="submit" className="btn-primary w-full">
              Pay {gbp(amount)}
            </button>
          </form>
        )}

        {method.kind === "bank" && (
          <form onSubmit={payBank} className="space-y-3">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-black/10 p-3 text-sm">
              <dt className="text-mute">Account name</dt>
              <dd className="font-medium text-ink">{BANK_DETAILS.accountName}</dd>
              <dt className="text-mute">Bank</dt>
              <dd className="font-medium text-ink">{BANK_DETAILS.bank}</dd>
              <dt className="text-mute">Sort code</dt>
              <dd className="font-mono font-medium text-ink">{BANK_DETAILS.sortCode}</dd>
              <dt className="text-mute">Account number</dt>
              <dd className="font-mono font-medium text-ink">{BANK_DETAILS.accountNumber}</dd>
              <dt className="text-mute">Payment reference</dt>
              <dd className="font-mono font-bold text-ink">{bankRef}</dd>
            </dl>
            <p className="text-xs text-mute">
              Use the reference exactly as shown. Commission staff confirm bank transfers within 1–2 working days; your
              application is queued straight away.
            </p>
            <button type="submit" className="btn-primary w-full">
              I've made the transfer
            </button>
          </form>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button type="button" onClick={onBack} className="mt-4 text-sm font-medium text-blue hover:underline">
        ← Back to application details
      </button>
      <p className="mt-4 text-xs text-mute">Payments are encrypted. Card details are never stored.</p>
    </div>
  );
}
