import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Field, Input } from "../../components/FormField";
import Icon from "../../components/Icon";

export default function AdminLogin() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function enter(addr) {
    const s = actions.loginCommission(addr);
    if (!s) {
      setError("No active Commission staff account uses that email.");
      return;
    }
    navigate("/admin");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-green-dark/[0.06] sm:p-9">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-blue">
          <Icon name="shield" size={22} />
        </span>
        <h1 className="mt-4 text-3xl">Commission staff sign in</h1>
        <p className="mt-1 text-sm text-muted">
          For Sierra Leone High Commission, UK caseworkers handling consular cases and referrals.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); enter(email); }} className="mt-6 space-y-4">
          <Field label="Work email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@slhc.gov.sl" />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">Sign in</button>
        </form>
        <div className="mt-8 rounded-2xl bg-cream p-4">
          <p className="text-sm font-medium text-ink">Quick sign in</p>
          <p className="text-xs text-mute">Continue as a Commission staff account.</p>
          <div className="mt-3 flex flex-col gap-2">
            {state.staff.filter((s) => s.area === "commission" && s.active).map((s) => (
              <button
                key={s.id}
                onClick={() => enter(s.email)}
                className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-left text-sm shadow-card ring-1 ring-green-dark/[0.06] transition hover:bg-green-50 hover:ring-green/30"
              >
                <span className="font-medium text-charcoal">{s.name}</span>
                <span className="whitespace-nowrap pl-2 text-xs text-muted">{s.role}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-muted">
          Not Commission staff? <Link to="/login" className="font-medium text-green hover:underline">Member login</Link>
        </p>
      </div>
    </div>
  );
}
